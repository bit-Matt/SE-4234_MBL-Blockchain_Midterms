# TipPost Midterms Project

This project contains a Sepolia-ready `TipPost` smart contract and a React + Vite frontend scaffold for the midterms dApp assignment.

## Quick Links

- Deployed contract on Sepolia: `0x03a9f12f68c0d995201CE2d14A9f33585569C564`
- Etherscan link: <https://sepolia.etherscan.io/address/0x03a9f12f68c0d995201CE2d14A9f33585569C564#code>
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

## Screenshots / Evidence

### 1) Live dApp + MetaMask on Sepolia

Live URL used for demo: <https://se-4234-mbl-blockchain-midterms-two.vercel.app/>

<img width="1918" height="982" alt="Deployed Site Screenshot" src="https://github.com/user-attachments/assets/919a196b-1a07-4b0c-8292-8036e7d6b0cb" />


### 2) Post Created and Visible in Feed

<img width="657" height="405" alt="post displayed" src="https://github.com/user-attachments/assets/7c48afdd-2e67-4e05-bc45-b6b547c363da" />


### 3) Like Transaction Confirmed (0.0001 ETH)

<img width="956" height="792" alt="like confirm-1" src="https://github.com/user-attachments/assets/d59a022f-885b-44b0-901c-8473c66c55db" />


### 4) Like Count and Earnings Updated

<img width="1152" height="98" alt="earnings" src="https://github.com/user-attachments/assets/a0864469-fee5-454c-b3d3-b1a8cbdcc9f3" />
<img width="339" height="405" alt="likes" src="https://github.com/user-attachments/assets/d7146ecd-0a98-4ef5-ac84-f3862a305d2d" />


### 5) Double-Like Blocked with Error

<img width="798" height="502" alt="double-like block" src="https://github.com/user-attachments/assets/3dd6332a-318d-4834-8af7-ef211b48a366" />


### 6) Hardhat Tests Passing

<img width="1202" height="301" alt="hardhat run passed" src="https://github.com/user-attachments/assets/c343d972-8175-4528-b127-a980ac8be38f" />


## How to Get Sepolia ETH (Faucets)

You need Sepolia ETH to deploy and test transactions (`createPost`, `likePost`).

1. Open one of the faucet links below.
2. Connect your wallet or paste your Sepolia wallet address.
3. Request test ETH and wait for confirmation.
4. In MetaMask, ensure the network is set to Sepolia and verify the balance arrived.

- <https://cloud.google.com/application/web3/faucet/ethereum/sepolia>
- <https://sepoliafaucet.com/>
- <https://www.infura.io/faucet/sepolia>
