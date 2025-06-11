// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CrowdFunding {
    struct Campaign {
        string name;
        string description;
        string imageURL;
        address payable owner;
        uint target;
        uint deadline; // now represents a UNIX timestamp
        uint amountCollected;
        bool withdrawn;
    }

    address public admin;
    uint public platformFees;

    uint public campaignCount;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping(address => uint)) public donations;

    constructor() {
        admin = msg.sender;
    }

    function createCampaign(
        string memory _name,
        string memory _description,
        string memory _imageURL,
        uint _target,
        uint _deadlineTimestamp
    ) external {
        require(_target > 0, "Invalid target");
        require(_deadlineTimestamp > block.timestamp +  5 minutes, "Deadline must be in future");

        campaigns[campaignCount] = Campaign({
            name: _name,
            description: _description,
            imageURL: _imageURL,
            owner: payable(msg.sender),
            target: _target,
            deadline: _deadlineTimestamp,
            amountCollected: 0,
            withdrawn: false
        });

        campaignCount++;
    }

    function donate(uint _id) external payable {
        Campaign storage c = campaigns[_id];
        require(c.owner != msg.sender, "Owner cannot donate");
        require(block.timestamp < c.deadline, "Deadline passed");
        require(msg.value > 0, "Zero ETH");

        c.amountCollected += msg.value;
        donations[_id][msg.sender] += msg.value;
    }

    function withdraw(uint _id) external {
        Campaign storage c = campaigns[_id];
        require(msg.sender == c.owner, "Not owner");
        require(!c.withdrawn, "Already withdrawn");
        require(
            block.timestamp >= c.deadline || c.amountCollected >= c.target,
            "Not eligible to withdraw"
        );

        c.withdrawn = true;

        uint fee = (c.amountCollected * 15) / 1000; // 1.5%
        uint payout = c.amountCollected - fee;

        platformFees += fee;
        c.owner.transfer(payout);
    }

    function withdrawPlatformFees() external {
        require(msg.sender == admin, "Only admin");
        uint amount = platformFees;
        platformFees = 0;
        payable(admin).transfer(amount);
    }

    // fallback/receive functions can be added if needed
}