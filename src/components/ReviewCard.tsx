import type { ReviewCardData } from '../types/reviewCardData';
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";

export default function ProfileCircle({ reviewObject }: { reviewObject: ReviewCardData }) {

    function renderStars(rating: number) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <IoMdStar key={`full-${i}`} className="text-yellow-400" />
                ))}
                {halfStar === 1 && <IoMdStarHalf className="text-yellow-400" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <IoMdStar key={`empty-${i}`} className="text-gray-300" />
                ))}
            </>
        );
    }

  return (
    <div className="border-1 border-neutral-500 dark:border-white p-4 rounded-lg shadow-md">
        {/* Top Bar of the review card*/}
        <div className="flex items-center gap-2">
            <img src={reviewObject.author.profileImageUrl || 'https://via.placeholder.com/150'} alt={`${reviewObject.author.username}'s profile`} className="w-12 h-12 rounded-full" />
            <b>{reviewObject.author.username}</b>
            <b>{reviewObject.reviewedAt}</b>
        </div>
        
        <div className="flex items-center gap-2 pr-30">
            <img src={reviewObject.movieImageUrl} alt={reviewObject.movieImageAlt} className="max-w-3xs rounded-md" />
            
            <div className="flex flex-col">
                <h1 className="text-card-title">{reviewObject.movieTitle}</h1>
                <p className="text-body text-gray-600 ">{reviewObject.movieReleaseYear}</p>
                <div className="flex items-center gap-1">
                    {renderStars(reviewObject.rating)}
                </div>
                <p className="text-body">{reviewObject.reviewBody}</p>
            </div>
        </div>
        
    </div>
  );
}