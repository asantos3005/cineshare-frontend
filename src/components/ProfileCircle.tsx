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
            className="h-10 w-10 rounded-full object-cover"
            />
        </Link>
    );
}
