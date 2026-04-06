// app/contact/page.tsx (or components/ContactPage.tsx)
"use client";
import React, { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://gamersbd-server.onrender.com/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Reset success message after 3 seconds
        setTimeout(() => {
          setFormStatus("idle");
        }, 3000);
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      setFormStatus("error");
      setErrorMessage(
        error.message || "Failed to send message. Please try again.",
      );

      setTimeout(() => {
        setFormStatus("idle");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#2a2a2a] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Rest of your JSX remains the same until the form */}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Information Cards */}
            <div className="space-y-6 animate-fade-in-up delay-300">
            {/* Address */}
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Our Location
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    123 Business Avenue
                    <br />
                    Tech District, CA 94103
                    <br />
                    United States
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <a
                      href="#"
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-2"
                    >
                      Get Directions
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-6">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Email Us
                  </h3>
                  <p className="text-gray-300 mb-2">
                    <a
                      href="mailto:support@example.com"
                      className="hover:text-purple-400 transition-colors inline-flex items-center gap-2 group/email"
                    >
                      support@example.com
                      <span className="opacity-0 group-hover/email:opacity-100 transition-opacity">
                        →
                      </span>
                    </a>
                  </p>
                  <p className="text-gray-300">
                    <a
                      href="mailto:info@example.com"
                      className="hover:text-purple-400 transition-colors inline-flex items-center gap-2 group/email"
                    >
                      info@example.com
                      <span className="opacity-0 group-hover/email:opacity-100 transition-opacity">
                        →
                      </span>
                    </a>
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400">
                      We usually respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Call Us
                  </h3>
                  <p className="text-gray-300 mb-2">
                    <a
                      href="tel:+1234567890"
                      className="hover:text-purple-400 transition-colors inline-flex items-center gap-2 group/phone"
                    >
                      +1 (234) 567-890
                      <span className="opacity-0 group-hover/phone:opacity-100 transition-opacity">
                        →
                      </span>
                    </a>
                  </p>
                  <p className="text-gray-300">
                    <a
                      href="tel:+0987654321"
                      className="hover:text-purple-400 transition-colors inline-flex items-center gap-2 group/phone"
                    >
                      +1 (098) 765-4321
                      <span className="opacity-0 group-hover/phone:opacity-100 transition-opacity">
                        →
                      </span>
                    </a>
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-400">
                      Mon-Fri, 9am to 6pm EST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                <Send className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Send a Message</h2>
            </div>

            {formStatus === "success" ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-300">
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
              </div>
            ) : formStatus === "error" ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Failed to Send
                </h3>
                <p className="text-gray-300">{errorMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:border-purple-500/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:border-purple-500/50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:border-purple-500/50"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:border-purple-500/50 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Send Message
                    </div>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div>
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-6 px-4">
              <h2 className="text-2xl font-bold text-white">
                Visit Our Office
              </h2>
            </div>
            <div className="rounded-2xl overflow-hidden h-96 w-full">
              <iframe
                title="Google Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086577234527!2d-122.4194154846817!3d37.774929279759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f0e6e6e9%3A0x6b3b7c6c5b5b5b5b!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
