import type { myReviewCardData } from "../types/myReviewCardData";

export default function mapAPIReviewToMyReviewCardData(apiReviewResponse: any): myReviewCardData {
    return {
        reviewId: apiReviewResponse.reviewId,
        movieTitle: apiReviewResponse.movieTitle,
        movieReleaseYear: apiReviewResponse.movieReleaseYear,
        movieImageUrl: apiReviewResponse.posterUrl,
        movieImageAlt: apiReviewResponse.movieTitle ? `${apiReviewResponse.movieTitle} Poster` : "Movie Poster",
        rating: apiReviewResponse.rating,
        reviewBody: apiReviewResponse.reviewBody,
        reviewedAt: apiReviewResponse.createdAt
    };
}
