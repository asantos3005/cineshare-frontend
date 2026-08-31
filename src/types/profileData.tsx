export type ProfileData = {
    firstName: string;
    lastName: string;
    username: string;
    profilePictureUrl: string | null;
    bio: string | null;

    stats: {
        reviewCount: number;
        movieCount: number;
        followerCount: number;
        followingCount: number;
    };

    genres: string[];

    recentlyWatched: {
        title: string;
        posterUrl: string;
    }[];
};