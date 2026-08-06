
export default function ProfileCircle({ reviewObject }: { reviewObject: { movieTitle: string;imageUrl: string; altText: string } }) {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-neutral-950 dark:border-white">
        <img src={reviewObject.imageUrl} alt={reviewObject.altText} className="w-full h-full object-cover" />
        <h2>{reviewObject.movieTitle}</h2>
    </div>
  );
}