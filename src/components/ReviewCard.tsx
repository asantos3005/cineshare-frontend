import type { ReviewCardData } from '../types/reviewCardData';

export default function ProfileCircle({ reviewObject }: { reviewObject: ReviewCardData }) {
  return (
    <div className="border-2 border-neutral-950 dark:border-white">
        {/* Top Bar of the review card*/}
        <div className="flex items-center gap-2">
            <img src={reviewObject.author.profileImageUrl || 'https://via.placeholder.com/150'} alt={`${reviewObject.author.username}'s profile`} className="w-12 h-12 rounded-full" />
            <b>{reviewObject.author.username}</b>
            <b>{reviewObject.reviewedAt}</b>
        </div>
        
        <div className="flex items-center gap-2 pr-30">
            <img src={reviewObject.movieImageUrl} alt={reviewObject.movieImageAlt} className="max-w-2xs rounded-md m-5" />
            
            <div className="flex flex-col">
                <h1 className="text-card-title">{reviewObject.movieTitle}</h1>
                <p className="text-body">{reviewObject.movieReleaseYear}</p>
                <p className="text-body">{reviewObject.reviewBody}</p>
            </div>
        </div>
        
    </div>
  );
}