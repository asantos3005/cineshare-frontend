import ReviewCard from "../components/ReviewCard";
import { useState, useEffect } from "react";
import sampleReviews from "../sample-data/sampleReviews.json";
import type { ReviewCardData } from "../types/reviewCardData";

function Home(){
    const [reviews, setReviews] = useState<ReviewCardData[]>([]);

    useEffect(() => {
        setReviews(sampleReviews as ReviewCardData[]);
    }, []);
    
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6 sm:py-8">
            <div className="flex flex-col gap-2">
                <h1 className="page-title">Latest Reviews</h1>
                <p className="page-title-subheading">See what fellow movie lovers are saying!</p>
            </div>
            <div className="flex flex-col gap-4 sm:gap-5">
                {/* Review Cards will go in here */}
                {reviews.map((review : ReviewCardData) => (
                    <ReviewCard reviewObject={review} />
                ))}
            </div>
        </div>
    );
}

export default Home;
