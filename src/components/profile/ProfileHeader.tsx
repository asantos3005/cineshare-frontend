import defaultImage from "../../assets/default.jpg";
import type { ProfileData } from "../../types/profileData";
import FollowingButton from "../FollowingButtton";

type ProfileHeaderProps = {
    profile: ProfileData;
    isOwnProfile: boolean;
    isFollowing: boolean;
    isFollowStatusLoading: boolean;
    followError: string;
    onEditProfile: () => void;
    onFollowToggle: () => void;
};

export default function ProfileHeader({
    profile,
    isOwnProfile,
    isFollowing,
    isFollowStatusLoading,
    followError,
    onEditProfile,
    onFollowToggle,
}: ProfileHeaderProps) {
    return (
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <img
                        src={profile.profilePictureUrl || defaultImage}
                        alt={`${profile.firstName}'s profile`}
                        className="h-24 w-24 rounded-full object-cover ring-2 ring-neutral-200 sm:h-28 sm:w-28"
                    />
                    <div>
                        <h1 className="page-title inline">{profile.firstName}</h1>
                        <h1 className="page-title inline"> {profile.lastName}</h1>
                        <p className="page-title-subheading">{profile.username}</p>
                    </div>
                </div>

                {isOwnProfile && (
                    <button
                        type="button"
                        className="inline-flex h-10 items-center justify-center self-start rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950"
                        onClick={onEditProfile}
                    >
                        Edit Profile
                    </button>
                )}
                {!isOwnProfile && (
                    <div className="flex flex-col items-start gap-2">
                        <FollowingButton
                            isFollowing={isFollowing}
                            isLoading={isFollowStatusLoading}
                            onClick={onFollowToggle}
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
                    <dd className="text-2xl font-semibold text-neutral-950">
                        {profile.stats.reviewCount}
                    </dd>
                </div>
                <div className="text-center">
                    <dt className="text-sm text-gray-600">Movies</dt>
                    <dd className="text-2xl font-semibold text-neutral-950">
                        {profile.stats.movieCount}
                    </dd>
                </div>
                <div className="text-center">
                    <dt className="text-sm text-gray-600">Followers</dt>
                    <dd className="text-2xl font-semibold text-neutral-950">
                        {profile.stats.followerCount}
                    </dd>
                </div>
                <div className="text-center">
                    <dt className="text-sm text-gray-600">Following</dt>
                    <dd className="text-2xl font-semibold text-neutral-950">
                        {profile.stats.followingCount}
                    </dd>
                </div>
            </dl>
        </section>
    );
}
