import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Use context
// Removed MovieType import as we only pass strings

const AdminDashboard = () => {
  const [title, setTitle] = useState("");
  const [coverImgUrl, setCoverImgUrl] = useState("");
  // Removed synopsis, rating, and releaseDate states
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(""); // Added error state
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const { addMovie } = useAuth(); // Get addMovie from context

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Use placeholder if coverImgUrl is empty
    const finalCoverImgUrl =
      coverImgUrl ||
      `https://placehold.co/500x750/1a202c/ffffff?text=${title.replace(
        / /g,
        "+"
      )}`;

    try {
      await addMovie(title, finalCoverImgUrl); // Call context function with only title and URL

      // Reset form
      setTitle("");
      setCoverImgUrl("");
      setSuccessMessage(`Movie "${title}" added successfully!`);
      // Navigation back is handled inside addMovie in context
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Failed to add movie:", err);
      setError(err.message || "Failed to add movie.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Admin Dashboard
            </h1>
            <button
              onClick={() => navigate("/")} // Use navigate from react-router-dom
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              ← Back to Showcase
            </button>
          </div>
        </header>
        <main>
          <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Film</h2>
            {successMessage && (
              <p className="bg-green-500/20 text-green-400 text-center p-3 rounded-lg mb-4">
                {successMessage}
              </p>
            )}
            {error && (
              <p className="bg-red-500/20 text-red-400 text-center p-3 rounded-lg mb-4">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-gray-400 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-700 focus:border-cyan-500 focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-gray-400 text-sm font-bold mb-2"
                  htmlFor="cover_img_url"
                >
                  Cover Image URL
                </label>
                <input
                  type="url"
                  id="cover_img_url"
                  value={coverImgUrl}
                  onChange={(e) => setCoverImgUrl(e.target.value)}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-700 focus:border-cyan-500 focus:outline-none transition"
                  placeholder="https://... (optional, placeholder will be used)"
                />
              </div>
              {/* Removed Synopsis, Rating, and Release Date inputs */}
              <div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Film"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;