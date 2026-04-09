export type Post = {
  id: bigint;
  creator: string;
  imageUrl: string;
  caption: string;
  likes: bigint;
  totalEarned: bigint;
  timestamp: bigint;
  hasLiked: boolean;
};

export type TransactionStatus = {
  kind: "idle" | "loading" | "success" | "error";
  message: string;
};
