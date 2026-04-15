import "./App.css";
import { CreatePostForm } from "./components/CreatePostForm";
import { PostCard } from "./components/PostCard";
import { useTipPost } from "./hooks/useTipPost";

function App() {
  const {
    account,
    posts,
    status,
    earnedEth,
    isLoadingFeed,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    createPost,
    likePost,
  } = useTipPost();

  return (
    <main className="app-shell">
      <header className="top-bar card">
        <div>
          <h1>TipPost dApp</h1>
          <p>Pay-to-like social feed on Sepolia</p>
        </div>
        {account ? (
          <div className="wallet-actions">
            <button onClick={disconnectWallet}>Disconnect</button>
            <button onClick={connectWallet}>{`Connected: ${shorten(account)}`}</button>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>

      {account && !isCorrectNetwork && (
        <section className="card warning">
          Wrong network. Switch MetaMask to Sepolia (chain ID 11155111).
          <div className="switch-network-action">
            <button onClick={switchToSepolia} disabled={status.kind === "loading"}>
              Switch to Sepolia
            </button>
          </div>
        </section>
      )}

      <section className="card status">
        <strong>Status:</strong> {status.message || "Ready"}
      </section>

      <section className="card earnings">
        Your earnings: <strong>{earnedEth} ETH</strong>
      </section>

      <CreatePostForm
        onSubmit={createPost}
        disabled={!account || !isCorrectNetwork || status.kind === "loading"}
      />

      <section className="feed">
        <div className="feed-header">
          <h2>Post feed</h2>
          {isLoadingFeed && <span>Refreshing...</span>}
        </div>

        {posts.length === 0 ? (
          <div className="card">No posts yet. Create the first one.</div>
        ) : (
          <div className="feed-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id.toString()}
                post={post}
                account={account}
                onLike={likePost}
                disabled={!isCorrectNetwork || status.kind === "loading"}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function shorten(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default App;
