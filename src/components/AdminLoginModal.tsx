"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <button onClick={onClose} className="float-right text-2xl text-black">×</button>
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200  rounded-lg text-black
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors transition-shadow duration-500 ease-in-out"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors transition-shadow duration-500 ease-in-out"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}  