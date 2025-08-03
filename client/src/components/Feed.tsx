'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  hasLiked: boolean;
  hasDisliked: boolean;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('https://devnetwork-back.vercel.app//api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`https://devnetwork-back.vercel.app//api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      // Update post counts and interaction state
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likeCount: data.likeCount, 
              dislikeCount: data.dislikeCount,
              hasLiked: data.hasLiked,
              hasDisliked: data.hasDisliked
            }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`https://devnetwork-back.vercel.app//api/posts/${postId}/dislike`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      // Update post counts and interaction state
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likeCount: data.likeCount, 
              dislikeCount: data.dislikeCount,
              hasLiked: data.hasLiked,
              hasDisliked: data.hasDisliked
            }
          : post
      ));
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Set up polling for new posts
  useEffect(() => {
    const interval = setInterval(fetchPosts, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', opacity: 0.5 }}></div>
          </div>
        </div>
      ) : (
        <ul className="space-y-6">
          {posts.map(post => (
            <li key={post._id} className={`bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all ${post._id.startsWith('temp-') ? 'opacity-80' : ''}`}>
              <div className="flex items-center mb-4">
                <Link href={`/profile/${post.author._id}`} className="transform transition-transform hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <div className="ml-4">
                  <Link href={`/profile/${post.author._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {post.author.name}
                  </Link>
                  <div className="text-sm text-blue-500 font-medium flex items-center mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {post._id.startsWith('temp-') ? (
                      <span className="text-indigo-500">Posting...</span>
                    ) : (
                      new Date(post.createdAt).toLocaleString()
                    )}
                  </div>
                </div>
              </div>
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed mt-3 pl-16">{post.content}</div>
              
              {/* Like/Dislike buttons */}
              <div className="flex items-center gap-6 mt-4 pl-16">
                <button 
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {post.hasLiked ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  )}
                  <span>{post.likeCount || 0}</span>
                </button>

                <button 
                  onClick={() => handleDislike(post._id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
                >
                  {post.hasDisliked ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5 0v2a2 2 0 01-2 2h-2.5" />
                    </svg>
                  )}
                  <span>{post.dislikeCount || 0}</span>
                </button>
              </div>
            </li>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-16 px-6">
              <div className="text-gray-400 flex flex-col items-center">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="text-xl font-medium mb-2">No posts yet</span>
                <span className="text-sm">Be the first to share something!</span>
              </div>
            </div>
          )}
        </ul>
      )}
    </div>
  );
}
