import React from "react";
import {
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Send,
  InstagramIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const footerLinks = {
    information: [
      { label: "Special Offers", href: "/specials" }, // Fixed typo
      { label: "New Products", href: "/new" },
      { label: "Top Sellers", href: "/top-sellers" },
      { label: "About Us", href: "/about" },
      { label: "FAQs", href: "/faq" },
      { label: "Order Tracking", href: "/track-order" },
    ],
    services: [
      { label: "My Account", href: "/account" },
      { label: "Login/Register", href: "/login" },
      { label: "My Orders", href: "/orders" },
      { label: "My Addresses", href: "/addresses" },
      { label: "Order Help", href: "/contact" }, // Fixed plural
      { label: "Support", href: "/contact" },
    ],
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/gamersbd",
      label: "Facebook",
    },
    { icon: Youtube, href: "https://youtube.com/gamersbd", label: "Youtube" },
    { icon: Mail, href: "mailto:gamersbd.world@gmail.com", label: "Email" },
    {
      icon: InstagramIcon,
      href: "https://instagram.com/gamersbd",
      label: "Instagram",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log("Newsletter subscribed");
  };

  return (
    <>
      <footer className="bg-[#1f1f1f] dark:bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto ">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-16">
            {/* Column 1: Logo & Contact */}
            <div className="space-y-6">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/GamersBD-logo.png"
                  alt="GamersBD"
                  width={160}
                  height={45}
                  className="h-auto w-auto brightness-0 invert dark:invert-0"
                  priority
                />
              </Link>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-400 dark:text-gray-600">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#d88616]" />
                  <p className="text-sm">
                    11C, Haque Chamber, 89/2, Panthapath, Dhaka-1215
                  </p>
                </div>

                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
                  <Mail className="w-5 h-5 flex-shrink-0 text-[#d88616]" />
                  <a
                    href="mailto:gamersbd.world@gmail.com"
                    className="text-sm hover:text-[#d88616] transition-colors"
                  >
                    gamersbd.world@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
                  <Phone className="w-5 h-5 flex-shrink-0 text-[#d88616]" />
                  <div className="flex flex-wrap gap-2 text-sm">
                    <a
                      href="tel:+880291100348"
                      className="hover:text-[#d88616] transition-colors"
                    >
                      +88 02 91100348
                    </a>
                    {/* <span className="text-gray-600 dark:text-gray-400">|</span> */}
                    {/* <a
                      href="tel:+8801971424220"
                      className="hover:text-[#d88616] transition-colors"
                    >
                      +88 01971424220
                    </a> */}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 pt-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 dark:bg-gray-200 rounded-lg flex items-center justify-center hover:bg-[#d88616] dark:hover:bg-[#d88616] transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Information */}
            <div>
              <h3 className="text-white dark:text-black text-lg font-semibold uppercase tracking-wider mb-4 pb-3 border-b border-gray-800 dark:border-gray-300 relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-12 after:h-0.5 after:bg-[#d88616]">
                Information
              </h3>
              <ul className="space-y-3">
                {footerLinks.information.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 dark:text-gray-600 hover:text-[#d88616] transition-colors inline-flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 text-[#d88616] opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            <div>
              <h3 className="text-white dark:text-black text-lg font-semibold uppercase tracking-wider mb-4 pb-3 border-b border-gray-800 dark:border-gray-300 relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-12 after:h-0.5 after:bg-[#d88616]">
                Services
              </h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 dark:text-gray-600 hover:text-[#d88616] transition-colors inline-flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3 h-3 text-[#d88616] opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="space-y-4">
              <h3 className="text-white dark:text-black text-lg font-semibold uppercase tracking-wider mb-4 pb-3 border-b border-gray-800 dark:border-gray-300 relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-12 after:h-0.5 after:bg-[#d88616]">
                Newsletter
              </h3>

              <p className="text-sm text-gray-400 dark:text-gray-600 leading-relaxed">
                Subscribe to get updates on new games, exclusive offers, and
                more!
              </p>

              <form className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg border border-gray-700 dark:border-gray-300 focus:border-[#d88616] focus:outline-none focus:ring-1 focus:ring-[#d88616] transition-colors text-sm placeholder:text-gray-500 dark:placeholder:text-gray-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#d88616] to-pink-600 hover:from-[#d88616] hover:to-pink-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm group"
                >
                  Subscribe
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <p className="text-xs text-gray-500 dark:text-gray-500">
                *No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-[#1a1a1a] dark:bg-white border-t border-gray-800 dark:border-gray-200 transition-colors duration-300">
        <div className="max-w-7xl mx-auto ">
          <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 dark:text-gray-600 order-2 md:order-1">
              Copyright © {new Date().getFullYear()}{" "}
              <Link
                href="/"
                className="text-white dark:text-black font-medium hover:text-[#d88616] transition-colors"
              >
                Gamers BD
              </Link>
              . All rights reserved.
            </p>

            <div className="flex items-center gap-2 order-1 md:order-2">
              <span className="text-xs text-gray-500 dark:text-gray-500 mr-2">
                We Accept:
              </span>
              <Image
                src="/images/payments.png"
                alt="Payment methods"
                width={280}
                height={30}
                className="w-auto h-6 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
