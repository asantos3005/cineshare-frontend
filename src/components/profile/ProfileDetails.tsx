import type { ProfileData } from "../../types/profileData";
import GenreBadge from "../GenreBadge";

type ProfileDetailsProps = {
    profile: ProfileData;
};

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
    return (
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-section-title">About Me</h2>
                    <p className="text-body max-w-2xl">{profile.bio}</p>
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-section-title">Favorite Genres</h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.genres.map((genre) => (
                            <GenreBadge key={genre} genre={genre} />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-section-title">Top 4 Favourite Movies</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                        {profile.fourFavouriteMovies.map((movie) => (
                            <article key={movie.title} className="flex flex-col gap-2">
                                <img
                                    src={movie.posterUrl}
                                    alt={`${movie.title} poster`}
                                    className="aspect-[2/3] w-full rounded-lg object-cover shadow-sm"
                                />
                                <h3 className="line-clamp-2 text-sm font-semibold text-neutral-950">
                                    {movie.title}
                                </h3>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
