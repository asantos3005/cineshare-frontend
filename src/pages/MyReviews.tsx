import Searchbar from "../components/Searchbar";
import AppLinkButton from "../components/LinkButton";
import { useState } from "react";
import type { ReviewCardData } from "../types/reviewCardData";



export default function MyReviews() {
    const [reviews] = useState<ReviewCardData[]>([]);


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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
