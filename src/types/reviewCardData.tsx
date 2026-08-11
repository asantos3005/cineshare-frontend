export type ReviewCardData = {
  movieTitle: string;
  movieReleaseYear: number;
  movieImageUrl: string;
  movieImageAlt: string;
  rating: number;
  reviewBody: string;
  reviewedAt: string;
  author: {
    username: string;
    profileImageUrl: string | null;
  };
  likeCount: number;
};