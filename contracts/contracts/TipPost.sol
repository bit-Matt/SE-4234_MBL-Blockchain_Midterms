// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipPost {
    struct Post {
        uint256 id;
        address creator;
        string imageUrl;
        string caption;
        uint256 likes;
        uint256 totalEarned;
        uint256 timestamp;
    }

    uint256 public postCount;
    uint256 public constant likeCost = 0.0001 ether;

    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => uint256) public totalEarnedByUser;

    event PostCreated(
        uint256 indexed id,
        address indexed creator,
        string imageUrl,
        string caption,
        uint256 timestamp
    );
    event PostLiked(
        uint256 indexed id,
        address indexed liker,
        address indexed creator,
        uint256 amount
    );

    function createPost(string memory imageUrl, string memory caption) external {
        require(bytes(imageUrl).length > 0, "Image URL required");
        require(bytes(caption).length > 0, "Caption required");

        postCount++;

        posts[postCount] = Post({
            id: postCount,
            creator: msg.sender,
            imageUrl: imageUrl,
            caption: caption,
            likes: 0,
            totalEarned: 0,
            timestamp: block.timestamp
        });

        emit PostCreated(postCount, msg.sender, imageUrl, caption, block.timestamp);
    }

    function likePost(uint256 postId) external payable {
        require(postId > 0 && postId <= postCount, "Post does not exist");
        require(msg.value >= likeCost, "Insufficient ETH sent");

        Post storage post = posts[postId];

        require(msg.sender != post.creator, "Cannot like own post");
        require(!hasLiked[postId][msg.sender], "Already liked");

        hasLiked[postId][msg.sender] = true;
        post.likes += 1;
        post.totalEarned += msg.value;
        totalEarnedByUser[post.creator] += msg.value;

        (bool success, ) = payable(post.creator).call{value: msg.value}("");
        require(success, "ETH transfer failed");

        emit PostLiked(postId, msg.sender, post.creator, msg.value);
    }

    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);

        for (uint256 i = 0; i < postCount; i++) {
            allPosts[i] = posts[i + 1];
        }

        return allPosts;
    }

    function checkLiked(uint256 postId, address user) external view returns (bool) {
        require(postId > 0 && postId <= postCount, "Post does not exist");
        return hasLiked[postId][user];
    }
}
