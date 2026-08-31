import { Link } from "react-router";
import Searchbar from "../components/Searchbar";
import { FaBold, FaItalic, FaListUl, FaQuoteLeft, FaUnderline } from "react-icons/fa";
import { IoMdClose, IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";
import { useState, type FormEvent, type MouseEvent } from "react";
import { useAuth } from "../auth/AuthContext";

type MovieSearchResult = {
    externalMovieId: string;
    title: string;
    year: string;
    posterUrl: string;
};

type CreateReviewRequest = {
    ExternalMovieId: string;
    Title: string;
    ReviewBody: string;
    Rating: number;
};

export default function AddReview() {
    const { isAuthenticated, user } = useAuth();
    const [movieSearchResults, setMovieSearchResults] = useState<MovieSearchResult[]>([]);
    const [movieToReview, setMovieToReview] = useState<MovieSearchResult | null>(null);
    const [rating, setRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewBody, setReviewBody] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    function handleMovieSearch(query: string) {
        fetch(`http://localhost:5203/api/movies?searchKeyword=${encodeURIComponent(query)}`)
            .then((response) => response.json())
            .then((data) => {
                setMovieSearchResults(Array.isArray(data) ? data : data.results ?? []);
            })
            .catch((error) => {
                console.error("Error fetching movie search results:", error);
            });
        console.log("Searching for movies with query:", query);
    }

    function handleMovieSelect(movie: MovieSearchResult) {
        setMovieToReview(movie);
        setMovieSearchResults([]);
        setSubmitError("");
    }

    function handleRatingClick(event: MouseEvent<HTMLButtonElement>, starValue: number) {
        const { left, width } = event.currentTarget.getBoundingClientRect();
        const clickPosition = event.clientX - left;
        const isHalfStar = clickPosition <= width / 2;

        setRating(isHalfStar ? starValue - 0.5 : starValue);
    }

    function renderRatingStar(starValue: number) {
        if (rating >= starValue) {
            return <IoMdStar />;
        }

        if (rating === starValue - 0.5) {
            return <IoMdStarHalf />;
        }

        return <IoMdStarOutline className="text-neutral-500" />;
    }

    const ratingLabel = rating === 0 ? "No rating yet" : `${rating} out of 5`;

    async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitError("");
        setSubmitSuccess("");

        if (!isAuthenticated || !user) {
            setSubmitError("You need to be logged in before posting a review.");
            return;
        }

        if (!movieToReview) {
            setSubmitError("Choose a movie before posting your review.");
            return;
        }

        if (rating === 0) {
            setSubmitError("Choose a rating before posting your review.");
            return;
        }

        if (!reviewTitle.trim() || !reviewBody.trim()) {
            setSubmitError("Add a title and review before posting.");
            return;
        }

        const reviewRequest: CreateReviewRequest = {
            ExternalMovieId: movieToReview.externalMovieId,
            Title: reviewTitle.trim(),
            ReviewBody: reviewBody.trim(),
            Rating: Math.round(rating),
        };

        setIsSubmittingReview(true);

        try {
            const response = await fetch("http://localhost:5203/api/reviews", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewRequest),
            });

            if (!response.ok) {
                throw new Error(`Review creation failed with status ${response.status}`);
            }

            setSubmitSuccess("Review posted.");
        } catch (error) {
            console.error("Error creating review:", error);
            setSubmitError("Something went wrong while posting your review.");
        } finally {
            setIsSubmittingReview(false);
        }
    }


    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="page-title">Add Review</h1>
                    <p className="page-title-subheading">Share your thoughts about a movie.</p>
                </div>

                <Link
                    to="/"
                    className="inline-flex h-10 items-center justify-center self-start rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                >
                    Cancel
                </Link>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-neutral-950">Movie</span>
                    <Searchbar
                        placeholder="Search for a movie"
                        buttonText="Submit"
                        className="w-full"
                        inputClassName="h-12 border-neutral-300 px-4 text-base shadow-sm"
                        buttonClassName="h-12 px-5 text-base font-semibold shadow-sm"
                        onSearch={handleMovieSearch}
                    />
                    {movieSearchResults.length > 0 && (
                        <div className="max-h-60 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white p-2 shadow-sm">
                            <ul className="flex flex-col gap-2">
                                {movieSearchResults.map((movie) => (
                                    <li key={movie.externalMovieId}>
                                        <button
                                            type="button"
                                            onClick={() => handleMovieSelect(movie)}
                                            className="flex w-full items-center gap-3 rounded-md border border-neutral-200 bg-white p-2 text-left shadow-sm hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                                        >
                                            <img
                                                src={movie.posterUrl}
                                                alt={`${movie.title} movie poster`}
                                                className="h-16 w-11 shrink-0 rounded-sm object-cover"
                                            />
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-semibold text-neutral-950">
                                                    {movie.title}
                                                </span>
                                                <span className="block text-sm text-neutral-600">
                                                    {movie.year}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleReviewSubmit}>
                    {movieToReview && (
                        <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
                            <img
                                src={movieToReview.posterUrl}
                                alt={`${movieToReview.title} movie poster`}
                                className="h-20 w-14 shrink-0 rounded-md object-cover sm:h-24 sm:w-16"
                            />
                            <div className="min-w-0 flex-1">
                                <h2 className="text-card-title">{movieToReview.title}</h2>
                                <p className="text-sm text-gray-600">{movieToReview.year}</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Remove selected movie"
                                onClick={() => setMovieToReview(null)}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                            >
                                <IoMdClose className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-neutral-950">Your Rating</span>
                            <div className="flex items-center gap-1 text-4xl text-amber-400 sm:text-5xl">
                                {[1, 2, 3, 4, 5].map((starValue) => (
                                    <button
                                        key={starValue}
                                        type="button"
                                        aria-label={`Rate ${starValue} out of 5`}
                                        aria-pressed={rating === starValue}
                                        onClick={(event) => handleRatingClick(event, starValue)}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-amber-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 sm:h-14 sm:w-14"
                                    >
                                        {renderRatingStar(starValue)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-violet-700 sm:self-end">{ratingLabel}</span>
                    </div>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-neutral-950">Review Title</span>
                        <input
                            type="text"
                            value={reviewTitle}
                            onChange={(event) => setReviewTitle(event.target.value)}
                            placeholder="Give your review a title"
                            required
                            className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-neutral-950">Your Review</span>
                        <div className="rounded-lg border border-neutral-300 bg-white shadow-sm focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-neutral-950">
                            <div className="flex items-center gap-1 border-b border-neutral-200 px-3 py-2 text-neutral-600">
                                <button type="button" aria-label="Bold" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100">
                                    <FaBold className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" aria-label="Italic" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100">
                                    <FaItalic className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" aria-label="Underline" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100">
                                    <FaUnderline className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" aria-label="Bulleted list" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100">
                                    <FaListUl className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" aria-label="Quote" className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100">
                                    <FaQuoteLeft className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <textarea
                                rows={6}
                                value={reviewBody}
                                onChange={(event) => setReviewBody(event.target.value)}
                                placeholder="Share your thoughts about the movie"
                                required
                                className="min-h-40 w-full resize-y rounded-b-lg px-4 py-3 text-base leading-7 text-neutral-950 placeholder:text-neutral-400 focus:outline-none"
                            />
                        </div>
                    </label>

                    {(submitError || submitSuccess) && (
                        <p className={`text-sm font-semibold ${submitError ? "text-red-700" : "text-green-700"}`}>
                            {submitError || submitSuccess}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmittingReview}
                            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-violet-700 px-6 text-base font-semibold text-white shadow-md hover:bg-violet-800 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-violet-950 disabled:bg-violet-400 sm:w-auto"
                        >
                            {isSubmittingReview ? "Posting..." : "Post Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
