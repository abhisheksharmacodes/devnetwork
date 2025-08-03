import ProfilePage from '../../../components/ProfilePage';

async function getProfile(id: string) {
  const headers = { 'Authorization': 'Bearer YOUR_TOKEN' };
  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}`, { headers, cache: 'no-store' });
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

async function getPosts(id: string) {
  const headers = { 'Authorization': 'Bearer YOUR_TOKEN' };
  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}/posts`, { headers, cache: 'no-store' });
    return await response.json();
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}

type Params = Promise<{ id: string }>;

export default async function ProfileRoute(props: {
  params: Params;
}) {
  const params = await props.params;
  const [user, posts] = await Promise.all([
    getProfile(params.id),
    getPosts(params.id)
  ]);

  return (
    <div className="container mx-auto px-4">
      <ProfilePage initialData={{ user, posts }} userId={params.id} />
    </div>
  );
}
