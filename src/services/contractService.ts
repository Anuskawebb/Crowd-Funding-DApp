import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = "0xa3084a363607bb07da333f14f82dcb189561a97c";

// Updated CONTRACT_ABI based on your Solidity contract
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "campaignCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "campaigns", // This is the automatically generated getter for the public mapping
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "imageURL", "type": "string" },
      { "internalType": "address payable", "name": "owner", "type": "address" },
      { "internalType": "uint256", "name": "target", "type": "uint256" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" },
      { "internalType": "uint256", "name": "amountCollected", "type": "uint256" },
      { "internalType": "bool", "name": "withdrawn", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "string", "name": "_imageURL", "type": "string" },
      { "internalType": "uint256", "name": "_target", "type": "uint256" },
      { "internalType": "uint256", "name": "_deadlineTimestamp", "type": "uint256" }
    ],
    "name": "createCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "donations",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformFees",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawPlatformFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ** NEW: Adding getCampaigns if you add it to your contract (recommended approach) **
  // If you add a function like this to your Solidity contract:
  /*
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        for (uint i = 0; i < campaignCount; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }
  */
  // Then the ABI entry would be:
  {
    "inputs": [],
    "name": "getCampaigns",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string", "name": "imageURL", "type": "string" },
          { "internalType": "address payable", "name": "owner", "type": "address" },
          { "internalType": "uint256", "name": "target", "type": "uint256" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "uint256", "name": "amountCollected", "type": "uint256" },
          { "internalType": "bool", "name": "withdrawn", "type": "bool" }
        ],
        "internalType": "struct CrowdFunding.Campaign[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export class ContractService {
  private contract: ethers.Contract | null = null;

  constructor(signer?: ethers.Signer) {
    if (signer) {
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }
  }

  async createCampaign(
    name: string,
    description: string,
    imageUrl: string,
    targetAmount: string,
    deadline: number // deadline is already a unix timestamp in your contract
  ) {
    if (!this.contract) throw new Error('Contract not initialized');

    const targetAmountWei = ethers.parseEther(targetAmount);
    const tx = await this.contract.createCampaign(
      name,
      description,
      imageUrl,
      targetAmountWei,
      deadline
    );

    return await tx.wait();
  }

  async donate(campaignId: string, amount: string) {
    if (!this.contract) throw new Error('Contract not initialized');

    const amountWei = ethers.parseEther(amount);
    // campaignId is a string, but Solidity expects uint. Convert to Number.
    const tx = await this.contract.donate(Number(campaignId), { value: amountWei });

    return await tx.wait();
  }

  async withdraw(campaignId: string) {
    if (!this.contract) throw new Error('Contract not initialized');

    // campaignId is a string, but Solidity expects uint. Convert to Number.
    const tx = await this.contract.withdraw(Number(campaignId));
    return await tx.wait();
  }

  async withdrawPlatformFees() {
    if (!this.contract) throw new Error('Contract not initialized');

    const tx = await this.contract.withdrawPlatformFees();
    return await tx.wait();
  }

  // --- Campaign Retrieval Methods ---

  // Fetches a single campaign using the automatically generated getter for the 'campaigns' mapping
  async getCampaign(campaignId: string) {
    if (!this.contract) throw new Error('Contract not initialized');

    // campaignId is a string, but Solidity expects uint. Convert to Number.
    const campaignData = await this.contract.campaigns(Number(campaignId));

    // The returned data will be an array-like object from ethers.js, convert to a more usable object
    return {
        name: campaignData[0],
        description: campaignData[1],
        imageURL: campaignData[2],
        owner: campaignData[3],
        target: campaignData[4],
        deadline: campaignData[5],
        amountCollected: campaignData[6],
        withdrawn: campaignData[7],
    };
  }

  // Option 1: If you add getCampaigns() to your Solidity contract (recommended)
  // Example Solidity function to add:
  /*
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        for (uint i = 0; i < campaignCount; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }
  */
  async getCampaigns() {
    if (!this.contract) throw new Error('Contract not initialized');

    const campaignsData = await this.contract.getCampaigns();
    // Ethers.js returns a tuple for structs, often needing to be converted to a more readable object
    // You might need a helper function here to map array-like returns to structured objects
    return campaignsData.map((campaign: any) => ({
      name: campaign.name,
      description: campaign.description,
      imageURL: campaign.imageURL,
      owner: campaign.owner,
      target: campaign.target,
      deadline: campaign.deadline,
      amountCollected: campaign.amountCollected,
      withdrawn: campaign.withdrawn,
    }));
  }


  // Optional: Get total campaign count
  async getCampaignCount(): Promise<number> {
    if (!this.contract) throw new Error('Contract not initialized');
    const count = await this.contract.campaignCount();
    return Number(count); // Convert BigNumber/BigInt to number
  }

  // Optional: Get platform fees
  async getPlatformFees(): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    const fees = await this.contract.platformFees();
    return ethers.formatEther(fees); // Format from Wei to Ether
  }

  // Optional: Get admin address
  async getAdminAddress(): Promise<string> {
    if (!this.contract) throw new Error('Contract not initialized');
    return await this.contract.admin();
  }
}