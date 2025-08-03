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
}

interface FeedProps {
  optimisticPosts?: Post[];
  onPostSuccess?: () => void;
}

export default function Feed({ optimisticPosts = [], onPostSuccess }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
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

  // Combine optimistic posts with fetched posts
  const allPosts = [...optimisticPosts, ...posts];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {loading && allPosts.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', opacity: 0.5 }}></div>
          </div>
        </div>
      ) : (
        <ul className="space-y-6">
          {allPosts.map(post => (
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
            </li>
          ))}
          {allPosts.length === 0 && (
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
