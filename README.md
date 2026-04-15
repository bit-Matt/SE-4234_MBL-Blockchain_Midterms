# TipPost Midterms Project

This project contains a Sepolia-ready `TipPost` smart contract and a React + Vite frontend scaffold for the midterms dApp assignment.

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

## Required Runtime Behavior Checklist

- [ ] Connect wallet button works
- [ ] Wrong-network warning appears when not on Sepolia
- [ ] Create post writes on-chain
- [ ] Feed displays image, caption, creator, likes, earned ETH
- [ ] Like sends `0.0001 ETH`
- [ ] Already-liked post shows heart state
- [ ] Self-like disabled/blocked
- [ ] Earnings display updates for connected user
- [ ] Transaction status shows loading/success/error
- [ ] Feed refreshes on `PostCreated` and `PostLiked` events

## Submission Checklist (Rubric-Mapped)

- [ ] Public GitHub repository URL
- [ ] Live frontend URL (Vercel/Netlify)
- [ ] Sepolia contract address
- [ ] Screenshots or screen recording showing:
  - [ ] MetaMask connected on Sepolia at live URL
  - [ ] Post created and visible
  - [ ] Like transaction confirmed (`0.0001 ETH`)
  - [ ] Like count + earnings updated
  - [ ] Double-like blocked with error
- [ ] `npx hardhat test` passing screenshot
- [ ] README contains setup + deployed links

## Screenshots / Evidence (Fill This Section)

Replace each `TODO_URL_*` with your hosted image link (GitHub issue upload, Imgur, Cloudinary, etc.).

### 1) Live dApp + MetaMask on Sepolia

![Live dApp with MetaMask connected]
Link: https://se-4234-mbl-blockchain-midterms-two.vercel.app/


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

## Faucets

- <https://cloud.google.com/application/web3/faucet/ethereum/sepolia>
- <https://sepoliafaucet.com/>
- <https://www.infura.io/faucet/sepolia>

## Final Values To Fill Before Submission

- GitHub repo URL: `TODO`
- Contract address: `TODO`
- Etherscan link: `TODO`
- Live frontend URL: `TODO`
