// src/types.ts
export interface MovieType {
  id: number;
  title: string;
  cover_img_url: string;
  genres: string[];
  average_rating: number;
}

export interface UserType {
  email: string;
}

export interface DecodedTokenType {
  sub: string; // The "sub" field holds the user's email in your token
  exp: number;
}
