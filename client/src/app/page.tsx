
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Feed from '../components/Feed';

export default function Home() {
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePost = () => {
    if (!content.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    })
    .then(res => res.json())
    .then(() => {
      setContent('');
      setIsCreating(false);
      // The Feed component will automatically refresh due to polling
    })
    .catch(error => console.error('Error creating post:', error));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Post Creation Box */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        {/* Post Input Trigger */}
        {!isCreating ? (
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <Image
                src="/default-avatar.png"
                alt="User avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-full py-3 px-4 text-left text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Start a post
            </button>
          </div>
        ) : (
          <div className="p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share?"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!content.trim()}
              >
                Post
              </button>
            </div>
          </div>
        )}
        
      </div>

      {/* Feed Section */}
      <Feed />
    </div>
  );
}
