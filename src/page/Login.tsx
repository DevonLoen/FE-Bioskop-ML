// src/page/Login.tsx
import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400 text-center">Login</h1>
        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Email</label>
          <input
            type="email"
            className="w-full bg-gray-700 p-3 rounded-lg outline-none border-2 border-transparent focus:border-cyan-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-400 mb-2">Password</label>
          <input
            type="password"
            className="w-full bg-gray-700 p-3 rounded-lg outline-none border-2 border-transparent focus:border-cyan-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 font-bold py-3 rounded-lg transition">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
