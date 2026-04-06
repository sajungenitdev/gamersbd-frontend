"use client";
import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Clock,
  Tag,
  ArrowLeft,
  Loader2,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Author {
  name: string;
  avatar: string;
  role: string;
  email: string;
  bio?: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: Author;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  commentCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

interface Comment {
  _id?: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
}

const NewsDetails = ({ newsId }: { newsId: string }) => {
  const [news, setNews] = useState<Blog | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
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

  // Fetch news details
  useEffect(() => {
    const fetchNewsDetails = async () => {
      if (!newsId) {
        setError("No news ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://gamersbd-server.onrender.com/api/blogs/${newsId}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch news");
        }

        setNews(data.data);
        setLikesCount(data.data.likes || 0);

        // Fetch comments
        if (data.data._id) {
          try {
            const commentsResponse = await fetch(
              `https://gamersbd-server.onrender.com/api/blogs/${data.data._id}/comments`,
            );
            const commentsData = await commentsResponse.json();
            setComments(commentsData.data || []);
          } catch (err) {
            console.error("Error fetching comments:", err);
          }
        }

        // Fetch related posts
        if (data.data.category) {
          try {
            const relatedResponse = await fetch(
              `https://gamersbd-server.onrender.com/api/blogs?category=${data.data.category}&limit=10`,
            );
            const relatedData = await relatedResponse.json();

            const filtered = relatedData.data.filter(
              (post: Blog) => post._id !== data.data._id,
            );

            const seen = new Set();
            const uniqueRelated = filtered
              .filter((post: Blog) => {
                if (seen.has(post._id)) return false;
                seen.add(post._id);
                return true;
              })
              .slice(0, 3);

            setRelatedPosts(uniqueRelated);
          } catch (err) {
            console.error("Error fetching related posts:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch news details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [newsId]);

  // Handle like
  const handleLike = async () => {
    if (!news || isLiked) return;

    try {
      const response = await fetch(
        `https://gamersbd-server.onrender.com/api/blogs/${news._id}/like`,
        { method: "POST" },
      );
      const data = await response.json();

      if (response.ok) {
        setLikesCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  // Handle comment submit
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentName.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(
        `https://gamersbd-server.onrender.com/api/blogs/${news!._id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: commentName,
            email: commentEmail || "anonymous@example.com",
            text: commentText,
          }),
        },
      );
      const data = await response.json();

      if (response.ok) {
        setComments([data.data, ...comments]);
        setCommentText("");
        setCommentName("");
        setCommentEmail("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Share functions
  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href,
      )}`,
      "_blank",
    );
    setShowShareMenu(false);
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        news?.title || "",
      )}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
    );
    setShowShareMenu(false);
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        window.location.href,
      )}&title=${encodeURIComponent(news?.title || "")}`,
      "_blank",
    );
    setShowShareMenu(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-6" />
          <p className="text-gray-400 text-lg">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">🔍</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-400 mb-8">
            {error ||
              "The article you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center z-10">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
          )}
          <img
            src={
              news.image ||
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f"
            }
            alt={news.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? "scale-105" : "scale-100"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to News</span>
              </Link>
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 bg-purple-600/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full shadow-lg">
                {news.category}
              </span>
              {news.featured && (
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl">
              {news.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {news.author?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {news.author?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {news.author?.role || "Contributor"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(news.publishedAt || news.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{calculateReadTime(news.content)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{news.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Author Bio Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-8 shadow-xl">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {news.author?.name?.charAt(0) || "A"}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {news.author?.name || "Anonymous"}
                  </h3>
                  <p className="text-purple-400 mb-3">
                    {news.author?.role || "Contributor"}
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    {news.author?.bio ||
                      "Passionate gamer and tech enthusiast sharing insights about the latest in gaming and technology."}
                  </p>
                  {news.author?.email && (
                    <a
                      href={`mailto:${news.author.email}`}
                      className="inline-flex items-center gap-2 mt-4 text-sm text-purple-400 hover:text-purple-300 transition"
                    >
                      <Mail className="w-4 h-4" />
                      {news.author.email}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {news.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/news?tag=${tag}`}
                      className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-gray-300 text-sm rounded-full border border-gray-700 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-300"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 py-8 border-t border-b border-gray-800 mb-12">
              <button
                onClick={handleLike}
                disabled={isLiked}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isLiked
                    ? "bg-red-500/20 text-red-500 border border-red-500"
                    : "bg-gray-800/50 text-gray-300 hover:bg-red-500/20 hover:text-red-500 border border-gray-700 hover:border-red-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
                <span>{likesCount} Likes</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gray-800/50 text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 border border-gray-700 hover:border-purple-500 transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute top-full mt-2 left-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-10 min-w-[220px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={shareOnFacebook}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 transition flex items-center gap-3"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </button>
                    <button
                      onClick={shareOnTwitter}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 transition flex items-center gap-3"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </button>
                    <button
                      onClick={shareOnLinkedIn}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 transition flex items-center gap-3"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </button>
                    <button
                      onClick={copyLink}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 transition flex items-center gap-3"
                    >
                      <Link2 className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isSaved
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500"
                    : "bg-gray-800/50 text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 border border-gray-700 hover:border-purple-500"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${isSaved ? "fill-purple-400" : ""}`}
                />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>
            </div>

            {/* Comments Section */}
            <div id="comments">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                </div>
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              <form
                onSubmit={handleSubmitComment}
                className="mb-8 p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl"
              >
                <h4 className="text-xl font-semibold text-white mb-4">
                  Leave a Comment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email (optional)"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts... *"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Post Comment"
                  )}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {comment.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {comment.user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300 ml-13">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-800">
                    <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Trending Section */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Trending Now
                </h3>
                <div className="space-y-4">
                  {relatedPosts.slice(0, 2).map((post, index) => (
                    <Link
                      key={post._id}
                      href={`/news/${post.slug || post._id}`}
                      className="group block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                          {index + 1}
                        </div>
                        <p className="flex-1 text-sm text-gray-300 group-hover:text-purple-400 transition line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    You Might Also Like
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((post, index) => (
                      <Link
                        key={index}
                        href={`/news/${post.slug || post._id}`}
                        className="group block"
                      >
                        <div className="flex gap-4">
                          {post.image && (
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white group-hover:text-purple-400 transition line-clamp-2 mb-1">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatDate(post.publishedAt || post.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Stay Updated
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Get the latest gaming news straight to your inbox
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                  />
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Success Toast */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-300">
          <Check className="w-5 h-5" />
          <span>Link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

// Missing Mail icon import
const Mail = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export default NewsDetails;
