import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import type { ProfileData } from "../types/profileData";
import defaultImage from "../assets/default.jpg";
import { useAuth } from "../auth/AuthContext";
import EditProfileForm from "../components/profile/EditProfileForm";
import ProfileDetails from "../components/profile/ProfileDetails";
import ProfileHeader from "../components/profile/ProfileHeader";

const API_BASE_URL = "http://localhost:5203";

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

type FollowStatusResponse = {
    isFollowing: boolean;
};

type UpdateProfileRequest = {
    firstName?: string;
    lastName?: string;
    bio?: string | null;
    profilePictureUrl?: string | null;
    genres?: string[];
    fourFavouriteMovies?: {
        movieId?: number;
        externalMovieId?: string;
    }[];
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

type GenreApiResponse = GenreOption | string;

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
): FavouriteMovieFormData {
    return {
        externalMovieId: movieSearchResult.externalMovieId,
        title: movieSearchResult.title,
        posterUrl: movieSearchResult.posterUrl || defaultImage,
    };
}

function getFavouriteMovieIdentifier(movie: FavouriteMovieFormData) {
    return movie.movieId?.toString() ?? movie.externalMovieId ?? movie.title;
}

function areStringArraysEqual(firstArray: string[], secondArray: string[]) {
    return (
        firstArray.length === secondArray.length &&
        firstArray.every((value, index) => value === secondArray[index])
    );
}

function areFavouriteMoviesEqual(
    firstMovies: FavouriteMovieFormData[],
    secondMovies: FavouriteMovieFormData[]
) {
    return (
        firstMovies.length === secondMovies.length &&
        firstMovies.every(
            (movie, index) =>
                getFavouriteMovieIdentifier(movie) ===
                getFavouriteMovieIdentifier(secondMovies[index])
        )
    );
}


export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    // Username represents the profile being viewed, not the logged in user!
    const { username } = useParams();

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [profileError, setProfileError] = useState("");
    const [genreOptions, setGenreOptions] = useState<GenreOption[]>([]);
    const [genreOptionsError, setGenreOptionsError] = useState("");
    const [movieSearchResults, setMovieSearchResults] = useState<MovieSearchResult[]>([]);
    const [movieSearchError, setMovieSearchError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

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
    const isOwnProfile = user?.username.toLowerCase() === username?.toLowerCase();

    // Use effect to fetch genre options when the component mounts
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/genre`, {
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
                setGenreOptionsError("Genres could not be loaded.");
            });
    }, []);

    // Use effect to fetch profile data when the component mounts or when the username changes
    useEffect(() => {
        if (!username) {
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
                setProfileError("Profile data could not be loaded.");
            })
        
        
    }, [navigate, username]);

    // Use effect to fetch follow status when the component mounts or when the username changes
    useEffect(() => {
        if (!username || isOwnProfile) {
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
    }, [isOwnProfile, navigate, username]);

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
            fourFavouriteMovies: profile.fourFavouriteMovies.map((movie) => ({
                movieId: movie.movieId,
                title: movie.title,
                posterUrl: movie.posterUrl,
            })),
        };
    }

    function handleEditProfileToggle() {
        if (!profileData) {
            return;
        }

        setEditFormData(getEditableProfileFormData(profileData));
        setSubmitError("");
        setIsEditing(true);
    }

    function handleEditProfileCancel() {
        if (profileData) {
            setEditFormData(getEditableProfileFormData(profileData));
        }

        setIsEditing(false);
        setSubmitError("");
        setMovieSearchResults([]);
        setMovieSearchError("");
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
                setMovieSearchError("Movies could not be loaded.");
            });
    }

    function handleFavouriteMovieSelect(movieSearchResult: MovieSearchResult) {
        setMovieSearchError("");

        setEditFormData((currentFormData) => {
            const isAlreadySelected = currentFormData.fourFavouriteMovies.some(
                (movie) => movie.externalMovieId === movieSearchResult.externalMovieId
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

    function handleFavouriteMovieRemove(movieToRemove: FavouriteMovieFormData) {
        setMovieSearchError("");
        setEditFormData((currentFormData) => ({
            ...currentFormData,
            fourFavouriteMovies: currentFormData.fourFavouriteMovies.filter(
                (movie) =>
                    getFavouriteMovieIdentifier(movie) !==
                    getFavouriteMovieIdentifier(movieToRemove)
            ),
        }));
    }

    async function handleEditProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitError("");

        if (!username || !profileData || isSubmittingProfile) {
            return;
        }

        const initialFormData = getEditableProfileFormData(profileData);
        const nextFirstName = editFormData.firstName.trim();
        const nextLastName = editFormData.lastName.trim();
        const nextBio = editFormData.bio.trim() || null;
        const nextProfilePictureUrl = editFormData.profilePicturePreviewUrl || null;
        const profileUpdateRequest: UpdateProfileRequest = {};

        if (nextFirstName !== profileData.firstName) {
            profileUpdateRequest.firstName = nextFirstName;
        }

        if (nextLastName !== profileData.lastName) {
            profileUpdateRequest.lastName = nextLastName;
        }

        if (nextBio !== profileData.bio) {
            profileUpdateRequest.bio = nextBio;
        }

        if (nextProfilePictureUrl !== profileData.profilePictureUrl) {
            profileUpdateRequest.profilePictureUrl = nextProfilePictureUrl;
        }

        if (!areStringArraysEqual(editFormData.genres, initialFormData.genres)) {
            profileUpdateRequest.genres = editFormData.genres;
        }

        if (
            !areFavouriteMoviesEqual(
                editFormData.fourFavouriteMovies,
                initialFormData.fourFavouriteMovies
            )
        ) {
            profileUpdateRequest.fourFavouriteMovies = editFormData.fourFavouriteMovies.map(
                (movie) => ({
                    movieId: movie.movieId,
                    externalMovieId: movie.externalMovieId,
                })
            );
        }

        if (Object.keys(profileUpdateRequest).length === 0) {
            setIsEditing(false);
            setMovieSearchResults([]);
            setMovieSearchError("");
            return;
        }

        setIsSubmittingProfile(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/user/profile/me`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(profileUpdateRequest),
                }
            );

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`Profile update failed with status ${response.status}`);
            }

            const updatedProfile = (await response.json()) as ProfileData;
            setProfileData(updatedProfile);
            setIsEditing(false);
            setMovieSearchResults([]);
            setMovieSearchError("");
        } catch (error) {
            console.error("Error updating profile:", error);
            setSubmitError("Profile could not be saved.");
        } finally {
            setIsSubmittingProfile(false);
        }
    }

    if (!username) {
        return <div>Profile username was not provided.</div>;
    }

    if (!profileData) {
        return <div>{profileError || "Loading..."}</div>;
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6 sm:py-8">
            <ProfileHeader
                profile={profileData}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                isFollowStatusLoading={isFollowStatusLoading}
                followError={followError}
                onEditProfile={handleEditProfileToggle}
                onFollowToggle={handleFollowToggle}
            />

            {!isEditing && <ProfileDetails profile={profileData} />}

            {isOwnProfile && isEditing && (
                <EditProfileForm
                    editFormData={editFormData}
                    genreOptions={genreOptions}
                    genreOptionsError={genreOptionsError}
                    movieSearchResults={movieSearchResults}
                    movieSearchError={movieSearchError}
                    submitError={submitError}
                    isSubmittingProfile={isSubmittingProfile}
                    onSubmit={handleEditProfileSubmit}
                    onCancel={handleEditProfileCancel}
                    onInputChange={handleEditProfileInputChange}
                    onProfilePictureChange={handleProfilePictureChange}
                    onGenreSelectionChange={handleGenreSelectionChange}
                    onMovieSearch={handleMovieSearch}
                    onFavouriteMovieSelect={handleFavouriteMovieSelect}
                    onFavouriteMovieRemove={handleFavouriteMovieRemove}
                />
            )}
            
        </div>
    );
}
