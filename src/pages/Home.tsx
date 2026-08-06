import ReviewCard from "../components/ReviewCard";
import { useEffect, useState } from "react";
import sampleReviews from "../sample-data/sampleReviews.json";
import type { ReviewCardData } from "../types/reviewCardData";

function Home(){
    const [reviews, setReviews] = useState([sampleReviews]);
    return (
        <>
            <div className="flex flex-col">
                <h1 className="text-4xl font-bold mb-4">Latest Reviews</h1>
                <p className="text-lg text-gray-600">See what fellow movie lovers are saying!</p>
            </div>
            <div className="flex flex-col">
                {/* Review Cards will go in here */}
                {reviews.map((review : ReviewCardData) => (
                    <ReviewCard reviewObject={review} />
                ))}
            </div>
        </>
    );
}

export default Home;
