# TipPost Midterms Project

This project contains a Sepolia-ready `TipPost` smart contract and a React + Vite frontend scaffold for the midterms dApp assignment.

## Quick Links (Fill Before Submission)

- Deployed contract on Sepolia: `TODO_CONTRACT_ADDRESS`
- Etherscan link: `TODO_ETHERSCAN_URL`
- Live frontend URL: <https://se-4234-mbl-blockchain-midterms-two.vercel.app/>

## Project Structure

- `contracts/` - Hardhat TypeScript project (`TipPost.sol`, tests, deploy script)
- `frontend/` - React + Vite + TypeScript dApp UI with ethers v6

## Prerequisites

- Node.js 18+ (LTS recommended)
- MetaMask browser wallet
- Sepolia ETH from faucet

## Part A - Contract Setup and Testing

### 1) Install dependencies

```bash
cd contracts
npm install
```

### 2) Run tests

```bash
npx hardhat test
```

Current scaffold includes required tests:
- post creation + event emission
- successful like + ETH transfer
- rejected double-like
- rejected self-like

### 3) Configure deployment secrets

Copy `contracts/.env.example` to `contracts/.env` and fill values:

- `SEPOLIA_RPC_URL`
- `PRIVATE_KEY`
- `ETHERSCAN_API_KEY`

Never commit `.env`.

### 4) Deploy to Sepolia

```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

Save deployed contract address and add it to frontend env vars.

### 5) (Bonus) Verify on Etherscan

```bash
npx hardhat verify --network sepolia <YOUR_CONTRACT_ADDRESS>
```

## Part B - Frontend Setup and Deployment

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Configure frontend env

Copy `frontend/.env.example` to `frontend/.env`:

- `VITE_CONTRACT_ADDRESS=<your deployed TipPost address>`
- `VITE_CHAIN_ID=11155111`

### 3) Run locally

```bash
npm run dev
```

Open the app at `http://localhost:5173`, connect MetaMask, and switch to Sepolia.

### 4) Build production bundle

```bash
npm run build
```

### 5) Deploy frontend (Vercel)

- Push repo to GitHub
- Create a new Vercel project
- Set root directory to `Blockchain_Midterms_Project/frontend`
- Add env vars:
  - `VITE_CONTRACT_ADDRESS`
  - `VITE_CHAIN_ID=11155111`
- Deploy and test with MetaMask on Sepolia

## Screenshots / Evidence (Fill This Section)

Replace each `TODO_URL_*` with your hosted image link (GitHub issue upload, Imgur, Cloudinary, etc.).

### 1) Live dApp + MetaMask on Sepolia

Live URL used for demo: <https://se-4234-mbl-blockchain-midterms-two.vercel.app/>

![Live dApp with MetaMask connected](TODO_URL_LIVE_DAPP_METAMASK)


### 2) Post Created and Visible in Feed

![Post created and visible](TODO_URL_POST_CREATED)

### 3) Like Transaction Confirmed (0.0001 ETH)

![Like transaction confirmed](TODO_URL_LIKE_TX_CONFIRMED)

### 4) Like Count and Earnings Updated

![Like count and earnings updated](TODO_URL_LIKES_EARNINGS_UPDATED)

### 5) Double-Like Blocked with Error

![Double-like blocked error](TODO_URL_DOUBLE_LIKE_BLOCKED)

### 6) Hardhat Tests Passing

![Hardhat tests passing](TODO_URL_HARDHAT_TESTS_PASSING)

## How to Get Sepolia ETH (Faucets)

You need Sepolia ETH to deploy and test transactions (`createPost`, `likePost`).

1. Open one of the faucet links below.
2. Connect your wallet or paste your Sepolia wallet address.
3. Request test ETH and wait for confirmation.
4. In MetaMask, ensure the network is set to Sepolia and verify the balance arrived.

- <https://cloud.google.com/application/web3/faucet/ethereum/sepolia>
- <https://sepoliafaucet.com/>
- <https://www.infura.io/faucet/sepolia>

## Final Values To Fill Before Submission

- GitHub repo URL: `TODO`
- Contract address: `TODO_CONTRACT_ADDRESS`
- Etherscan link: `TODO_ETHERSCAN_URL`
- Live frontend URL: <https://se-4234-mbl-blockchain-midterms-two.vercel.app/>
