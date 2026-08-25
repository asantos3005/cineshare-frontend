import type { ReviewCardData } from "../types/reviewCardData";

export default function mapAPIReviewToReviewCardData(apiReviewResponse: any): ReviewCardData {
    return {
        reviewId: apiReviewResponse.reviewId,
        movieTitle: apiReviewResponse.movieTitle,
        movieReleaseYear: apiReviewResponse.movieReleaseYear ?? apiReviewResponse.releaseYear ?? 0,
        movieImageUrl: apiReviewResponse.posterUrl,
        movieImageAlt: apiReviewResponse.movieTitle ? `${apiReviewResponse.movieTitle} Poster` : "Movie Poster",
        rating: Number(apiReviewResponse.rating ?? apiReviewResponse.rating ?? 0),
        reviewBody: apiReviewResponse.reviewBody,
        reviewedAt: apiReviewResponse.createdAt,
        author: {
            username: apiReviewResponse.username,
            profileImageUrl: apiReviewResponse.userProfilePictureUrl || null
        },
        likeCount: apiReviewResponse.like_count ?? apiReviewResponse.likeCount ?? 0,
        commentCount: apiReviewResponse.comment_count ?? apiReviewResponse.commentCount ?? 0
    };
}
