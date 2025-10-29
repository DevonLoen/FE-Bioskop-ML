import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import type { MovieType, CommentType, UserType } from "../types"; 
import { timeAgo } from "../utils"; 

// --- REUSABLE COMPONENTS ---

// ... (MovieCard component remains the same) ...
const MovieCard = ({
  movie,
  onSelectMovie,
}: {
  movie: MovieType;
  onSelectMovie: (movie: MovieType) => void;
}) => (
  <div
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
    onClick={() => onSelectMovie(movie)}
  >
    <img
      src={movie.cover_img_url}
      alt={`Poster for ${movie.title}`}
      className="w-full h-auto object-cover aspect-[2/3]" 
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.target as HTMLImageElement).onerror = null; 
        (e.target as HTMLImageElement).src =
          "https://placehold.co/500x750/2d3748/ffffff?text=Image+Not+Found";
      }}
    />
    <div className="p-4">
      <h3 className="text-white text-lg font-bold truncate group-hover:text-cyan-400 transition-colors duration-300">
        {movie.title}
      </h3>
    </div>
  </div>
);

// ... (Comment component remains the same) ...
const Comment = ({ comment }: { comment: CommentType }) => (
  <div className="flex items-start space-x-4 p-3 border-b border-gray-700 last:border-b-0">
    <div
      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        comment.is_good ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {comment.is_good ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5.5 8m7 2v5m0 0v5m0-5h-5" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326-.02.485-.06L17 4m-7 10v5a2 2 0 002 2h.085a2 2 0 001.736-.93l2.5-4m-7-5V9m0 0V4m0 5h5" /></svg> )}
    </div>
    <div className="flex-grow">
      <div className="flex items-center justify-between">
        <p className="font-bold text-cyan-400">{comment.user}</p>
        <p className="text-xs text-gray-500">{timeAgo(comment.created_at)}</p>
      </div>
      <p className="text-gray-300 mt-1">{comment.comment}</p>
    </div>
  </div>
);


// --- UPDATED MovieDetail component ---
const MovieDetail = ({
  movie,
  currentUser, 
  onDeselectMovie,
  onAddComment,
}: {
  movie: MovieType; 
  currentUser: UserType;
  onDeselectMovie: () => void; 
  onAddComment: (movieId: number, commentText: string) => Promise<void>; 
}) => {
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim() === "" || isSubmitting) return;

    setIsSubmitting(true);
    setCommentError("");

    try {
        await onAddComment(movie.id, newComment); 
        setNewComment("");
    } catch (err: any) {
        setCommentError(err.message || "Failed to add comment.");
    } finally {
        setIsSubmitting(false);
    }
  };
  
  // Set defaults for optional fields
  const comments = movie.comments || [];
  // Use the rating from the movie object, defaulting to 0
  const rating = movie.rating || 0;
  const synopsis = movie.synopsis || "No synopsis available.";
  const releaseDate = movie.release_date || "N/A";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 animate-fade-in"> 
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"> 
        <div className="relative flex-shrink-0 flex flex-col md:flex-row">
          {/* Close button */}
          <button
            onClick={onDeselectMovie} 
            className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-300 z-10"
            aria-label="Close"
          >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Movie Poster */}
          <img
            src={movie.cover_img_url}
            alt={`Poster for ${movie.title}`}
            className="w-full md:w-1/3 h-auto object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none aspect-[2/3]" 
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src =
                "https://placehold.co/500x750/2d3748/ffffff?text=Image+Not+Found";
            }}
          />

          {/* Movie Info */}
          <div className="p-8 flex flex-col overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 break-words">{movie.title}</h2>

            <div className="flex items-center mb-6">
              <div className="flex items-center text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {/* The rating is now dynamic */}
                <span className="text-2xl font-bold text-white">{rating.toFixed(1)}</span>
                <span className="text-gray-400 ml-1">/ 10</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-cyan-400 mb-2">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed">{synopsis}</p> 
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex-grow p-8 pt-0 flex flex-col overflow-hidden">
             <div className="border-t border-gray-700 pt-6 mb-4 flex-shrink-0">
                 <h3 className="text-xl font-bold text-cyan-400 flex items-center">
                    Comments
                    <span className="ml-2 bg-gray-700 text-cyan-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                         {comments.length}
                    </span>
                 </h3>
             </div>
             {/* Scrollable Comment List */}
             <div className="flex-grow overflow-y-auto mb-4 bg-gray-800/50 rounded-lg">
                {comments.length > 0 ? (
                    comments
                        .slice() 
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) 
                        .map((c) => <Comment key={c.id} comment={c} />)
                ) : (
                    <p className="text-gray-400 p-4">
                        {/* Show loading text if comments are missing, or no comments */}
                        {movie.comments ? "No comments yet. Be the first!" : "Loading comments..."}
                    </p>
                )}
             </div>
             {/* Comment Form */}
            <form onSubmit={handleSubmit} className="flex-shrink-0">
                {commentError && <p className="text-red-400 text-sm mb-2">{commentError}</p>}
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-gray-800 text-white p-3 rounded-lg border-2 border-gray-700 focus:border-cyan-500 focus:outline-none transition"
                    placeholder="Add a public comment..."
                    rows={3}
                ></textarea>
                <div className="flex justify-between items-center mt-3">
                    <div className="flex-grow"></div> {/* Empty div to push button right */}
                    <button type="submit" disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50">
                        {isSubmitting ? "Posting..." : "Comment"}
                    </button>
                </div>
            </form>
        </div>

      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
const MainPage = () => {
  // Get token to use for fetching comments
  const { currentUser, movies, addComment, logout, token } = useAuth(); 
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // REMOVED: activelyUpdatingMovieId state

  const navigate = useNavigate();

  // REMOVED: The buggy useEffect that synced movies and selectedMovie
  // The logic is now handled by handleAddCommentAndUpdateModal

  // --- UPDATED handleSelectMovie Function ---
  const handleSelectMovie = async (movie: MovieType) => {
    if (!token) {
        console.error("No token found, cannot fetch comments.");
        return;
    }

    // 1. Find movie from list and set it (opens modal immediately)
    const movieFromList = movies.find((m) => m.id === movie.id) || movie;
    // We set comments to undefined here to trigger the "Loading comments..." text
    // And rating to 0 to start
    setSelectedMovie({...movieFromList, comments: undefined, rating: 0.0});

    // 2. Fetch comments for this movie
    try {
        // ADDED trailing slash
        const response = await fetch(`http://localhost:8000/api/films/${movie.id}/comments/`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch comments (status: ${response.status})`);
        }

        const fetchedComments: CommentType[] = await response.json();

        // --- NEW: Calculate Rating ---
        let calculatedRating = 0.0;
        if (fetchedComments.length > 0) {
            const goodComments = fetchedComments.filter(c => c.is_good).length;
            calculatedRating = (goodComments / fetchedComments.length) * 10;
        }
        // --- END: Calculate Rating ---

        // 3. Update the selectedMovie state again with comments AND rating
        setSelectedMovie(prevMovie => {
            // Safety check: only update if the modal is still open for this movie
            if (!prevMovie || prevMovie.id !== movie.id) return prevMovie; 
            
            return {
                ...prevMovie,
                comments: fetchedComments,
                rating: calculatedRating // Set the calculated rating
            };
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        // Optionally show an error in the modal
        setSelectedMovie(prevMovie => {
             if (!prevMovie || prevMovie.id !== movie.id) return prevMovie; 
             // Set empty comments and 0 rating on error
             return { ...prevMovie, comments: [], rating: 0.0 }; 
        });
    }
  };
  // --- END UPDATED handleSelectMovie Function ---


  const handleDeselectMovie = () => {
    setSelectedMovie(null);
  };

  // --- UPDATED Wrapper for addComment ---
  const handleAddCommentAndUpdateModal = async (
    movieId: number,
    commentText: string
  ) => {
     try {
        // 1. Call context, which POSTs and updates master 'movies' list
        const newComment = await addComment(movieId, commentText);
        
        // 2. Manually update the local 'selectedMovie' state
        // This instantly re-renders the modal
        setSelectedMovie(prevMovie => {
            if (!prevMovie) return null; // Safety check
            const existingComments = prevMovie.comments || [];
            const newCommentsList = [newComment, ...existingComments];

            // --- NEW: Recalculate rating on new comment ---
            let newCalculatedRating = 0.0;
            if (newCommentsList.length > 0) {
                 const goodComments = newCommentsList.filter(c => c.is_good).length;
                 newCalculatedRating = (goodComments / newCommentsList.length) * 10;
            }
            // --- END: Recalculate rating ---

            return {
                ...prevMovie,
                comments: newCommentsList,
                rating: newCalculatedRating // Set new rating
            };
        });

     } catch (error) {
         console.error("Error adding comment in MainPage:", error);
         // TODO: Show error in modal
     }
  };
  // --- END UPDATED Wrapper ---


  const handleLogout = () => {
    logout(); 
  };

  if (!currentUser) {
    return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Authenticating...</div>;
  }

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white">
      {/* ... (Header and Search Bar remain the same) ... */}
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          {/* Header layout */}
          <div className="flex justify-between items-center">
            {/* Left side (Admin Button) */}
            <div className="w-1/3 flex justify-start">
              {currentUser.is_admin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Dashboard
                </button>
              )}
            </div>
            {/* Center (Title and Welcome) */}
            <div className="w-1/3 flex flex-col justify-center items-center">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                  Movie Rating
                </span>
              </h1>
              <p className="text-gray-400 mt-2">
                Welcome, {currentUser.fullname}!
              </p>
            </div>
            {/* Right side (Logout Button) */}
            <div className="w-1/3 flex justify-end">
              <button
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-gray-400 mt-2">
            Click on a movie to see its details
          </p>
          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search for a movie..."
                className="w-full bg-gray-800 text-white placeholder-gray-500 px-5 py-3 pl-12 rounded-full border-2 border-gray-700 focus:border-cyan-500 focus:outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main>
          {/* Movie Grid */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelectMovie={handleSelectMovie}
                />
              ))}
            </div>
          ) : (
             // No Movies Found Message
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white">No movies found</h2>
              <p className="text-gray-400 mt-2">
                {searchTerm ? `Try adjusting your search for "${searchTerm}"` : "Loading movies..."}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && currentUser && ( 
        <MovieDetail
          movie={selectedMovie}
          currentUser={currentUser}
          onDeselectMovie={handleDeselectMovie} 
          onAddComment={handleAddCommentAndUpdateModal}
        />
      )}
    </div>
  );
};

export default MainPage;

