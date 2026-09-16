import { IoMdClose } from "react-icons/io";
import defaultImage from "../../assets/default.jpg";
import Searchbar from "../Searchbar";

type GenreOption = {
    genreId: number;
    name: string;
};

type MovieSearchResult = {
    externalMovieId: string;
    title: string;
    year: string;
    posterUrl: string;
};

type FavouriteMovieFormData = {
    movieId?: number;
    externalMovieId?: string;
    title: string;
    posterUrl: string;
};

type EditableProfileFormData = {
    firstName: string;
    lastName: string;
    bio: string;
    profilePictureFile: File | null;
    profilePicturePreviewUrl: string;
    genres: string[];
    fourFavouriteMovies: FavouriteMovieFormData[];
};

type EditProfileFormProps = {
    editFormData: EditableProfileFormData;
    genreOptions: GenreOption[];
    genreOptionsError: string;
    movieSearchResults: MovieSearchResult[];
    movieSearchError: string;
    submitError: string;
    isSubmittingProfile: boolean;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    onInputChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onProfilePictureChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onGenreSelectionChange: (genreName: string) => void;
    onMovieSearch: (query: string) => void;
    onFavouriteMovieSelect: (movieSearchResult: MovieSearchResult) => void;
    onFavouriteMovieRemove: (movieToRemove: FavouriteMovieFormData) => void;
};

function getFavouriteMovieIdentifier(movie: FavouriteMovieFormData) {
    return movie.movieId?.toString() ?? movie.externalMovieId ?? movie.title;
}

export default function EditProfileForm({
    editFormData,
    genreOptions,
    genreOptionsError,
    movieSearchResults,
    movieSearchError,
    submitError,
    isSubmittingProfile,
    onSubmit,
    onCancel,
    onInputChange,
    onProfilePictureChange,
    onGenreSelectionChange,
    onMovieSearch,
    onFavouriteMovieSelect,
    onFavouriteMovieRemove,
}: EditProfileFormProps) {
    return (
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <form className="flex flex-col gap-6" onSubmit={onSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-neutral-950">First Name</span>
                            <input
                                type="text"
                                name="firstName"
                                value={editFormData.firstName}
                                onChange={onInputChange}
                                required
                                className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
                            />
                        </label>

                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-neutral-950">Last Name</span>
                            <input
                                type="text"
                                name="lastName"
                                value={editFormData.lastName}
                                onChange={onInputChange}
                                required
                                className="h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base text-neutral-950 shadow-sm focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-sm font-semibold text-neutral-950">Profile Image</span>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <img
                                src={editFormData.profilePicturePreviewUrl || defaultImage}
                                alt="Profile preview"
                                className="h-20 w-20 rounded-full object-cover ring-2 ring-neutral-200"
                            />
                            <label className="flex flex-col gap-2">
                                <span className="text-sm font-semibold text-neutral-950">Upload Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onProfilePictureChange}
                                    className="block w-full text-sm text-neutral-700 file:mr-4 file:h-10 file:rounded-md file:border file:border-neutral-300 file:bg-white file:px-4 file:text-sm file:font-medium file:text-neutral-950 hover:file:bg-neutral-50"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-section-title">About Me</h2>
                        <textarea
                            name="bio"
                            value={editFormData.bio}
                            onChange={onInputChange}
                            rows={5}
                            placeholder="Tell people a little about yourself."
                            className="w-full resize-y rounded-md border border-neutral-300 bg-white p-3 text-sm leading-6 text-neutral-950 shadow-sm placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950 sm:text-base"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <fieldset className="flex flex-col gap-3">
                            <legend className="text-section-title">Favorite Genres</legend>
                            {genreOptionsError && (
                                <p className="text-sm font-semibold text-red-700">
                                    {genreOptionsError}
                                </p>
                            )}
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {genreOptions.map((genre) => {
                                    const isSelected = editFormData.genres.includes(genre.name);

                                    return (
                                        <label
                                            key={genre.genreId}
                                            className={`flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-3 text-center text-sm font-semibold shadow-sm transition ${
                                                isSelected
                                                    ? "border-violet-700 bg-violet-700 text-white"
                                                    : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={isSelected}
                                                onChange={() => onGenreSelectionChange(genre.name)}
                                            />
                                            {genre.name}
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-section-title">Top 4 Favourite Movies</span>
                                <span className="text-sm font-semibold text-violet-700">
                                    {editFormData.fourFavouriteMovies.length}/4
                                </span>
                            </div>

                            <Searchbar
                                placeholder="Search for a movie"
                                buttonText="Search"
                                asForm={false}
                                className="w-full"
                                inputClassName="h-12 border-neutral-300 px-4 text-base shadow-sm"
                                buttonClassName="h-12 px-5 text-base font-semibold shadow-sm"
                                onSearch={onMovieSearch}
                            />

                            {movieSearchError && (
                                <p className="text-sm font-semibold text-red-700">{movieSearchError}</p>
                            )}

                            {movieSearchResults.length > 0 && (
                                <div className="max-h-60 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white p-2 shadow-sm">
                                    <ul className="flex flex-col gap-2">
                                        {movieSearchResults.map((movie) => (
                                            <li key={movie.externalMovieId}>
                                                <button
                                                    type="button"
                                                    onClick={() => onFavouriteMovieSelect(movie)}
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

                            {editFormData.fourFavouriteMovies.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {editFormData.fourFavouriteMovies.map((movie) => (
                                        <article
                                            key={getFavouriteMovieIdentifier(movie)}
                                            className="relative flex flex-col gap-2"
                                        >
                                            <img
                                                src={movie.posterUrl}
                                                alt={`${movie.title} poster`}
                                                className="aspect-[2/3] w-full rounded-lg object-cover shadow-sm"
                                            />
                                            <h3 className="line-clamp-2 text-sm font-semibold text-neutral-950">
                                                {movie.title}
                                            </h3>
                                            <button
                                                type="button"
                                                aria-label={`Remove ${movie.title}`}
                                                onClick={() => onFavouriteMovieRemove(movie)}
                                                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/95 text-neutral-800 shadow-sm hover:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                                            >
                                                <IoMdClose className="h-5 w-5" />
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    {submitError && (
                        <p className="text-sm font-semibold text-red-700 sm:self-center">
                            {submitError}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmittingProfile}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmittingProfile}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-violet-700 px-4 text-sm font-medium text-white shadow-sm hover:bg-violet-800 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-violet-950 disabled:bg-violet-400"
                    >
                        {isSubmittingProfile ? "Saving..." : "Save Profile"}
                    </button>
                </div>
            </form>
        </section>
    );
}
