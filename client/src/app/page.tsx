
'use client';
import { useState, useEffect } from 'react';
import Feed from '@/components/Feed';

export default function Home() {
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<{ name: string; _id: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      fetch(`https://devnetwork-back.vercel.app/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(error => console.error('Error fetching user:', error));
    }
  }, []);

  const handleCreatePost = () => {
    if (!content.trim() || !user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('https://devnetwork-back.vercel.app/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: content.trim() })
    })
      .then(res => res.json())
      .then(() => {
        setContent('');
        setIsCreating(false);
        // The Feed component will automatically refresh due to polling
      })
      .catch(error => {
        console.error('Error creating post:', error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Post Creation Box */}
      <div className="bg-white rounded-lg shadow mb-8">
        {/* Post Input Trigger */}
        {!isCreating ? (
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-md font-bold shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="flex-grow bg-gray-100 rounded-full py-3 px-4 text-left text-gray-500 hover:bg-gray-200  transition-colors"
            >
              Hi {user?.name}! what&apos;s on your mind?
            </button>
          </div>
        ) : (
          <div className="p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share?"
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparen"
            />
            <div className="flex flex-row-reverse justify-between items-right">
              <div>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 cursor-pointer text-gray-600 mr-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!content.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Feed Section */}
      <Feed />
    </div>
  );
}
