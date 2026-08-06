import type { ReviewCardData } from '../types/reviewCardData';

export default function ProfileCircle({ reviewObject }: { reviewObject: ReviewCardData }) {
  return (
    <div className="border-2 border-neutral-950 dark:border-white">
        <b>{reviewObject.author.username}</b>
        <b>{reviewObject.reviewedAt}</b>
        <img src={reviewObject.movieImageUrl} alt={reviewObject.movieImageAlt} className="max-w-xs" />
        <h2>{reviewObject.movieTitle}</h2>
        <p>{reviewObject.reviewBody}</p>
    </div>
  );
}