export default function GenreBadge({ genre }: { genre: string }) {
  return (
    <span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
      {genre}
    </span>
  );
}

