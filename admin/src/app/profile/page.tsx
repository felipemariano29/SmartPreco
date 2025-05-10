import { UserButton, UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="absolute top-4 left-4 z-50">
        <UserButton />
      </div>
      <UserProfile />
    </div>
  );
}