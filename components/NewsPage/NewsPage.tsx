"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  Filter,
  Grid,
  List,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { blogService, Blog } from "../../services/blog.service";

// Format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Calculate read time
const calculateReadTime = (content: string) => {
  if (!content) return "5 min read";
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  return `${readTime} min read`;
};

// Blog Card Component
const BlogCard = ({
  post,
  viewMode = "grid",
}: {
  post: Blog;
  viewMode?: "grid" | "list";
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!isLiked) {
        await blogService.likeBlog(post._id);
        setLikesCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  if (viewMode === "list") {
    return (
      <div className="group bg-[#2A2A2A] rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-500">
        <Link href={`/news/${post._id}`}>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-72 h-64 md:h-auto relative overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              )}
              <img
                src={
                  post.image ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={post.title}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1.5 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="flex-1 p-6">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {calculateReadTime(post.content)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views || 0}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                {post.title}
              </h2>

              <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

              <div className="flex items-center gap-3 mb-4">
                {post.author?.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                    {post.author?.name?.charAt(0) || "A"}
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">
                    {post.author?.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {post.author?.role || "Contributor"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                    />
                    <span>{likesCount}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.commentCount || 0}</span>
                  </button>
                  <button className="text-gray-400 hover:text-purple-400 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`transition-colors ${isSaved ? "text-purple-400" : "text-gray-400 hover:text-purple-400"}`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isSaved ? "fill-purple-400" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="group bg-[#2A2A2A] rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-500 h-full flex flex-col">
      <Link href={`/news/${post._id}`}>
        <div className="relative h-48 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          )}
          <img
            src={
              post.image || "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={post.title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute top-3 left-3 z-20">
            <span className="px-2 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
              {post.category}
            </span>
          </div>
          {post.featured && (
            <div className="absolute top-3 right-3 z-20">
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {calculateReadTime(post.content)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 mb-4">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {post.author?.name?.charAt(0) || "A"}
              </div>
            )}
            <div>
              <p className="text-sm text-white font-medium">
                {post.author?.name || "Anonymous"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                />
                <span>{likesCount}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentCount || 0}</span>
              </button>
            </div>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`transition-colors ${isSaved ? "text-purple-400" : "text-gray-400 hover:text-purple-400"}`}
            >
              <Bookmark
                className={`w-4 h-4 ${isSaved ? "fill-purple-400" : ""}`}
              />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Main News Page Component
const NewsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllBlogs({ isPublished: true });
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Get unique categories from blogs
  const categories = () => {
    const cats = new Map<string, number>();
    cats.set("All Posts", blogs.length);
    blogs.forEach((blog) => {
      if (blog.category) {
        cats.set(blog.category, (cats.get(blog.category) || 0) + 1);
      }
    });
    return Array.from(cats.entries()).map(([name, count]) => ({ name, count }));
  };

  // Get popular tags
  const popularTags = () => {
    const tags = new Map<string, number>();
    blogs.forEach((blog) => {
      blog.tags?.forEach((tag) => {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      });
    });
    return Array.from(tags.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  };

  // Filter posts
  const filteredPosts = blogs.filter((post) => {
    if (selectedCategory !== "All Posts" && post.category !== selectedCategory)
      return false;
    if (searchQuery) {
      return (
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      );
    }
    return true;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] text-white rounded-xl border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-xl border transition-colors ${viewMode === "grid" ? "bg-purple-600 border-purple-500 text-white" : "bg-[#2A2A2A] border-gray-700 text-gray-400 hover:border-purple-500"}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-xl border transition-colors ${viewMode === "list" ? "bg-purple-600 border-purple-500 text-white" : "bg-[#2A2A2A] border-gray-700 text-gray-400 hover:border-purple-500"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories().map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? "bg-purple-600/20 text-purple-400"
                          : "hover:bg-white/5 text-gray-400"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              {popularTags().length > 0 && (
                <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags().map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1.5 bg-[#1a1a1a] text-gray-400 text-sm rounded-full border border-gray-700 hover:border-purple-500 hover:text-purple-400 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="bg-[#2A2A2A] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Instagram, Linkedin].map(
                    (Icon, index) => (
                      <a
                        key={index}
                        href="#"
                        className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center hover:bg-purple-600 transition-all duration-300 hover:scale-110"
                      >
                        <Icon className="w-5 h-5 text-gray-400 hover:text-white" />
                      </a>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            {currentPosts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {currentPosts.map((post) => (
                  <BlogCard key={post._id} post={post} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#2A2A2A] rounded-2xl border border-gray-800">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-[#2A2A2A] text-gray-400 hover:bg-purple-600/20 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === i + 1 ? "bg-purple-600 text-white" : "bg-[#2A2A2A] text-gray-400 hover:bg-purple-600/20 hover:text-purple-400"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-[#2A2A2A] text-gray-400 hover:bg-purple-600/20 hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
