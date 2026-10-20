import { useEffect, useState } from "react";
import MoviePosterClickable from "../components/MoviePosterClickable";
import type { MovieDiscoverData } from "../types/MovieData";
import mapMovieDiscoverResponse from "../mappers/movieMapper";

export default function Movies(){
    const [movies, setMovies] = useState<MovieDiscoverData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(()=>{
        const controller = new AbortController();

        fetch('http://localhost:5203/api/movies/discover', { signal: controller.signal })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Movie discovery failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (controller.signal.aborted) return;
                setMovies(mapMovieDiscoverResponse(data));
                setIsLoading(false);
            })
            .catch(error => {
                if (controller.signal.aborted) return;
                console.error('Error fetching movies:', error);
                setError("Unable to load movies. Please try again later.");
                setIsLoading(false);
            });

        return () => controller.abort();
    }, []);
    return(
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6 sm:py-8">
            <h1 className="page-title">Discover Movies</h1>
            {isLoading && <p role="status">Loading movies...</p>}
            {error && <p role="alert" className="text-red-700">{error}</p>}
            {!isLoading && !error && movies.length === 0 && <p>No movies found.</p>}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {movies.map(movie => (
                    <MoviePosterClickable
                        key={movie.externalMovieId}
                        omdbID={movie.externalMovieId}
                        posterURL={movie.posterURL}
                        title={movie.title}
                        year={movie.year}
                    />
                ))}
            </div>
        </div>
    );
}
