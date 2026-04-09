import { formatEther } from "ethers";
import type { Post } from "../types/tippost";

type Props = {
  post: Post;
  account: string;
  onLike: (id: bigint) => Promise<void>;
  disabled: boolean;
};

const FALLBACK_IMAGE = "https://picsum.photos/seed/tippost/600/400";

export function PostCard({ post, account, onLike, disabled }: Props) {
  const isOwnPost = account.toLowerCase() === post.creator.toLowerCase();
  const liked = post.hasLiked;
  const canLike = !isOwnPost && !liked && !disabled;

  return (
    <article className="card post">
      <img
        src={post.imageUrl}
        alt={post.caption}
        onError={(event) => {
          const target = event.currentTarget;
          target.src = FALLBACK_IMAGE;
        }}
      />
      <div className="post-body">
        <p className="caption">{post.caption}</p>
        <p className="meta">Creator: {shorten(post.creator)}</p>
        <p className="meta">Likes: {post.likes.toString()}</p>
        <p className="meta">Earned: {formatEther(post.totalEarned)} ETH</p>
      </div>
      <button onClick={() => onLike(post.id)} disabled={!canLike}>
        {liked ? "❤️ Liked" : isOwnPost ? "Your post" : "Tip 0.0001 ETH"}
      </button>
    </article>
  );
}

function shorten(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
