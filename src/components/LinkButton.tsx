import { Link } from "react-router";

type AppLinkButtonProps = {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export default function AppLinkButton({ to, children, variant = "primary" }: AppLinkButtonProps) {
  const variantClasses = {
    primary: "bg-violet-700 text-white hover:bg-violet-800",
    secondary: "border border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-50",
    ghost: "text-neutral-700 hover:bg-neutral-100",
  };

  return (
    <Link to={to} className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium shadow-sm focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 ${variantClasses[variant]}`}>
      {children}
    </Link>
  );
}
