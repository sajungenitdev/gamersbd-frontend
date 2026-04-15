"use client";
import React, { useState } from "react";
import {
  Users,
  Target,
  Heart,
  Award,
  Globe,
  Briefcase,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Sparkles,
  Rocket,
  Shield,
  Star,
  Quote,
  Play,
  Pause,
  Eye,
} from "lucide-react";
import Link from "next/link";

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Gaming enthusiast with 15+ years of industry experience. Former game developer at Blizzard.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop",
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
    },
    expertise: ["Game Development", "Business Strategy", "Community Building"],
    quote: "Gaming is not just a hobby, it's a way of life.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Head of Content",
    bio: "Award-winning gaming journalist and content strategist with 10+ years in digital media.",
    image:
      "https://images.unsplash.com/photo-1494790108777-2961285e9489?w=400&auto=format&fit=crop",
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
    },
    expertise: ["Content Strategy", "Game Reviews", "SEO"],
    quote: "Every game has a story worth telling.",
  },
  {
    id: 3,
    name: "Mike Wilson",
    role: "Technical Lead",
    bio: "Full-stack developer and gaming hardware specialist. Built multiple gaming communities.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop",
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
    },
    expertise: ["Web Development", "Gaming Hardware", "Cloud Architecture"],
    quote:
      "Technology should enhance the gaming experience, not complicate it.",
  },
  {
    id: 4,
    name: "Emma Davis",
    role: "Community Manager",
    bio: "Passionate about building inclusive gaming communities. Organizer of annual gaming meetups.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop",
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
    },
    expertise: ["Community Management", "Event Planning", "Social Media"],
    quote: "Together, we make gaming better for everyone.",
  },
  {
    id: 5,
    name: "David Kim",
    role: "Esports Analyst",
    bio: "Former professional player turned analyst. Covers major tournaments worldwide.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
    },
    expertise: [
      "Esports Strategy",
      "Tournament Analysis",
      "Player Development",
    ],
    quote: "The competitive spirit drives innovation.",
  },
  {
    id: 6,
    name: "Dr. Lisa Park",
    role: "Gaming Psychologist",
    bio: "PhD in Cognitive Psychology, specializing in gaming's impact on mental health.",
    image:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&auto=format&fit=crop",
    social: {
      github: "#",
      twitter: "#",
      linkedin: "#",
    },
    expertise: ["Cognitive Psychology", "Mental Health", "Player Behavior"],
    quote: "Understanding the mind leads to better gaming experiences.",
  },
];

// Company milestones
const milestones = [
  {
    year: "2020",
    title: "The Beginning",
    description:
      "Started as a small gaming blog with a vision to create authentic gaming content.",
    icon: Rocket,
  },
  {
    year: "2021",
    title: "First Milestone",
    description:
      "Reached 100,000 monthly readers and launched our YouTube channel.",
    icon: Users,
  },
  {
    year: "2022",
    title: "Team Expansion",
    description:
      "Grew to 15 team members and expanded to cover esports events.",
    icon: Briefcase,
  },
  {
    year: "2023",
    title: "Global Recognition",
    description:
      "Won 'Best Gaming Content Creator' award at the Gaming Industry Awards.",
    icon: Award,
  },
  {
    year: "2024",
    title: "Community First",
    description:
      "Launched our community platform with over 50,000 active members.",
    icon: Heart,
  },
  {
    year: "2025",
    title: "Going Global",
    description: "Expanded to 10 countries with content in 5 languages.",
    icon: Globe,
  },
];

// Values
const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To create the most trusted and engaging gaming platform where players can discover, learn, and connect.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "A world where every gamer has access to quality content and a supportive community.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Heart,
    title: "Our Passion",
    description:
      "We live and breathe gaming. Every review, guide, and article comes from genuine love for the craft.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "Honest reviews, transparent partnerships, and putting our community first in every decision.",
    color: "from-green-500 to-emerald-500",
  },
];

// Stats
const stats = [
  { label: "Team Members", value: "25+", icon: Users },
  { label: "Monthly Readers", value: "500K+", icon: Users },
  { label: "Games Reviewed", value: "1000+", icon: Star },
  { label: "Community Members", value: "100K+", icon: Heart },
  { label: "Years Experience", value: "6+", icon: Award },
  { label: "Countries Reached", value: "50+", icon: Globe },
];

// Testimonials
const testimonials = [
  {
    name: "James Rodriguez",
    role: "Game Developer",
    content:
      "The most authentic gaming content I've found. Their reviews are honest and detailed.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    role: "Professional Gamer",
    content:
      "I've been following them for years. Their esports coverage is unmatched.",
    avatar:
      "https://images.unsplash.com/photo-1494790108777-2961285e9489?w=100&auto=format&fit=crop",
    rating: 5,
  },
  {
    name: "Tom Williams",
    role: "Gaming Enthusiast",
    content:
      "The community they've built is incredible. Always helpful and welcoming.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop",
    rating: 5,
  },
];

// Team Member Card Component
const TeamMemberCard = ({ member, index }: { member: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="group relative bg-[#2A2A2A] rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Image Container */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A] via-transparent to-transparent z-10"></div>
        <img
          src={member.image}
          alt={member.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Social Links - Appear on Hover */}
        <div
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20 transition-all duration-500 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <a
            href={member.social.github}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 border border-white/20"
          >
            <Github className="w-4 h-4 text-white" />
          </a>
          <a
            href={member.social.twitter}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-blue-400 transition-all duration-300 border border-white/20"
          >
            <Twitter className="w-4 h-4 text-white" />
          </a>
          <a
            href={member.social.linkedin}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 border border-white/20"
          >
            <Linkedin className="w-4 h-4 text-white" />
          </a>
        </div>

        {/* Quote Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-purple-600 transition-all duration-300 border border-white/20 z-20"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Quote className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Quote Popup */}
        {isPlaying && (
          <div className="absolute inset-0 bg-[#1a1a1a]/95 backdrop-blur-sm flex items-center justify-center p-6 z-30 animate-fade-in">
            <div className="text-center">
              <Quote className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <p className="text-white text-lg italic mb-4">"{member.quote}"</p>
              <p className="text-purple-400 font-medium">- {member.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
          {member.name}
        </h3>
        <p className="text-purple-400 text-sm mb-3">{member.role}</p>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{member.bio}</p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-2">
          {member.expertise.map((skill: string) => (
            <span
              key={skill}
              className="px-2 py-1 bg-[#1a1a1a] text-gray-400 text-xs rounded-full border border-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Value Card Component
const ValueCard = ({ value, index }: { value: any; index: number }) => (
  <div className="group bg-[#2A2A2A] rounded-2xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
    <div
      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}
    >
      <value.icon className="w-full h-full text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
      {value.title}
    </h3>
    <p className="text-gray-400 leading-relaxed">{value.description}</p>
  </div>
);

// Milestone Component
const MilestoneCard = ({
  milestone,
  index,
}: {
  milestone: any;
  index: number;
}) => {
  const Icon = milestone.icon;

  return (
    <div className="group relative">
      {/* Timeline Line (except last) */}
      {index < milestones.length - 1 && (
        <div className="absolute top-8 left-8 w-full h-0.5 bg-gradient-to-r from-purple-600/50 to-transparent hidden lg:block"></div>
      )}

      <div className="relative bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800 group-hover:border-purple-500/50 transition-all duration-500">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 p-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-full h-full text-white" />
          </div>
          <div>
            <span className="text-purple-400 font-bold text-lg">
              {milestone.year}
            </span>
            <h3 className="text-white font-semibold text-lg mb-1">
              {milestone.title}
            </h3>
            <p className="text-gray-400 text-sm">{milestone.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ stat }: { stat: any }) => {
  const Icon = stat.icon;

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-500 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-3 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-full h-full text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-sm text-gray-400">{stat.label}</p>
        </div>
      </div>
    </div>
  );
};

// Testimonial Card
const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-500">
    <div className="flex items-center gap-2 mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
    <div className="flex items-center gap-3">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/20"
      />
      <div>
        <p className="text-white font-medium">{testimonial.name}</p>
        <p className="text-sm text-gray-400">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

// Main Component
const AboutPage = () => {
  const [activeVideo, setActiveVideo] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1f1f1f] to-[#1a1a1a] py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                About Us
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
              We Are{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                GameChangers
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to create the ultimate gaming community where
              passion meets expertise, and every gamer feels at home.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Story
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Founded in 2020 by a group of passionate gamers, GameChangers
              started as a small blog sharing honest game reviews. Today, we've
              grown into a global community of millions, but our core values
              remain the same: authenticity, passion, and community first.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              We believe that gaming is more than just entertainment – it's a
              way to connect, learn, and grow. Every review, guide, and article
              we create is driven by our love for gaming and our commitment to
              helping you make the most of your gaming journey.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105">
                Join Our Community
              </button>
              <button className="px-6 py-3 border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Video/Audio Player */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-[#2A2A2A] rounded-3xl overflow-hidden border border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1542751110-97427fec2fd0?w=800&auto=format&fit=crop"
                alt="Gaming Setup"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setActiveVideo(!activeVideo)}
                    className="w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {activeVideo ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </button>
                  <div>
                    <p className="text-white font-semibold">
                      Our Journey in 2 Minutes
                    </p>
                    <p className="text-sm text-gray-400">Watch our story</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#1f1f1f] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              What We{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Stand For
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our values guide everything we do, from content creation to
              community building.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} value={value} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Amazing Team
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Passionate gamers, writers, and creators working together to bring
            you the best content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>

      {/* Milestones Section */}
      <div className="bg-gradient-to-b from-[#1f1f1f] to-[#1a1a1a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From a small blog to a global community. Here's how we grew.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <MilestoneCard key={index} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Community Says
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our readers have to
            say.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-purple-600/20 rounded-3xl p-12 border border-purple-500/30 relative overflow-hidden">
          {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div> */}

          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Join Our Growing{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of something amazing. Connect with fellow gamers, get
              exclusive content, and stay updated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Join Now
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
