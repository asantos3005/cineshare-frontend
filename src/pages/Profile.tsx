const profile = {
    firstName: "Alex",
    lastName: "Johnson",
    username: "@alexjohnson",
    profilePictureUrl: "https://i.pravatar.cc/160?img=12",
    bio: "Movie lover, coffee enthusiast, and always looking for new recommendations.",
    stats: [
        { label: "Reviews", value: 32 },
        { label: "Movies", value: 18 },
        { label: "Followers", value: 124 },
        { label: "Following", value: 89 },
    ],
    genres: ["Sci-Fi", "Thriller", "Drama", "Action", "Comedy"],
    recentlyWatched: [
        {
            title: "Dune",
            posterUrl: "https://m.media-amazon.com/images/M/MV5BN2QyZDRjMmMtYzA2OS00NjhiLWJjY2EtN2U0ODRhYTNmN2ZiXkEyXkFqcGc@._V1_.jpg",
        },
        {
            title: "Oppenheimer",
            posterUrl: "https://m.media-amazon.com/images/M/MV5BMjQxYWNhMDItZTE0MS00NTM2LWE2NDgtODkxY2E2YjgxMDZkXkEyXkFqcGc@._V1_.jpg",
        },
        {
            title: "Spider-Man: Across the Spider-Verse",
            posterUrl: "https://m.media-amazon.com/images/M/MV5BNTYwODdjZDYtMjYxOS00OGRiLWE5NmUtNjU4NWE3ZGViZDc0XkEyXkFqcGc@._V1_.jpg",
        },
        {
            title: "The Wolf of Wall Street",
            posterUrl: "https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0OV5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_.jpg",
        },
    ],
};

export default function Profile() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-6 sm:py-8">
            <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <img
                            src={profile.profilePictureUrl}
                            alt={`${profile.firstName}'s profile`}
                            className="h-24 w-24 rounded-full object-cover ring-2 ring-neutral-200 sm:h-28 sm:w-28"
                        />
                        <div>
                            <h1 className="page-title inline">{profile.firstName}</h1>
                            <h1 className="page-title inline"> {profile.lastName}</h1>
                            <p className="page-title-subheading">{profile.username}</p>
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
                    {profile.stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <dt className="text-sm text-gray-600">{stat.label}</dt>
                            <dd className="text-2xl font-semibold text-neutral-950">{stat.value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

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
                            {profile.recentlyWatched.map((movie) => (
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
