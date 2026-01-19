// src/page/Main.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { MovieType } from "../types";

const MovieDetail = ({ movie, onClose }: { movie: MovieType; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4 animate-in fade-in duration-300">
    <div className="bg-gray-900 rounded-2xl w-full max-w-2xl overflow-hidden relative border border-gray-800 shadow-2xl">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors z-10">
        ✕
      </button>
      <div className="flex flex-col md:flex-row">
        <img
          src={`https://picsum.photos/seed/${encodeURIComponent(movie.title)}/500/750`}
          className="w-full md:w-1/2 object-cover aspect-[2/3]"
          alt={movie.title}
        />
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-4">{movie.title}</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres.map((g) => (
              <span key={g} className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                {g}
              </span>
            ))}
          </div>
          <div className="text-yellow-400 text-4xl font-bold">
            ★ {movie.average_rating.toFixed(1)} <span className="text-gray-500 text-sm">/ 10</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MovieCard = ({ movie, onClick }: { movie: MovieType; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg group border border-transparent hover:border-cyan-500/50">
    <div className="relative aspect-[2/3] overflow-hidden">
      <img
        src={`https://picsum.photos/seed/${encodeURIComponent(movie.title)}/400/600`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        alt={movie.title}
      />
    </div>
    <div className="p-4">
      <h3 className="font-bold text-gray-100 truncate group-hover:text-cyan-400 transition-colors">{movie.title}</h3>
      <p className="text-yellow-400 text-sm font-bold mt-1">★ {movie.average_rating.toFixed(1)}</p>
    </div>
  </div>
);

const MainPage = () => {
  const { recommendations, logout, token } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

  const handleSelectMovie = async (movie: MovieType) => {
    try {
      const response = await fetch(`https://bioskop-ml-mikro.duckdns.org/api/v1/film/${movie.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const detail = await response.json();
        setSelectedMovie(detail);
      } else {
        setSelectedMovie(movie);
      }
    } catch (error) {
      setSelectedMovie(movie);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <nav className="p-6 flex justify-between items-center border-b border-gray-900 sticky top-0 bg-gray-950/80 backdrop-blur-xl z-40">
        <h1 className="text-xl font-black text-cyan-500 uppercase">MovieML</h1>
        <button
          onClick={logout}
          className="text-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-widest border border-red-500/20">
          Logout
        </button>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-black mb-10 text-white uppercase italic">
          Recommended <span className="text-cyan-500 text-3xl">for you</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {recommendations.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => handleSelectMovie(movie)} />
          ))}
        </div>
      </main>

      {selectedMovie && <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
};

export default MainPage;
