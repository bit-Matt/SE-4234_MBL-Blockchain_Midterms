import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("TipPost", function () {
  async function deployFixture() {
    const [creator, liker, other] = await ethers.getSigners();
    const TipPost = await ethers.getContractFactory("TipPost");
    const tipPost = await TipPost.deploy();
    await tipPost.waitForDeployment();

    return { tipPost, creator, liker, other };
  }

  it("creates a post and emits PostCreated", async function () {
    const { tipPost, creator } = await deployFixture();
    const imageUrl = "https://picsum.photos/600/400";
    const caption = "My first post";

    await expect(tipPost.connect(creator).createPost(imageUrl, caption))
      .to.emit(tipPost, "PostCreated")
      .withArgs(1n, creator.address, imageUrl, caption, anyValue);

    const post = await tipPost.posts(1);
    expect(post.id).to.equal(1n);
    expect(post.creator).to.equal(creator.address);
    expect(post.likes).to.equal(0n);
  });

  it("allows a valid like and transfers ETH to creator", async function () {
    const { tipPost, creator, liker } = await deployFixture();
    await tipPost.connect(creator).createPost("https://img.test/a.png", "hello");

    const likeCost = await tipPost.likeCost();
    const creatorBefore = await ethers.provider.getBalance(creator.address);

    const tx = await tipPost.connect(liker).likePost(1, { value: likeCost });
    await tx.wait();

    const creatorAfter = await ethers.provider.getBalance(creator.address);
    expect(creatorAfter - creatorBefore).to.equal(likeCost);

    const post = await tipPost.posts(1);
    expect(post.likes).to.equal(1n);
    expect(post.totalEarned).to.equal(likeCost);
  });

  it("rejects double-like from same address", async function () {
    const { tipPost, creator, liker } = await deployFixture();
    await tipPost.connect(creator).createPost("https://img.test/a.png", "hello");

    const likeCost = await tipPost.likeCost();
    await tipPost.connect(liker).likePost(1, { value: likeCost });

    await expect(
      tipPost.connect(liker).likePost(1, { value: likeCost })
    ).to.be.revertedWith("Already liked");
  });

  it("rejects self-like", async function () {
    const { tipPost, creator } = await deployFixture();
    await tipPost.connect(creator).createPost("https://img.test/a.png", "hello");

    const likeCost = await tipPost.likeCost();
    await expect(
      tipPost.connect(creator).likePost(1, { value: likeCost })
    ).to.be.revertedWith("Cannot like own post");
  });
});

