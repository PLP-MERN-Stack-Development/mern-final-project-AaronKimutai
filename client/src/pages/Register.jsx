import { SignUp } from "@clerk/clerk-react";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded shadow-md">
        <SignUp path="/register" routing="path" signInUrl="/login" />
      </div>
    </div>
  );
}
