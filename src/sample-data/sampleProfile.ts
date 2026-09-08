import type { ProfileData } from "../types/profileData";

export type GenreOption = {
    genreId: number;
    name: string;
};

export type MovieSearchResult = {
    externalMovieId: string;
    title: string;
    year: string;
    posterUrl: string;
};

export const sampleGenreOptions: GenreOption[] = [
    { genreId: 1, name: "Action" },
    { genreId: 2, name: "Adventure" },
    { genreId: 3, name: "Animation" },
    { genreId: 4, name: "Comedy" },
    { genreId: 5, name: "Crime" },
    { genreId: 6, name: "Documentary" },
    { genreId: 7, name: "Drama" },
    { genreId: 8, name: "Family" },
    { genreId: 9, name: "Fantasy" },
    { genreId: 10, name: "History" },
    { genreId: 11, name: "Horror" },
    { genreId: 12, name: "Music" },
    { genreId: 13, name: "Mystery" },
    { genreId: 14, name: "Romance" },
    { genreId: 15, name: "Sci-Fi" },
    { genreId: 16, name: "TV Movie" },
    { genreId: 17, name: "Thriller" },
    { genreId: 18, name: "War" },
    { genreId: 19, name: "Western" },
    { genreId: 20, name: "Musical" },
];

export const sampleProfile: ProfileData = {
    firstName: "Maya",
    lastName: "Reyes",
    username: "mayawatches",
    profilePictureUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Melbourne-based film lover drawn to slow-burn thrillers, warm ensemble comedies, and anything with practical effects. I write short reviews after late screenings and keep a soft spot for messy, ambitious third acts.",
    stats: {
        reviewCount: 128,
        movieCount: 642,
        followerCount: 2380,
        followingCount: 314,
    },
    genres: ["Drama", "Sci-Fi", "Thriller", "Comedy", "Animation"],
    fourFavouriteMovies: [
        {
            movieId: 278,
            title: "The Shawshank Redemption",
            posterUrl:
                "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
        },
        {
            movieId: 157336,
            title: "Interstellar",
            posterUrl:
                "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        },
        {
            movieId: 496243,
            title: "Parasite",
            posterUrl:
                "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        },
        {
            movieId: 129,
            title: "Spirited Away",
            posterUrl:
                "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
        },
    ],
};

export const sampleMovieSearchResults: MovieSearchResult[] = [
    {
        externalMovieId: "603",
        title: "The Matrix",
        year: "1999",
        posterUrl:
            "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    },
    {
        externalMovieId: "550",
        title: "Fight Club",
        year: "1999",
        posterUrl:
            "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    },
    {
        externalMovieId: "680",
        title: "Pulp Fiction",
        year: "1994",
        posterUrl:
            "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    },
    {
        externalMovieId: "38",
        title: "Eternal Sunshine of the Spotless Mind",
        year: "2004",
        posterUrl:
            "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
    },
    {
        externalMovieId: "13",
        title: "Forrest Gump",
        year: "1994",
        posterUrl:
            "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    },
    {
        externalMovieId: "24428",
        title: "The Avengers",
        year: "2012",
        posterUrl:
            "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
    },
];
