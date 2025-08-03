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

export default function Feed() {
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ul className="space-y-6">
          {posts.map(post => (
            <li key={post._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Link href={`/profile/${post.author._id}`}>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <div className="ml-3">
                  <Link href={`/profile/${post.author._id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    {post.author.name}
                  </Link>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</div>
            </li>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No posts yet. Be the first to share something!
            </div>
          )}
        </ul>
      )}
    </div>
  );
}
