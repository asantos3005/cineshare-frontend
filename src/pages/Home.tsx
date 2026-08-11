import ReviewCard from "../components/ReviewCard";
import { useState } from "react";
import sampleReviews from "../sample-data/sampleReviews.json";
import type { ReviewCardData } from "../types/reviewCardData";

function Home(){
    const [reviews] = useState(sampleReviews as ReviewCardData[]);
    return (
        <>
            <div className="flex flex-col">
                <h1 className="page-title">Latest Reviews</h1>
                <p className="page-title-subheading">See what fellow movie lovers are saying!</p>
            </div>
            <div className="flex flex-col gap-4">
                {/* Review Cards will go in here */}
                {reviews.map((review : ReviewCardData) => (
                    <ReviewCard reviewObject={review} />
                ))}
            </div>
        </>
    );
}

export default Home;
