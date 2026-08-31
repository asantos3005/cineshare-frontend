import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function ProfileCircle() {
    const { user } = useAuth();
    const fallbackInitial = user?.username.charAt(0).toUpperCase() ?? "U";

    return (
        <Link
            to="/profile"
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-300 text-sm font-bold text-white sm:h-12 sm:w-12"
            aria-label="View profile"
        >
            {user?.profileURL ? (
                <img
                    src={user.profileURL}
                    alt={`${user.username}'s profile`}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span>{fallbackInitial}</span>
            )}
        </Link>
    );
}
