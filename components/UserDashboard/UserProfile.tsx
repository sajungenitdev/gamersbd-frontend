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
  Key,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useUserAuth } from "../../app/contexts/UserAuthContext";

export default function UserProfile() {
  const { user, updateUser, token, refreshUser, changePassword, deleteAccount } = useUserAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    gender: user?.gender || "prefer_not_to_say",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postalCode: user?.address?.postalCode || "",
      country: user?.address?.country || "Bangladesh",
    },
    social: {
      facebook: user?.social?.facebook || "",
      twitter: user?.social?.twitter || "",
      instagram: user?.social?.instagram || "",
      linkedin: user?.social?.linkedin || "",
      discord: user?.social?.discord || "",
    },
    preferences: {
      newsletter: user?.preferences?.newsletter || false,
      emailNotifications: user?.preferences?.emailNotifications ?? true,
      theme: user?.preferences?.theme || "dark",
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

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes(".")) {
      const [parent, child] = name.split(".") as [keyof typeof formData, string];

      setFormData((prev) => {
        const parentValue = prev[parent];

        if (
          parentValue &&
          typeof parentValue === "object" &&
          !Array.isArray(parentValue)
        ) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: type === "checkbox" ? checked : value,
            },
          };
        }

        return {
          ...prev,
          [parent]: { [child]: type === "checkbox" ? checked : value } as any,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordFields(false);
      setIsChangingPassword(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to change password");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsLoading(false);
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
        gender: formData.gender,
        address: formData.address,
        social: formData.social,
        preferences: formData.preferences,
      };

      // Add avatar base64 if changed
      if (avatarBase64 && avatarBase64 !== user?.avatar) {
        updateData.avatar = avatarBase64;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update local user data
      const updatedUserData = {
        ...user,
        ...updateData,
        name: `${updateData.firstName} ${updateData.lastName}`.trim(),
        avatar: avatarBase64 || user?.avatar,
      };

      if (updateUser) {
        updateUser(updatedUserData);
      }

      await refreshUser(); // Refresh from server to ensure consistency

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

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
      return;
    }

    setIsDeletingAccount(true);
    setError("");
    setSuccess("");

    try {
      await deleteAccount();
      // User will be redirected to home page automatically by the context
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsDeletingAccount(false);
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

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header with Edit/Save buttons */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <div className="flex gap-3">
          {!isEditing && !isChangingPassword && (
            <>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Key size={18} />
                Change Password
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            </>
          )}
          {(isEditing || isChangingPassword) && (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setIsChangingPassword(false);
                  setShowPasswordFields(false);
                  setAvatarBase64(user?.avatar || "");
                  setAvatarFile(null);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setFormData({
                    firstName: user?.firstName || "",
                    lastName: user?.lastName || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    bio: user?.bio || "",
                    gender: user?.gender || "prefer_not_to_say",
                    address: {
                      street: user?.address?.street || "",
                      city: user?.address?.city || "",
                      state: user?.address?.state || "",
                      postalCode: user?.address?.postalCode || "",
                      country: user?.address?.country || "Bangladesh",
                    },
                    social: {
                      facebook: user?.social?.facebook || "",
                      twitter: user?.social?.twitter || "",
                      instagram: user?.social?.instagram || "",
                      linkedin: user?.social?.linkedin || "",
                      discord: user?.social?.discord || "",
                    },
                    preferences: {
                      newsletter: user?.preferences?.newsletter || false,
                      emailNotifications: user?.preferences?.emailNotifications ?? true,
                      theme: user?.preferences?.theme || "dark",
                    },
                  });
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
              {isEditing && (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 animate-in fade-in duration-300 flex items-center gap-2">
          <CheckCircle size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 animate-in fade-in duration-300 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Password Change Form */}
      {isChangingPassword && (
        <div className="mb-6 bg-[#161618]/40 backdrop-blur-2xl rounded-2xl border border-white/5 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
          <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isLoading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setShowPasswordFields(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-[#161618]/40 backdrop-blur-2xl rounded-2xl border border-white/5 overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            {/* Avatar with edit option */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center overflow-hidden">
                {avatarBase64 ? (
                  <img
                    src={avatarBase64}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {getUserInitials()}
                  </span>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-500 transition-colors">
                  <Camera size={16} className="text-white" />
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
                  <p className="text-gray-400 capitalize mt-3">Role: <span className="text-orange-600">{user?.role}</span></p>
                  {/* <p className="text-sm text-purple-400 mt-1">
                    {user?.emailVerified ? "✓ Email Verified" : "⚠ Email not verified"}
                  </p> */}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3 flex-wrap">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="flex-1 min-w-[150px] px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="flex-1 min-w-[150px] px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                  >
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
            {!user?.emailVerified && (
              <button className="text-xs text-purple-400 hover:text-purple-300">
                Verify Email
              </button>
            )}
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
                <label className="text-xs text-gray-500">Street</label>
                {!isEditing ? (
                  <p className="text-white">{user?.address?.street || "Not provided"}</p>
                ) : (
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-purple-500 outline-none"
                  />
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500">City</label>
                {!isEditing ? (
                  <p className="text-white">{user?.address?.city || "Not provided"}</p>
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
                  <p className="text-white">{user?.address?.state || "Not provided"}</p>
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
                  <p className="text-white">{user?.address?.postalCode || "Not provided"}</p>
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
              <div>
                <label className="text-xs text-gray-500">Country</label>
                {!isEditing ? (
                  <p className="text-white">{user?.address?.country || "Not provided"}</p>
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
                <Facebook size={18} className="text-blue-400 flex-shrink-0" />
                {!isEditing ? (
                  <p className="text-white flex-1 truncate">
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
                <Twitter size={18} className="text-blue-400 flex-shrink-0" />
                {!isEditing ? (
                  <p className="text-white flex-1 truncate">
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
                <Instagram size={18} className="text-pink-400 flex-shrink-0" />
                {!isEditing ? (
                  <p className="text-white flex-1 truncate">
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
                <Linkedin size={18} className="text-blue-600 flex-shrink-0" />
                {!isEditing ? (
                  <p className="text-white flex-1 truncate">
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

          {/* Preferences Section */}
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
              <p className="text-sm text-gray-400">Preferences</p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white">Newsletter Subscription</span>
                {!isEditing ? (
                  <span className={`px-2 py-1 rounded text-xs ${user?.preferences?.newsletter ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {user?.preferences?.newsletter ? "Subscribed" : "Not Subscribed"}
                  </span>
                ) : (
                  <input
                    type="checkbox"
                    name="preferences.newsletter"
                    checked={formData.preferences.newsletter}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-600 bg-transparent text-purple-500 focus:ring-purple-500"
                  />
                )}
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white">Email Notifications</span>
                {!isEditing ? (
                  <span className={`px-2 py-1 rounded text-xs ${user?.preferences?.emailNotifications ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {user?.preferences?.emailNotifications ? "Enabled" : "Disabled"}
                  </span>
                ) : (
                  <input
                    type="checkbox"
                    name="preferences.emailNotifications"
                    checked={formData.preferences.emailNotifications}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-600 bg-transparent text-purple-500 focus:ring-purple-500"
                  />
                )}
              </label>
            </div>
          </div>

          {/* Account Status - Readonly */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
            <Shield className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Account Status</p>
              <p className={`font-medium ${user?.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                {user?.status || "Active"}
              </p>
            </div>
          </div>

          {/* Member Since - Readonly */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
            <Calendar className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Account Stats - Readonly */}
          {user?.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user.stats.totalOrders || 0}</p>
                <p className="text-xs text-gray-400">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">${user.stats.totalSpent || 0}</p>
                <p className="text-xs text-gray-400">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user.stats.loginCount || 0}</p>
                <p className="text-xs text-gray-400">Logins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{user.stats.reviewsWritten || 0}</p>
                <p className="text-xs text-gray-400">Reviews</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
              <Trash2 size={20} />
              Delete Account
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Once you delete your account, there is no going back. This action is permanent.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isDeletingAccount ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            {isDeletingAccount ? "Deleting..." : "Delete My Account"}
          </button>
        </div>
      </div>
    </div>
  );
}