'use client';

import ProfilePage from '../../../components/ProfilePage';
import { use } from 'react';
import { useEffect, useState } from 'react';

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

type Params = { id: string };

export default function ProfileRoute(props: {
  params: Promise<Params>;
}) {
  const params = use(props.params);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [userResponse, postsResponse] = await Promise.all([
          fetch(`https://devnetwork-back.vercel.app/api/users/${params.id}`, { 
            headers,
            method: 'GET'
          }),
          fetch(`https://devnetwork-back.vercel.app/api/users/${params.id}/posts`, { 
            headers,
            method: 'GET'
          })
        ]);

        if (!userResponse.ok || !postsResponse.ok) {
          console.error('API Error:', {
            user: userResponse.status,
            posts: postsResponse.status
          });
          setUser(null);
          setPosts([]);
          return;
        }

        const [userData, postsData] = await Promise.all([
          userResponse.json(),
          postsResponse.json()
        ]);

        if (!userData) {
          console.error('No user data returned');
          setUser(null);
          return;
        }

        setUser(userData);
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setUser(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <div className="container mx-auto px-4">
      {loading ? (
        <div className="animate-pulse space-y-8 px-80 py-8">
          {/* Profile Header Skeleton */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="h-32 bg-gray-200"></div>
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                <div className="space-y-3 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Posts Section Skeleton */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !user ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold">User not found</h2>
          <p className="text-gray-600 mt-2">This profile doesn&apos;t exist or has been removed.</p>
        </div>
      ) : (
        <ProfilePage initialData={{ user, posts: posts || [] }} />
      )}
    </div>
  );
}
