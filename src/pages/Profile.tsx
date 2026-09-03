import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { ProfileData } from "../types/profileData";
import defaultImage from "../assets/default.jpg";



export default function Profile() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [profileError, setProfileError] = useState("");

    useEffect(() => {
        fetch('http://localhost:5203/api/user/my-profile', {
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
        
        
    }, [navigate]);

    if (!profileData) {
        return <div>{profileError || "Loading..."}</div>;
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6 sm:py-8">
            <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <img
                            src={profileData.profilePictureUrl ?? defaultImage}
                            alt={`${profileData.firstName}'s profile`}
                            className="h-24 w-24 rounded-full object-cover ring-2 ring-neutral-200 sm:h-28 sm:w-28"
                        />
                        <div>
                            <h1 className="page-title inline">{profileData.firstName}</h1>
                            <h1 className="page-title inline"> {profileData.lastName}</h1>
                            <p className="page-title-subheading">{profileData.username}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center self-start rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                    >
                        Edit Profile
                    </button>
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
                                <span
                                    key={genre}
                                    className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700"
                                >
                                    {genre}
                                </span>
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
        </div>
    );
}
