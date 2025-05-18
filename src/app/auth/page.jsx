"use client";

import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);


  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-md space-y-6 bg-white">
      {isLogin ? (
        <LoginForm switchToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm
          switchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
}
