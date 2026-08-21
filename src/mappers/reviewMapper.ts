import type { ReviewCardData } from "../types/reviewCardData";

export function mapAPIReviewToReviewCardData(apiReviewResponse: any): ReviewCardData {
    return {
        reviewId: apiReviewResponse.ReviewId,
        movieTitle: apiReviewResponse.MovieTitle,
        movieReleaseYear: apiReviewResponse.MovieReleaseDate.split('-')[0], // Extracting the year from the date string
        movieImageUrl: apiReviewResponse.PosterUrl,
        movieImageAlt: apiReviewResponse.MovieTitle ? `${apiReviewResponse.MovieTitle} Poster` : "Movie Poster", // Fallback alt text if not provided
        rating: apiReviewResponse.Rating,
        reviewBody: apiReviewResponse.ReviewBody,
        reviewedAt: apiReviewResponse.CreatedAt, // Assuming the API provides a created_at field for the review date
        author: {
            username: apiReviewResponse.Username,
            profileImageUrl: apiReviewResponse.UserProfilePictureUrl || null // Fallback to null if not provided
        },
        likeCount: apiReviewResponse.like_count,
        commentCount: apiReviewResponse.comment_count
    };
}
