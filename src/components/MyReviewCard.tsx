import type { myReviewCardData } from '../types/myReviewCardData';
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";

type MyReviewCardProps = {
    reviewObject: myReviewCardData;
    onDelete: (reviewId: string) => void;
};


export default function MyReviewCard({ reviewObject, onDelete }: MyReviewCardProps) {

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

            <button className="ml-auto rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 sm:ml-0 sm:mt-auto" onClick={() => onDelete(reviewObject.reviewId)}>
                Delete
            </button>
        </div>
        
    </article>
  );
}
