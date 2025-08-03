import ProfilePage from '../../../components/ProfilePage';

export default function ProfileRoute({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4">
      <ProfilePage userId={params.id} />
    </div>
  );
}
