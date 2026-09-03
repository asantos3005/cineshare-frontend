import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import defaultImage  from "../assets/default.jpg";

export default function ProfileCircle() {
    const { user } = useAuth();

    return (
        <Link
            to={`/profile/${user?.username}`}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-300 text-sm font-bold text-white sm:h-12 sm:w-12"
            aria-label="View profile"
        >
            <img
            src={user?.profileURL || defaultImage}
            alt={`${user?.username}'s profile`}
            className="h-24 w-24 rounded-full object-cover ring-2 ring-neutral-200 sm:h-28 sm:w-28"
            />
        </Link>
    );
}
