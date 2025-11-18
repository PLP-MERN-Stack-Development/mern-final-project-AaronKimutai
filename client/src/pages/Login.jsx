import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded shadow-md">
        <SignIn path="/login" routing="path" signUpUrl="/register" />
      </div>
    </div>
  );
}
