import React, { createContext, useContext, useState, type ReactNode, useEffect } from "react";
// Import DecodedTokenType along with other types
import type { UserType, MovieType, CommentType, DecodedTokenType } from "../types";
// import { initialMoviesData } from "../data"; // No longer needed
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// ... (decodeTokenToUser function remains the same) ...
const decodeTokenToUser = (token: string): UserType | null => {
  try {
    const decoded = jwtDecode<DecodedTokenType>(token);
    if (decoded.exp * 1000 < Date.now()) {
      console.log("Token expired");
      localStorage.removeItem("token");
      return null;
    }
    // Create UserType object directly from token payload
    const user: UserType = {
        id: parseInt(decoded.user_id, 10), // Convert string ID to number
        fullname: decoded.fullname,
        email: decoded.email, // Assumes email is in the token
        is_admin: decoded.is_admin,
    };
    return user;
  } catch (e) {
    console.error("Failed to decode token:", e);
    localStorage.removeItem("token");
    return null;
  }
};

interface AuthContextType {
  currentUser: UserType | null;
  token: string | null;
  movies: MovieType[];
  login: (email: string, password: string) => Promise<void>;
  register: (fullname: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addMovie: (title: string, cover_img_url: string) => Promise<void>;
  // UPDATED: addComment now returns the new comment
  addComment: (movieId: number, commentText: string) => Promise<CommentType>;
  isLoadingUser?: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [movies, setMovies] = useState<MovieType[]>([]); // Initialize as empty array
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true); 
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL;


  // ... (useEffect to load user remains the same) ...
  useEffect(() => {
    const loadUser = async () => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const userProfile = decodeTokenToUser(storedToken); 
            if (userProfile) {
                setCurrentUser(userProfile);
                setToken(storedToken);
            } else {
                 setCurrentUser(null);
                 setToken(null);
            }
        } else {
            setCurrentUser(null);
            setToken(null);
        }
        setIsLoadingUser(false); 
    };
    loadUser();
  }, []); 

  // ... (useEffect to fetch movies remains the same) ...
  useEffect(() => {
    const fetchMovies = async () => {
        if (token) {
             try {
                // ADDED trailing slash
                const response = await fetch(`${API_URL}/api/films/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Assuming auth is needed
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch movies");
                }
                const data: MovieType[] = await response.json();
                
                const moviesWithDefaults = data.map(movie => ({
                    ...movie,
                    comments: movie.comments || [] 
                }));
                setMovies(moviesWithDefaults);

             } catch (error) {
                console.error("Error fetching movies:", error);
             }
        }
    };
    
    if (!isLoadingUser) {
         fetchMovies();
    }
  }, [token, isLoadingUser]); 

  // ... (useEffect for storage change remains the same) ...
  useEffect(() => {
    const handleStorageChange = async () => {
      setIsLoadingUser(true); 
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      if (newToken) {
          const userProfile = decodeTokenToUser(newToken); 
          if (userProfile) {
              setCurrentUser(userProfile);
          } else {
               setCurrentUser(null);
          }
      } else {
           setCurrentUser(null);
      }
       setIsLoadingUser(false);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  // ... (login, register, logout, addMovie functions remain the same) ...
  const login = async (email: string, password: string) => {
    // login endpoint already had trailing slash
    const response = await fetch(`${API_URL}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(errorData.detail || "Login failed");
    }

    const data = await response.json();
    const accessToken = data.access; 

    if (!accessToken) {
        throw new Error("Login failed: No access token received.");
    }

    const userProfile = decodeTokenToUser(accessToken); 

    if (!userProfile) {
         throw new Error("Login failed: Could not decode user from token or token expired.");
    }

    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    setCurrentUser(userProfile);
    navigate("/"); 
  };

  const register = async (fullname: string, email: string, password: string) => {
    // ADDED trailing slash
    const response = await fetch(`${API_URL}/api/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(errorData.detail || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setToken(null);
    navigate("/login");
  };

  const addMovie = async (title: string, cover_img_url: string) => {
    if (!token) {
        throw new Error("No authorization token found. Please log in.");
    }

    // ADDED trailing slash
    const response = await fetch(`${API_URL}/api/films/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ title, cover_img_url })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to add movie" }));
        throw new Error(errorData.detail || "Failed to add movie");
    }
    
    const newMovie: MovieType = await response.json();
    
    const newMovieWithDefaults = { ...newMovie, comments: newMovie.comments || [] };

    setMovies((prevMovies) => [newMovieWithDefaults, ...prevMovies]);
    navigate('/'); 
  };

  // --- UPDATED addComment Function ---
  const addComment = async (movieId: number, commentText: string): Promise<CommentType> => {
    if (!currentUser || !token) {
        throw new Error("User not logged in or token missing");
    }

    // 1. Make the POST request to the API
    // ADDED trailing slash
    const response = await fetch(`${API_URL}/api/comments/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            film: movieId,
            comment: commentText
        })
    });

    if (!response.ok) {
         const errorData = await response.json().catch(() => ({ detail: "Failed to add comment" }));
         throw new Error(errorData.detail || "Failed to add comment");
    }

    // 2. API call was successful.
    // GET THE ACTUAL COMMENT FROM THE RESPONSE
    const newComment: CommentType = await response.json();
    
    // REMOVED: The hard-coded simulation
    // console.log("Comment POST successful. Simulating local state update.");
    // const newComment: CommentType = {
    //    id: Date.now(), 
    //    film: movieId, 
    //    user: currentUser.email, 
    //    comment: commentText,
    //    is_good: true, // <-- THIS WAS THE BUG
    //    created_at: new Date().toISOString(), 
    // }

    setMovies((prevMovies) =>
      prevMovies.map((movie) => {
        if (movie.id === movieId) {
          const existingComments = movie.comments || [];
          // Add the real comment from the API response
          return { ...movie, comments: [newComment, ...existingComments] };
        }
        return movie;
      })
    );
    
    // 3. Return the new comment so the UI can use it
    return newComment;
  };
  // --- END UPDATED addComment Function ---


  const value = {
    currentUser,
    token,
    movies,
    login,
    register,
    logout,
    addMovie,
    addComment,
    isLoadingUser 
  };

   if (isLoadingUser) {
        return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
   }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};