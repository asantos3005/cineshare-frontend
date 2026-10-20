import type { MovieDiscoverData } from "../types/MovieData";

export default function mapMovieDiscoverResponse(data: unknown): MovieDiscoverData[] {
    if (!Array.isArray(data)) {
        throw new Error("Expected the movie discover response to be an array.");
    }

    return data.map((movie: unknown): MovieDiscoverData => {
        // The backend's JsonPropertyName attributes preserve imdbID and Poster.
        if (
            typeof movie !== "object" || movie === null ||
            !("imdbID" in movie) || typeof movie.imdbID !== "string" ||
            !/^tt\d+$/.test(movie.imdbID) ||
            !("title" in movie) || typeof movie.title !== "string" ||
            !("year" in movie) || typeof movie.year !== "string" ||
            !("Poster" in movie) ||
            (movie.Poster !== null && typeof movie.Poster !== "string")
        ) {
            throw new Error("The movie discover response contains an invalid movie.");
        }

        return {
            externalMovieId: movie.imdbID,
            title: movie.title,
            posterURL: movie.Poster && movie.Poster !== "N/A" ? movie.Poster : null,
            year: /^\d{4}$/.test(movie.year) ? Number(movie.year) : null,
        };
    });
}
