import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { IoMdClose } from "react-icons/io";
import type { ProfileData } from "../types/profileData";
import defaultImage from "../assets/default.jpg";
import { useAuth } from "../auth/AuthContext";
import FollowingButton from "../components/FollowingButtton";
import GenreBadge from "../components/GenreBadge";
import Searchbar from "../components/Searchbar";
import {
    sampleGenreOptions,
    sampleMovieSearchResults,
    sampleProfile,
} from "../sample-data/sampleProfile";
import type { GenreOption, MovieSearchResult } from "../sample-data/sampleProfile";

const API_BASE_URL = "http://localhost:5203";

type FollowStatusResponse = {
    isFollowing: boolean;
};

type EditableProfileFormData = {
    firstName: string;
    lastName: string;
    bio: string;
    profilePictureFile: File | null;
    profilePicturePreviewUrl: string;
    genres: string[];
    fourFavouriteMovies: ProfileData["fourFavouriteMovies"];
};

type GenreApiResponse = GenreOption | string;

function getSampleProfileForUsername(username: string): ProfileData {
    return {
        ...sampleProfile,
        username,
        fourFavouriteMovies: sampleProfile.fourFavouriteMovies.map((movie) => ({ ...movie })),
        genres: [...sampleProfile.genres],
        stats: { ...sampleProfile.stats },
    };
}

function getGenreOptionsFromResponse(responseBody: GenreApiResponse[]): GenreOption[] {
    return responseBody.map((genre, index) => {
        if (typeof genre === "string") {
            return {
                genreId: index + 1,
                name: genre,
            };
        }

        return genre;
    });
}

function getFavouriteMovieFromSearchResult(
    movieSearchResult: MovieSearchResult
): ProfileData["fourFavouriteMovies"][number] {
    return {
        movieId: Number(movieSearchResult.externalMovieId),
        title: movieSearchResult.title,
        posterUrl: movieSearchResult.posterUrl,
    };
}


export default function Profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    // Username represents the profile being viewed, not the logged in user!
    const { username } = useParams();
    const isProfilePreview = import.meta.env.DEV && location.pathname.startsWith("/profile-preview/");

    const [profileData, setProfileData] = useState<ProfileData | null>(
        username && isProfilePreview ? getSampleProfileForUsername(username) : null
    );
    const [profileError, setProfileError] = useState("");
    const [genreOptions, setGenreOptions] = useState<GenreOption[]>(sampleGenreOptions);
    const [genreOptionsError, setGenreOptionsError] = useState("");
    const [movieSearchResults, setMovieSearchResults] = useState<MovieSearchResult[]>([]);
    const [movieSearchError, setMovieSearchError] = useState("");

    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowStatusLoading, setIsFollowStatusLoading] = useState(false);
    const [followError, setFollowError] = useState("");

    // State to manage whether the profile is in edit mode or not
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState<EditableProfileFormData>({
        firstName: "",
        lastName: "",
        bio: "",
        profilePictureFile: null,
        profilePicturePreviewUrl: "",
        genres: [],
        fourFavouriteMovies: [],
    });

    // Check if the logged in user from auth context is the same as the profile being viewed. If so, show the edit button.
    const isOwnProfile =
        isProfilePreview || user?.username.toLowerCase() === username?.toLowerCase();

    useEffect(() => {
        if (isProfilePreview) {
            return;
        }

        fetch(`${API_BASE_URL}/api/genres`, {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Genre request failed with status ${response.status}`);
                }

                return response.json() as Promise<GenreApiResponse[]>;
            })
            .then(data => {
                setGenreOptions(getGenreOptionsFromResponse(data));
                setGenreOptionsError("");
            })
            .catch(error => {
                console.error("Error fetching genres:", error);
                if (import.meta.env.DEV) {
                    setGenreOptions(sampleGenreOptions);
                    return;
                }

                setGenreOptionsError("Genres could not be loaded.");
            });
    }, [isProfilePreview]);

    // Use effect to fetch profile data when the component mounts or when the username changes
    useEffect(() => {
        if (!username) {
            return;
        }

        if (isProfilePreview) {
            return;
        }

        fetch(`${API_BASE_URL}/api/user/profile/${encodeURIComponent(username)}`, {
            credentials: "include",
        })
            .then(response => {
                if (response.status === 401) {
                    navigate("/login");
                    return null;
                }

                if (!response.ok) {
                    throw new Error(`Profile request failed with status ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                if (!data) {
                    return;
                }

                setProfileData(data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                if (import.meta.env.DEV) {
                    setProfileData(getSampleProfileForUsername(username));
                    setProfileError("");
                    return;
                }

                setProfileError("Profile data could not be loaded.");
            })
        
        
    }, [isProfilePreview, navigate, username]);

    // Use effect to fetch follow status when the component mounts or when the username changes
    useEffect(() => {
        if (!username || isOwnProfile || isProfilePreview || (import.meta.env.DEV && !user)) {
            return;
        }

        fetch(`${API_BASE_URL}/api/user/profile/${encodeURIComponent(username)}/follow-status`, {
            credentials: "include",
        })
            .then(response => {
                if (response.status === 401) {
                    navigate("/login");
                    return null;
                }

                if (!response.ok) {
                    throw new Error(`Follow status request failed with status ${response.status}`);
                }

                return response.json() as Promise<FollowStatusResponse>;
            })
            .then(data => {
                if (!data) {
                    return;
                }

                setIsFollowing(data.isFollowing);
            })
            .catch(error => {
                console.error("Error fetching follow status:", error);
                setFollowError("Follow status could not be loaded.");
            })
            .finally(() => {
                setIsFollowStatusLoading(false);
            });
    }, [isOwnProfile, isProfilePreview, navigate, user, username]);

    useEffect(() => {
        const previewUrl = editFormData.profilePicturePreviewUrl;

        return () => {
            if (previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [editFormData.profilePicturePreviewUrl]);

    async function handleFollowToggle() {
        if (!username || isFollowStatusLoading) {
            return;
        }

        setFollowError("");
        setIsFollowStatusLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/user/profile/${encodeURIComponent(username)}/follow`,
                {
                    method: isFollowing ? "DELETE" : "POST",
                    credentials: "include",
                }
            );

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`Follow request failed with status ${response.status}`);
            }

            const nextIsFollowing = !isFollowing;

            setIsFollowing(nextIsFollowing);
            setProfileData((currentProfileData) => {
                if (!currentProfileData) {
                    return currentProfileData;
                }

                const followerCountChange = nextIsFollowing ? 1 : -1;

                return {
                    ...currentProfileData,
                    stats: {
                        ...currentProfileData.stats,
                        followerCount: Math.max(
                            0,
                            currentProfileData.stats.followerCount + followerCountChange
                        ),
                    },
                };
            });
        } catch (error) {
            console.error("Error updating follow status:", error);
            setFollowError("Follow status could not be updated.");
        } finally {
            setIsFollowStatusLoading(false);
        }
    }

    function getEditableProfileFormData(profile: ProfileData): EditableProfileFormData {
        return {
            firstName: profile.firstName,
            lastName: profile.lastName,
            bio: profile.bio ?? "",
            profilePictureFile: null,
            profilePicturePreviewUrl: profile.profilePictureUrl ?? "",
            genres: [...profile.genres],
            fourFavouriteMovies: profile.fourFavouriteMovies.map((movie) => ({ ...movie })),
        };
    }

    function handleEditProfileToggle() {
        if (!profileData) {
            return;
        }

        setEditFormData(getEditableProfileFormData(profileData));
        setIsEditing(true);
    }

    function handleEditProfileCancel() {
        if (profileData) {
            setEditFormData(getEditableProfileFormData(profileData));
        }

        setIsEditing(false);
    }

    function handleEditProfileInputChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = event.target;

        setEditFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));
    }

    function handleProfilePictureChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0] ?? null;

        setEditFormData((currentFormData) => {
            if (currentFormData.profilePicturePreviewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(currentFormData.profilePicturePreviewUrl);
            }

            return {
                ...currentFormData,
                profilePictureFile: selectedFile,
                profilePicturePreviewUrl: selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : profileData?.profilePictureUrl ?? "",
            };
        });
    }

    function handleGenreSelectionChange(genreName: string) {
        setEditFormData((currentFormData) => {
            const isSelected = currentFormData.genres.includes(genreName);

            return {
                ...currentFormData,
                genres: isSelected
                    ? currentFormData.genres.filter((genre) => genre !== genreName)
                    : [...currentFormData.genres, genreName],
            };
        });
    }

    function handleMovieSearch(query: string) {
        setMovieSearchError("");

        if (isProfilePreview) {
            const normalizedQuery = query.toLowerCase();
            setMovieSearchResults(
                sampleMovieSearchResults.filter((movie) =>
                    movie.title.toLowerCase().includes(normalizedQuery)
                )
            );
            return;
        }

        fetch(`${API_BASE_URL}/api/movies?searchKeyword=${encodeURIComponent(query)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Movie search failed with status ${response.status}`);
                }

                return response.json();
            })
            .then((data) => {
                setMovieSearchResults(Array.isArray(data) ? data : data.results ?? []);
            })
            .catch((error) => {
                console.error("Error fetching movie search results:", error);
                if (import.meta.env.DEV) {
                    const normalizedQuery = query.toLowerCase();
                    setMovieSearchResults(
                        sampleMovieSearchResults.filter((movie) =>
                            movie.title.toLowerCase().includes(normalizedQuery)
                        )
                    );
                    return;
                }

                setMovieSearchError("Movies could not be loaded.");
            });
    }

    function handleFavouriteMovieSelect(movieSearchResult: MovieSearchResult) {
        setMovieSearchError("");

        setEditFormData((currentFormData) => {
            const isAlreadySelected = currentFormData.fourFavouriteMovies.some(
                (movie) => movie.movieId === Number(movieSearchResult.externalMovieId)
            );

            if (isAlreadySelected) {
                return currentFormData;
            }

            if (currentFormData.fourFavouriteMovies.length >= 4) {
                setMovieSearchError("Remove a movie before adding another favourite.");
                return currentFormData;
            }

            return {
                ...currentFormData,
                fourFavouriteMovies: [
                    ...currentFormData.fourFavouriteMovies,
                    getFavouriteMovieFromSearchResult(movieSearchResult),
                ],
            };
        });

        setMovieSearchResults([]);
    }

    function handleFavouriteMovieRemove(movieId: number) {
        setMovieSearchError("");
        setEditFormData((currentFormData) => ({
            ...currentFormData,
            fourFavouriteMovies: currentFormData.fourFavouriteMovies.filter(
                (movie) => movie.movieId !== movieId
            ),
        }));
    }

    function handleEditProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setProfileData((currentProfileData) => {
            if (!currentProfileData) {
                return currentProfileData;
            }

            return {
                ...currentProfileData,
                firstName: editFormData.firstName.trim(),
                lastName: editFormData.lastName.trim(),
                bio: editFormData.bio.trim() || null,
                profilePictureUrl: editFormData.profilePicturePreviewUrl || null,
                genres: editFormData.genres,
                fourFavouriteMovies: editFormData.fourFavouriteMovies,
            };
        });

        setIsEditing(false);
    }

    if (!username) {
        return <div>Profile username was not provided.</div>;
    }

    if (!profileData) {
        return <div>{profileError || "Loading..."}</div>;
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6 sm:py-8">
            <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <img
                            src={profileData.profilePictureUrl || defaultImage}
                            alt={`${profileData.firstName}'s profile`}
                            className="h-24 w-24 rounded-full object-cover ring-2 ring-neutral-200 sm:h-28 sm:w-28"
                        />
                        <div>
                            <h1 className="page-title inline">{profileData.firstName}</h1>
                            <h1 className="page-title inline"> {profileData.lastName}</h1>
                            <p className="page-title-subheading">{profileData.username}</p>
                        </div>
                    </div>

                    {isOwnProfile && (
                        <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center self-start rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                            onClick={handleEditProfileToggle}
                        >
                            Edit Profile
                    </button>
                )}
                    {!isOwnProfile && (
                        <div className="flex flex-col items-start gap-2">
                            <FollowingButton
                                isFollowing={isFollowing}
                                isLoading={isFollowStatusLoading}
                                onClick={handleFollowToggle}
                            />
                            {followError && (
                                <p className="text-sm font-semibold text-red-700">{followError}</p>
                            )}
                        </div>
                    )}
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-neutral-200 pt-5 sm:grid-cols-4 sm:gap-6">
                    
                        <div className="text-center">
                            <dt className="text-sm text-gray-600">Reviews</dt>
                            <dd className="text-2xl font-semibold text-neutral-950">{profileData.stats.reviewCount}</dd>
                        </div>
                        <div className="text-center">
                            <dt className="text-sm text-gray-600">Movies</dt>
                            <dd className="text-2xl font-semibold text-neutral-950">{profileData.stats.movieCount}</dd>
                        </div>
                        <div className="text-center">
                            <dt className="text-sm text-gray-600">Followers</dt>
                            <dd className="text-2xl font-semibold text-neutral-950">{profileData.stats.followerCount}</dd>
                        </div>
                        <div className="text-center">
                            <dt className="text-sm text-gray-600">Following</dt>
                            <dd className="text-2xl font-semibold text-neutral-950">{profileData.stats.followingCount}</dd>
                        </div>
                    
                </dl>
            </section>

            {!isEditing && 
                (
                    <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-section-title">About Me</h2>
                                <p className="text-body max-w-2xl">{profileData.bio}</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h2 className="text-section-title">Favorite Genres</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profileData.genres.map((genre) => (
                                        <GenreBadge key={genre} genre={genre} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h2 className="text-section-title">Top 4 Favourite Movies</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                                    {profileData.fourFavouriteMovies.map((movie) => (
                                        <article key={movie.title} className="flex flex-col gap-2">
                                            <img
                                                src={movie.posterUrl}
                                                alt={`${movie.title} poster`}
                                                className="aspect-[2/3] w-full rounded-lg object-cover shadow-sm"
                                            />
                                            <h3 className="line-clamp-2 text-sm font-semibold text-neutral-950">{movie.title}</h3>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }

            { isOwnProfile && isEditing && 
                (
                    <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                        <form className="flex flex-col gap-6" onSubmit={handleEditProfileSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-neutral-950">First Name</span>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={editFormData.firstName}
                                            onChange={handleEditProfileInputChange}
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
                                            onChange={handleEditProfileInputChange}
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
                                                onChange={handleProfilePictureChange}
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
                                        onChange={handleEditProfileInputChange}
                                        rows={5}
                                        placeholder="Tell people a little about yourself."
                                        className="w-full resize-y rounded-md border border-neutral-300 bg-white p-3 text-sm leading-6 text-neutral-950 shadow-sm placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950 sm:text-base"
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <fieldset className="flex flex-col gap-3">
                                        <legend className="text-section-title">Favorite Genres</legend>
                                        {genreOptionsError && (
                                            <p className="text-sm font-semibold text-red-700">{genreOptionsError}</p>
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
                                                            onChange={() => handleGenreSelectionChange(genre.name)}
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
                                            onSearch={handleMovieSearch}
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
                                                                onClick={() => handleFavouriteMovieSelect(movie)}
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
                                                        key={movie.movieId}
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
                                                            onClick={() => handleFavouriteMovieRemove(movie.movieId)}
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
                                <button
                                    type="button"
                                    onClick={handleEditProfileCancel}
                                    className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex h-10 items-center justify-center rounded-md bg-violet-700 px-4 text-sm font-medium text-white shadow-sm hover:bg-violet-800 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-violet-950"
                                >
                                    Save Profile
                                </button>
                            </div>
                        </form>
                    </section>
                )
            }
            
        </div>
    );
}
