import type { MovieType } from "./types";

export const initialMoviesData: MovieType[] = [
  {
    id: 1,
    title: "Galaxy Quest",
    cover_img_url: "https://placehold.co/500x750/1a202c/ffffff?text=Galaxy+Quest",
    synopsis:
      "The alumni cast of a space opera television series have to play their roles as the real thing when an alien race needs their help.",
    rating: 8.8,
    release_date: "1999-12-25",
    comments: [
      {
        id: 101,
        user: "CinemaFan88",
        comment: "An absolute classic! Hilarious and heartwarming.",
        is_good: true,
        created_at: "2024-10-05T10:00:00Z",
      },
      {
        id: 102,
        user: "SciFiGeek",
        comment: "They perfectly captured the spirit of Star Trek fandom.",
        is_good: true,
        created_at: "2024-10-04T15:30:00Z",
      },
    ],
  },
  {
    id: 2,
    title: "Cybernetic Horizon",
    cover_img_url:
      "https://placehold.co/500x750/2d3748/ffffff?text=Cybernetic+Horizon",
    synopsis:
      "In a future dominated by AI, a lone hacker discovers a secret that could either liberate humanity or destroy it forever.",
    rating: 9.2,
    release_date: "2024-08-15",
    comments: [
      {
        id: 201,
        user: "FutureIsNow",
        comment: "Mind-bending plot and stunning visuals!",
        is_good: true,
        created_at: "2024-09-01T18:45:00Z",
      },
    ],
  },
];

