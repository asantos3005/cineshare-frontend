import { Link } from "react-router";

type AppLinkButtonProps = {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export default function AppLinkButton({ to, children, variant = "primary" }: AppLinkButtonProps) {
  return (
    <Link to={to} className="bg-fuchsia-300 hover:bg-fuchsia-400 text-white py-2 px-4 rounded max-w-2xs text-center">
      {children}
    </Link>
  );
}