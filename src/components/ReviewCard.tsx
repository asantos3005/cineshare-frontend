import type { ReviewCardData } from '../types/reviewCardData';
import { useState } from 'react';
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
import { BiHeart } from "react-icons/bi";
import { BiSolidHeart } from "react-icons/bi";
import { PiChatCircleBold } from "react-icons/pi";

export default function ReviewCard({ reviewObject }: { reviewObject: ReviewCardData }) {

    const [isLiked, setIsLiked] = useState(false);
    const [displayedLikeCount, setDisplayedLikeCount] = useState(reviewObject.likeCount);

    function handleLikeToggle() {
        const nextIsLiked = !isLiked;

        setIsLiked(nextIsLiked);
        setDisplayedLikeCount((currentLikeCount) => currentLikeCount + (nextIsLiked ? 1 : -1));
    }

    function renderStars(rating: number) {
        const normalizedRating = Number.isFinite(rating) ? Math.max(0, Math.min(rating, 5)) : 0;
        const fullStars = Math.floor(normalizedRating);
        const halfStar = normalizedRating % 1 >= 0.5 ? 1 : 0;
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
    <article className="rounded-lg border border-neutral-300 bg-white p-4 shadow-sm sm:p-5">
        {/* Top Bar of the review card*/}
        <div className="mb-4 flex items-center gap-3">
            <img src={reviewObject.author.profileImageUrl || 'https://via.placeholder.com/150'} alt={`${reviewObject.author.username}'s profile`} className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-12 sm:w-12" />
            <div className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold">{reviewObject.author.username}</span>
                <span className="text-xs text-gray-500">{new Date(reviewObject.reviewedAt).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <img src={reviewObject.movieImageUrl} alt={reviewObject.movieImageAlt} className="aspect-[2/3] w-full rounded-md object-cover sm:w-36 md:w-44" />
            
            <div className="flex min-w-0 flex-col gap-2">
                <h1 className="text-card-title">{reviewObject.movieTitle}</h1>
                <p className="text-sm text-gray-600">{reviewObject.movieReleaseYear}</p>
                <div className="flex items-center gap-1 text-lg">
                    {renderStars(reviewObject.rating)}
                </div>
                <p className="text-body">{reviewObject.reviewBody}</p>
            </div>
        </div>

        <div className="flex items-center gap-9 mt-4">
            <div className="flex items-center gap-2">
                {isLiked ? (
                    <BiSolidHeart className="h-6 w-6 text-red-500 cursor-pointer" onClick={handleLikeToggle} />
                    ) : (
                    <BiHeart className="h-6 w-6 text-gray-500 cursor-pointer" onClick={handleLikeToggle} />
                    )
                }
                <span className="text-xs text-gray-500 font-normal">{displayedLikeCount}</span>
            </div>

            <div className="flex items-center gap-2">
                <PiChatCircleBold className="h-5.5 w-5.5 text-gray-500 cursor-pointer" />
                <span className="text-xs text-gray-500 font-normal">{reviewObject.commentCount}</span>
            </div>
        </div>
        
    </article>
  );
}
