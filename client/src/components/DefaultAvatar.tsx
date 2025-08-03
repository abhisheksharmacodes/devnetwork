import Image from 'next/image';

export default async function DefaultAvatar() {
  return (
    <Image
      src="/default-avatar.png"
      alt="Default avatar"
      width={40}
      height={40}
      priority
    />
  );
}
