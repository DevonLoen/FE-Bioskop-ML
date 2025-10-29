import React, { useState, useRef, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage: React.FC = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(fullname, email, password);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans text-white p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleRegister}
          className="bg-gray-800 shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2">Join the showcase today</p>
          </div>
          {error && (
            <p className="bg-red-500/20 text-red-400 text-center p-3 rounded-lg mb-4">
              {error}
            </p>
          )}
          {success && (
            <p className="bg-green-500/20 text-green-400 text-center p-3 rounded-lg mb-4">
              {success}
            </p>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="fullname"
            >
              Full Name
            </label>
            <input
              ref={nameRef}
              className="bg-gray-700 text-white shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500 transition"
              id="fullname"
              type="text"
              placeholder="John Doe"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="bg-gray-700 text-white shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500 transition"
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="bg-gray-700 text-white shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline focus:border-cyan-500 transition"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
