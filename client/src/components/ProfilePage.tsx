'use client';
import { useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
}

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  author: User;
}

interface InitialData {
  user: User | null;
  posts: Post[];
}

export default function ProfilePage({ 
  initialData 
}: { 
  initialData: InitialData;
}) {
  const [user] = useState<User | null>(initialData.user);
  const [posts] = useState<Post[]>(Array.isArray(initialData.posts) ? initialData.posts : []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center py-20 bg-white  rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 ">User not found</h2>
        <p className="text-gray-600  mt-2">This profile doesn&apos;t exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-8 mb-8 border border-blue-100">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg transform transition-transform hover:scale-105">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{user.name}</h2>
            <div className="text-blue-600 font-medium flex items-center mb-3">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {user.email}
            </div>
            {user.bio && (
              <div className="text-gray-600 flex items-start">
                <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Posts
          </h3>
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="text-gray-400 flex flex-col items-center">
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              No posts yet
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {posts.map(post => (
              <li key={post._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="text-gray-900 whitespace-pre-wrap mb-3 leading-relaxed">{post.content}</div>
                <div className="text-sm text-blue-500 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
