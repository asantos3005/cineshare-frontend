import Searchbar from "../components/Searchbar";
import AppLinkButton from "../components/LinkButton";
import { useState, useEffect } from "react";
import MyReviewCard from "../components/MyReviewCard";
import myReviewMapper from "../mappers/myReviewsMapper";
import type { myReviewCardData } from "../types/myReviewCardData";



export default function MyReviews() {
    const [reviews, setReviews] = useState<myReviewCardData[]>([]);

    function handleDelete(reviewId: string) {
        // TODO - Create delete endpoint in backend and call it here to delete the review from the database
        fetch(`http://localhost:5203/api/user/my-reviews/${reviewId}`, {
            method: 'DELETE',
            credentials: "include",
        })
            .then(response => {
                if (response.ok) {
                    // If the deletion was successful, update the state to remove the deleted review
                    setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
                } else {
                    console.error('Failed to delete review');
                }
            })
            .catch(error => {
                console.error('Error deleting review:', error);
            });
        }

    useEffect(() => {
        // Fetch the user's reviews from your API and set them in state
        // For example:
        fetch('http://localhost:5203/api/user/my-reviews', {
            credentials: "include",
        })
            .then(response => response.json())
            .then(data => {
                            const mappedReviews = data.map((apiReview: any) => myReviewMapper(apiReview));
                            setReviews(mappedReviews);
            });
    }, []);


    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6 sm:py-8">
            <div className="flex flex-col gap-2">
                <h1 className="page-title">My Reviews</h1>
                <p className="page-title-subheading">See all the reviews you've written.</p>
            </div>
            <div className="flex justify-between gap-2">
                <Searchbar />
                <AppLinkButton to="/reviews/add-review" variant="primary">
                    New Review
                </AppLinkButton>
            </div>
            <div className="flex flex-col gap-4 sm:gap-5">
                {/* Review Cards will go in here */}
                {/* You can map through your reviews and render ReviewCard components */}
                {reviews.length === 0 ? (
                    <p className="text-sm text-gray-500">You haven't written any reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.reviewId}>
                            {/* Render your ReviewCard component here */}
                            <MyReviewCard reviewObject={review} onDelete={handleDelete} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
