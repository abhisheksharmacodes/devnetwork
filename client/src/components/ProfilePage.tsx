'use client';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
}

export default function ProfilePage({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${userId}`).then(res => res.json()),
      fetch(`/api/users/${userId}/posts`).then(res => res.json())
    ])
      .then(([userData, postsData]) => {
        setUser(userData.user);
        setPosts(postsData.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">This profile doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-3xl font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
            <div className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</div>
          </div>
        </div>
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{user.bio}</div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Posts</h3>
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No posts yet
          </div>
        ) : (
          <ul className="space-y-6">
            {posts.map(post => (
              <li key={post.id} className="border-b dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-2">{post.content}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Posted on {new Date(post.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
