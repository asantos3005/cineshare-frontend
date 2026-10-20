
type moviePosterClickableProps = {
    omdbID: string;
    posterURL: string | null;
    title: string;
    year: number | null;
};

export default function MoviePosterClickable(posterProps: moviePosterClickableProps){
    
    return(
        <a href={`https://www.imdb.com/title/${encodeURIComponent(posterProps.omdbID)}/`} className="flex flex-col gap-2">
            {posterProps.posterURL ? (
                <img className="aspect-[2/3] w-full rounded-xl object-cover" src={posterProps.posterURL} alt={`${posterProps.title} poster`} loading="lazy" />
            ) : (
                <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-neutral-200 text-neutral-600">No poster available</div>
            )}
            <span className="font-semibold">{posterProps.title}</span>
            {posterProps.year !== null && <span className="text-sm text-neutral-600">{posterProps.year}</span>}
        </a>
    );
}
