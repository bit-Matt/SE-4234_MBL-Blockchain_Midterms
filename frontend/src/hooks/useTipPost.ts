import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import tipPostAbi from "../abi/TipPost.json";
import type { Post, TransactionStatus } from "../types/tippost";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const defaultStatus: TransactionStatus = { kind: "idle", message: "" };

const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? "11155111");
const CONTRACT_ADDRESS = String(import.meta.env.VITE_CONTRACT_ADDRESS ?? "");
const SEPOLIA_CHAIN_HEX = "0xaa36a7";

export function useTipPost() {
  const [account, setAccount] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<TransactionStatus>(defaultStatus);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [earnedEth, setEarnedEth] = useState<string>("0.0");

  const provider = useMemo(() => {
    if (!window.ethereum) return null;
    return new BrowserProvider(window.ethereum);
  }, []);

  const getReadContract = useCallback(async () => {
    if (!provider || !CONTRACT_ADDRESS) return null;
    return new Contract(CONTRACT_ADDRESS, tipPostAbi, provider);
  }, [provider]);

  const getWriteContract = useCallback(async () => {
    if (!provider || !CONTRACT_ADDRESS) return null;
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, tipPostAbi, signer);
  }, [provider]);

  const checkNetwork = useCallback(async () => {
    if (!provider) return false;
    const network = await provider.getNetwork();
    const ok = Number(network.chainId) === CHAIN_ID;
    setIsCorrectNetwork(ok);
    return ok;
  }, [provider]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setStatus({ kind: "error", message: "MetaMask not detected." });
      return;
    }

    try {
      setStatus({ kind: "loading", message: "Connecting wallet..." });
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      const selected = accounts[0] ?? "";
      setAccount(selected);
      await checkNetwork();
      setStatus({ kind: "success", message: "Wallet connected." });
    } catch (error) {
      setStatus({ kind: "error", message: parseError(error) });
    }
  }, [checkNetwork]);

  const disconnectWallet = useCallback(() => {
    setAccount("");
    setPosts([]);
    setEarnedEth("0.0");
    setIsCorrectNetwork(false);
    setStatus({ kind: "success", message: "Wallet disconnected." });
  }, []);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) {
      setStatus({ kind: "error", message: "MetaMask not detected." });
      return false;
    }

    try {
      setStatus({ kind: "loading", message: "Requesting network switch..." });
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_HEX }],
      });
    } catch (error) {
      const maybeError = error as { code?: number; message?: string };
      if (maybeError.code !== 4902) {
        setStatus({ kind: "error", message: parseError(error) });
        return false;
      }

      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_HEX,
              chainName: "Sepolia",
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } catch (addError) {
        setStatus({ kind: "error", message: parseError(addError) });
        return false;
      }
    }

    const ok = await checkNetwork();
    if (ok) {
      setStatus({ kind: "success", message: "Switched to Sepolia." });
      return true;
    }

    setStatus({ kind: "error", message: "Network switch not completed." });
    return false;
  }, [checkNetwork]);

  const loadFeed = useCallback(async () => {
    if (!account) return;
    const contract = await getReadContract();
    if (!contract) return;

    try {
      setIsLoadingFeed(true);
      const data = (await contract.getAllPosts()) as Array<{
        id: bigint;
        creator: string;
        imageUrl: string;
        caption: string;
        likes: bigint;
        totalEarned: bigint;
        timestamp: bigint;
      }>;

      const withLikeState = await Promise.all(
        data.map(async (item) => {
          const { id, creator, imageUrl, caption, likes, totalEarned, timestamp } =
            item;
          const liked = (await contract.checkLiked(id, account)) as boolean;

          return {
            id,
            creator,
            imageUrl,
            caption,
            likes,
            totalEarned,
            timestamp,
            hasLiked: liked,
          };
        })
      );

      const sorted = withLikeState.sort((a, b) => Number(b.id - a.id));
      setPosts(sorted);
    } catch (error) {
      setStatus({ kind: "error", message: parseError(error) });
    } finally {
      setIsLoadingFeed(false);
    }
  }, [account, getReadContract]);

  const loadEarnings = useCallback(async () => {
    if (!account) return;
    const contract = await getReadContract();
    if (!contract) return;

    const earned = (await contract.totalEarnedByUser(account)) as bigint;
    setEarnedEth(Number(formatEther(earned)).toFixed(4));
  }, [account, getReadContract]);

  const createPost = useCallback(
    async (imageUrl: string, caption: string) => {
      const ready = await checkNetwork();
      if (!ready) {
        setStatus({ kind: "error", message: "Switch MetaMask to Sepolia." });
        return false;
      }

      const contract = await getWriteContract();
      if (!contract) return false;

      try {
        setStatus({ kind: "loading", message: "Creating post..." });
        const tx = await contract.createPost(imageUrl, caption);
        await tx.wait();
        setStatus({ kind: "success", message: "Post created." });
        return true;
      } catch (error) {
        setStatus({ kind: "error", message: parseError(error) });
        return false;
      }
    },
    [checkNetwork, getWriteContract]
  );

  const likePost = useCallback(
    async (postId: bigint) => {
      const ready = await checkNetwork();
      if (!ready) {
        setStatus({ kind: "error", message: "Switch MetaMask to Sepolia." });
        return;
      }

      const contract = await getWriteContract();
      if (!contract) return;

      try {
        setStatus({ kind: "loading", message: "Submitting tip..." });
        const tx = await contract.likePost(postId, {
          value: parseEther("0.0001"),
        });
        await tx.wait();
        setStatus({ kind: "success", message: "Tip sent." });
      } catch (error) {
        setStatus({ kind: "error", message: parseError(error) });
      }
    },
    [checkNetwork, getWriteContract]
  );

  useEffect(() => {
    if (!provider || !window.ethereum) return;

    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        const list = accounts as string[];
        if (list[0]) setAccount(list[0]);
      })
      .catch(() => {
        setAccount("");
      });
  }, [provider]);

  useEffect(() => {
    if (!account || !provider) return;
    checkNetwork().catch(() => undefined);
    loadFeed().catch(() => undefined);
    loadEarnings().catch(() => undefined);
  }, [account, provider, checkNetwork, loadFeed, loadEarnings]);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | null = null;

    async function setupEvents() {
      const contract = await getReadContract();
      if (!contract || !mounted) return;

      const refresh = () => {
        loadFeed().catch(() => undefined);
        loadEarnings().catch(() => undefined);
      };

      contract.on("PostCreated", refresh);
      contract.on("PostLiked", refresh);
      unsubscribe = () => {
        contract.off("PostCreated", refresh);
        contract.off("PostLiked", refresh);
      };
    }

    setupEvents().catch(() => undefined);

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [getReadContract, loadFeed, loadEarnings]);

  return {
    account,
    posts,
    status,
    earnedEth,
    isLoadingFeed,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    createPost,
    likePost,
    switchToSepolia,
    reload: loadFeed,
  };
}

function parseError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 4001
  ) {
    return "Transaction request rejected in MetaMask.";
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Transaction failed. Check wallet and network.";
}
