"use client";
import { useState } from "react";
import { login } from "@/app/api/auth/login";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    const response = await login({ email, password });
    if (response) {
      setToken(response.token);
      localStorage.setItem("token", response.token);

      document.cookie = `token=${response.token}; path=/; max-age=86400; SameSite=Lax`;

      const savedToken = localStorage.getItem("token");

      router.push("/works-list");
    } else {
      setError("失敗!!!!!");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2 bg-white"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2 bg-white"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2 bg-white"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
