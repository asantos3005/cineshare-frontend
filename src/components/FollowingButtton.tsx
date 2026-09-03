
type FollowingButtonProps = {
  isFollowing: boolean;
  isLoading?: boolean;
  onClick: () => void;
};

export default function FollowingButton({ isFollowing, isLoading = false, onClick }: FollowingButtonProps) {
  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={onClick}
      className={`flex h-8 items-center justify-center gap-2 rounded-none border border-neutral-950 bg-white px-3 text-sm leading-none whitespace-nowrap font-normal text-neutral-950 select-none hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 disabled:border-neutral-500 disabled:text-neutral-500 disabled:opacity-70`}
    >
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
