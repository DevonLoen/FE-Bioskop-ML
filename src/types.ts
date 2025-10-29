export interface CommentType {
  id: number;
  film: number; // Added this field
  user: string; // This will hold the user's email as per your API
  comment: string;
  is_good: boolean;
  created_at: string;
}

export interface MovieType {
  id: number;
  title: string;
  cover_img_url: string;
  created_at: string; 
  
  synopsis?: string;
  rating?: number;
  release_date?: string; 
  comments?: CommentType[];
}

// User type - represents the full user profile fetched after login
export interface UserType {
  id: number; 
  fullname: string;
  email: string;
  is_admin: boolean;
}

// Interface for the decoded JWT payload
export interface DecodedTokenType {
    user_id: string; 
    is_admin: boolean;
    fullname: string; 
    email: string; 
    exp: number;
    iat: number;
    jti: string;
    // Add any other fields present in your actual token payload
}
