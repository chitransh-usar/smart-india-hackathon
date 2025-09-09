import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  MapPin,
  User,
  Filter,
  Search,
  Plus,
  Leaf,
  Recycle,
  Zap,
  Droplets,
  MoreHorizontal,
  Send,
  Image as ImageIcon,
  X,
  Trash2,
  UserPlus,
  UserMinus,
} from "lucide-react";

interface Post {
  _id: string;
  title: string;
  description: string;
  category:
    | "tree-planting"
    | "recycling"
    | "energy-saving"
    | "water-conservation"
    | "other";
  author: string;
  image: {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  };
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  status: "pending" | "approved" | "rejected";
  ecoPoints: number;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const CommunityWall = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "likes">("createdAt");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(
    new Set(["Meera Patel", "Sara Ahmed"])
  );

  // New post form state
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    category: "other" as Post["category"],
    author: "",
    image: null as File | null,
  });

  const categories = [
    {
      id: "all",
      label: "All Posts",
      icon: MoreHorizontal,
      color: "bg-gray-100",
    },
    {
      id: "tree-planting",
      label: "Tree Planting",
      icon: Leaf,
      color: "bg-green-100",
    },
    {
      id: "recycling",
      label: "Recycling",
      icon: Recycle,
      color: "bg-blue-100",
    },
    {
      id: "energy-saving",
      label: "Energy Saving",
      icon: Zap,
      color: "bg-yellow-100",
    },
    {
      id: "water-conservation",
      label: "Water Conservation",
      icon: Droplets,
      color: "bg-cyan-100",
    },
    {
      id: "other",
      label: "Other",
      icon: MoreHorizontal,
      color: "bg-purple-100",
    },
  ];

  const API_BASE_URL = "http://localhost:3001/api";

  const fetchPosts = async (page = 1, category = "all", sort = "createdAt") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sortBy: sort,
        sortOrder: "desc",
      });

      if (category !== "all") {
        params.append("category", category);
      }

      const response = await fetch(`${API_BASE_URL}/posts?${params}`);
      const data = await response.json();

      if (data.success) {
        console.log("Fetched posts:", data.data);
        setPosts(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error || "Failed to fetch posts");
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: "anonymous-user" }),
      });

      const data = await response.json();
      if (data.success) {
        setPosts(
          posts.map((post) =>
            post._id === postId ? { ...post, likes: data.data.likes } : post
          )
        );
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
          author: "Anonymous User",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPosts(
          posts.map((post) =>
            post._id === postId
              ? { ...post, comments: [...post.comments, data.data] }
              : post
          )
        );
        setNewComment({ ...newComment, [postId]: "" });
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description || !newPost.image) return;

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("description", newPost.description);
    formData.append("category", newPost.category);
    formData.append("author", newPost.author || "Anonymous");
    formData.append("image", newPost.image);

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setShowNewPostForm(false);
        setNewPost({
          title: "",
          description: "",
          category: "other",
          author: "",
          image: null,
        });
        fetchPosts(currentPage, selectedCategory, sortBy);
      } else {
        setError(data.error || "Failed to create post");
      }
    } catch (err) {
      setError("Failed to create post");
      console.error("Error creating post:", err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        setError(data.error || "Failed to delete post");
      }
    } catch (err) {
      setError("Failed to delete post");
      console.error("Error deleting post:", err);
    }
  };

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handleFollowUser = (authorName: string) => {
    const newFollowing = new Set(followingUsers);
    if (newFollowing.has(authorName)) {
      newFollowing.delete(authorName);
    } else {
      newFollowing.add(authorName);
    }
    setFollowingUsers(newFollowing);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0];
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPosts(currentPage, selectedCategory, sortBy);
  }, [currentPage, selectedCategory, sortBy]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <Button
          onClick={() => fetchPosts(currentPage, selectedCategory, sortBy)}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">
          Community Wall
        </h2>
        <p className="text-muted-foreground">
          Share your eco-friendly actions and inspire others in our community
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowNewPostForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "createdAt" | "likes")}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="createdAt">Latest</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1);
              }}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <Card className="card-eco">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Share Your Eco Action</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowNewPostForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Your name (optional)"
                value={newPost.author}
                onChange={(e) =>
                  setNewPost({ ...newPost, author: e.target.value })
                }
              />
              <select
                value={newPost.category}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    category: e.target.value as Post["category"],
                  })
                }
                className="px-3 py-2 border rounded-md bg-background"
                required
              >
                <option value="tree-planting">Tree Planting</option>
                <option value="recycling">Recycling</option>
                <option value="energy-saving">Energy Saving</option>
                <option value="water-conservation">Water Conservation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              placeholder="Post title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              required
            />

            <Textarea
              placeholder="Describe your eco-friendly action..."
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
              }
              rows={3}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewPost({ ...newPost, image: e.target.files?.[0] || null })
                }
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewPostForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-eco">
                Share Post
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Posts */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => {
          const categoryInfo = getCategoryInfo(post.category);
          const Icon = categoryInfo.icon;

          return (
            <Card key={post._id} className="card-eco">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{post.author}</h4>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Icon className="h-3 w-3" />
                        {categoryInfo.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={
                      followingUsers.has(post.author) ? "outline" : "default"
                    }
                    className={
                      followingUsers.has(post.author)
                        ? "text-muted-foreground"
                        : "btn-eco"
                    }
                    onClick={() => handleFollowUser(post.author)}
                  >
                    {followingUsers.has(post.author) ? (
                      <>
                        <UserMinus className="h-3 w-3 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary">
                      +{post.ecoPoints} Eco Points
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {post.description}
                  </p>
                </div>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        console.error("Image failed to load:", post.imageUrl);
                        console.error("Post data:", post);
                        e.currentTarget.style.display = "none";
                      }}
                      onLoad={() => {
                        console.log(
                          "Image loaded successfully:",
                          post.imageUrl
                        );
                      }}
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post._id)}
                      className="flex items-center gap-2 hover:text-red-500"
                    >
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComments(post._id)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post.comments.length}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedComments.has(post._id) && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    {/* Existing Comments */}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                {comment.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment[post._id] || ""}
                          onChange={(e) =>
                            setNewComment({
                              ...newComment,
                              [post._id]: e.target.value,
                            })
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddComment(post._id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(post._id)}
                          disabled={!newComment[post._id]?.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && !loading && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Be the first to share your eco-friendly action!"}
          </p>
          <Button onClick={() => setShowNewPostForm(true)} className="btn-eco">
            <Plus className="h-4 w-4 mr-2" />
            Create First Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommunityWall;
