'use client';
import { useState } from 'react';

export default function CreatePostForm() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to post.');
      return;
    }
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Post created!');
        setContent('');
        // Here you would typically update the feed
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8 p-6 bg-white rounded-lg shadow-sm">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Share your thoughts with the community..."
        required
        className="w-full p-4 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent  resize-none min-h-[120px]"
      />
      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
      {success && <div className="text-green-500 mb-4 text-sm">{success}</div>}
      <button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
      >
        Share Post
      </button>
    </form>
  );
}
