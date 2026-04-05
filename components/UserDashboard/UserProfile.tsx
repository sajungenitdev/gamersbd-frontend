// app/(dashboard)/profile/page.tsx
"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit2,
  Save,
  X,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Camera,
} from "lucide-react";
import { useUserAuth } from "../../app/contexts/UserAuthContext";
import Image from "next/image";

export default function UserProfile() {
  const { user, updateUser, token } = useUserAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    address: {
      country: user?.address?.country || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postalCode: user?.address?.postalCode || "",
    },
    social: {
      facebook: user?.social?.facebook || "",
      twitter: user?.social?.twitter || "",
      instagram: user?.social?.instagram || "",
      linkedin: user?.social?.linkedin || "",
    },
  });

  const [avatarBase64, setAvatarBase64] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
        setTimeout(() => setError(""), 3000);
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        setTimeout(() => setError(""), 3000);
        return;
      }

      setAvatarFile(file);
      try {
        const base64 = await convertToBase64(file);
        setAvatarBase64(base64);
      } catch (err) {
        console.error("Error converting image:", err);
        setError("Failed to process image");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".") as [
        keyof typeof formData,
        string,
      ];

      setFormData((prev) => {
        // Ensure parent exists and is an object
        const parentValue = prev[parent];

        // Type guard: check if parentValue is an object and not null
        if (
          parentValue &&
          typeof parentValue === "object" &&
          !Array.isArray(parentValue)
        ) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value,
            },
          };
        }

        // Fallback if parent doesn't exist or isn't an object
        return {
          ...prev,
          [parent]: { [child]: value } as any,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare update data
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        address: formData.address,
        social: formData.social,
      };

      // Add avatar base64 if changed
      if (avatarBase64 && avatarBase64 !== user?.avatar) {
        updateData.avatar = avatarBase64;
      }

      // API call to update user
      const response = await fetch(
        "https://gamersbd-server.onrender.com/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local user data
      const updatedUserData = {
        ...updateData,
        name: `${updateData.firstName} ${updateData.lastName}`.trim(),
        email: formData.email,
        avatar: avatarBase64 || user?.avatar,
      };

      updateUser(updatedUserData);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const getFullName = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`;
    }
    return user?.name || "User";
  };

  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    return user?.name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Edit/Save buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                // Reset avatar preview
                setAvatarBase64(user?.avatar || "");
                setAvatarFile(null);
                // Reset form data
                setFormData({
                  firstName: user?.firstName || "",
                  lastName: user?.lastName || "",
                  email: user?.email || "",
                  phone: user?.phone || "",
                  bio: user?.bio || "",
                  address: {
                    country: user?.address?.country || "",
                    city: user?.address?.city || "",
                    state: user?.address?.state || "",
                    postalCode: user?.address?.postalCode || "",
                  },
                  social: {
                    facebook: user?.social?.facebook || "",
                    twitter: user?.social?.twitter || "",
                    instagram: user?.social?.instagram || "",
                    linkedin: user?.social?.linkedin || "",
                  },
                });
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 animate-in fade-in duration-300">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 animate-in fade-in duration-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-[#161618]/40 backdrop-blur-2xl rounded-2xl border border-white/5 overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              {/* Avatar with edit option */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center overflow-hidden">
                  {avatarBase64 ? (
                    <Image
                      src={avatarBase64}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {getUserInitials()}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-1.5 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-500 transition-colors">
                    <Camera size={14} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1">
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-bold text-white">
                      {getFullName()}
                    </h2>
                    <p className="text-gray-400 capitalize">{user?.role}</p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Email - Readonly */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Mail className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Email Address</p>
                <p className="text-white">{user?.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Phone className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Phone Number</p>
                {!isEditing ? (
                  <p className="text-white">{user?.phone || "Not provided"}</p>
                ) : (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                  />
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
              <User className="w-5 h-5 text-purple-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Bio</p>
                {!isEditing ? (
                  <p className="text-white">{user?.bio || "No bio added"}</p>
                ) : (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    rows={3}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none resize-none"
                  />
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-purple-400" />
                <p className="text-sm text-gray-400">Address Information</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Country</label>
                  {!isEditing ? (
                    <p className="text-white">
                      {user?.address?.country || "Not provided"}
                    </p>
                  ) : (
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">City</label>
                  {!isEditing ? (
                    <p className="text-white">
                      {user?.address?.city || "Not provided"}
                    </p>
                  ) : (
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">State</label>
                  {!isEditing ? (
                    <p className="text-white">
                      {user?.address?.state || "Not provided"}
                    </p>
                  ) : (
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">Postal Code</label>
                  {!isEditing ? (
                    <p className="text-white">
                      {user?.address?.postalCode || "Not provided"}
                    </p>
                  ) : (
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-purple-400" />
                <p className="text-sm text-gray-400">Social Media</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Facebook size={18} className="text-blue-400" />
                  {!isEditing ? (
                    <p className="text-white flex-1">
                      {user?.social?.facebook || "Not connected"}
                    </p>
                  ) : (
                    <input
                      type="url"
                      name="social.facebook"
                      value={formData.social.facebook}
                      onChange={handleInputChange}
                      placeholder="Facebook URL"
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Twitter size={18} className="text-blue-400" />
                  {!isEditing ? (
                    <p className="text-white flex-1">
                      {user?.social?.twitter || "Not connected"}
                    </p>
                  ) : (
                    <input
                      type="url"
                      name="social.twitter"
                      value={formData.social.twitter}
                      onChange={handleInputChange}
                      placeholder="Twitter URL"
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Instagram size={18} className="text-pink-400" />
                  {!isEditing ? (
                    <p className="text-white flex-1">
                      {user?.social?.instagram || "Not connected"}
                    </p>
                  ) : (
                    <input
                      type="url"
                      name="social.instagram"
                      value={formData.social.instagram}
                      onChange={handleInputChange}
                      placeholder="Instagram URL"
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin size={18} className="text-blue-600" />
                  {!isEditing ? (
                    <p className="text-white flex-1">
                      {user?.social?.linkedin || "Not connected"}
                    </p>
                  ) : (
                    <input
                      type="url"
                      name="social.linkedin"
                      value={formData.social.linkedin}
                      onChange={handleInputChange}
                      placeholder="LinkedIn URL"
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Account Status - Readonly */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Shield className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Account Status</p>
                <p className="text-green-400">Active</p>
              </div>
            </div>

            {/* Member Since - Readonly */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-white">{new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
