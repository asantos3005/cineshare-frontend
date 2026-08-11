import { Link } from "react-router";
import { FaBold, FaItalic, FaListUl, FaQuoteLeft, FaUnderline } from "react-icons/fa";
import { IoMdClose, IoMdStar, IoMdStarOutline } from "react-icons/io";

const selectedMovie = {
    title: "Everything Everywhere All at Once",
    releaseYear: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_.jpg",
    posterAlt: "Everything Everywhere All at Once movie poster",
};

export default function AddReview() {
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

            <form className="flex flex-col gap-6">
                <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-neutral-950">Movie</span>
                    <input
                        type="search"
                        placeholder="Search for a movie..."
                        className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
                    />
                </label>

                <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:p-4">
                    <img
                        src={selectedMovie.posterUrl}
                        alt={selectedMovie.posterAlt}
                        className="h-20 w-14 shrink-0 rounded-md object-cover sm:h-24 sm:w-16"
                    />
                    <div className="min-w-0 flex-1">
                        <h2 className="text-card-title">{selectedMovie.title}</h2>
                        <p className="text-sm text-gray-600">{selectedMovie.releaseYear}</p>
                    </div>
                    <button
                        type="button"
                        aria-label="Remove selected movie"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                    >
                        <IoMdClose className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-neutral-950">Your Rating</span>
                        <div className="flex items-center gap-2 text-4xl text-amber-400 sm:text-5xl">
                            <IoMdStar />
                            <IoMdStar />
                            <IoMdStar />
                            <IoMdStar />
                            <IoMdStarOutline className="text-neutral-500" />
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-violet-700 sm:self-end">Amazing!</span>
                </div>

                <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-neutral-950">Review Title <span className="font-normal text-neutral-500">(optional)</span></span>
                    <input
                        type="text"
                        defaultValue="A wild and unforgettable ride"
                        className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
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
                            defaultValue={"This movie is unlike anything I've ever seen before. It's bold, creative, hilarious, heartbreaking-all at once.\nThe performances are incredible and the story stays with you long after the credits roll."}
                            className="min-h-40 w-full resize-y rounded-b-lg px-4 py-3 text-base leading-7 text-neutral-950 focus:outline-none"
                        />
                    </div>
                </label>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-violet-700 px-6 text-base font-semibold text-white shadow-md hover:bg-violet-800 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-violet-950 sm:w-auto"
                    >
                        Post Review
                    </button>
                </div>
            </form>
        </div>
    );
}
