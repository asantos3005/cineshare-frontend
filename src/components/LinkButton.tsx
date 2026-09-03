import { Link } from "react-router";

type AppLinkButtonProps = {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export default function AppLinkButton({ to, children, variant = "primary" }: AppLinkButtonProps) {
  const variantClasses = {
    primary: "border-violet-700 bg-violet-700 text-white hover:not-data-disabled:bg-violet-800",
    secondary: "border-neutral-950 bg-white text-neutral-950 hover:not-data-disabled:bg-neutral-100",
    ghost: "border-transparent bg-transparent text-neutral-950 hover:not-data-disabled:bg-neutral-100",
  };

  return (
    <Link to={to} className={`flex h-8 items-center justify-center gap-2 rounded-none border px-3 text-sm leading-none whitespace-nowrap font-normal select-none active:not-data-disabled:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 data-disabled:border-neutral-500 data-disabled:text-neutral-500 disabled:border-neutral-500 disabled:text-neutral-500 ${variantClasses[variant]}`}>
      {children}
    </Link>
  );
}
