import { ethers } from 'ethers';

// Placeholder for contract configuration
// Replace these with your actual contract details
export const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';
export const CONTRACT_ABI = [
  // Add your contract ABI here
  // Example function signatures:
  // "function createCampaign(string memory _name, string memory _description, string memory _imageUrl, uint256 _targetAmount, uint256 _deadline) public",
  // "function donate(uint256 _campaignId) public payable",
  // "function withdraw(uint256 _campaignId) public",
  // "function withdrawPlatformFees() public",
  // "function getCampaigns() public view returns (Campaign[] memory)",
  // "function getCampaign(uint256 _campaignId) public view returns (Campaign memory)"
];

export class ContractService {
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  constructor(signer?: ethers.Signer) {
    if (signer) {
      this.signer = signer;
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }
  }

  // Create a new campaign
  async createCampaign(
    name: string,
    description: string,
    imageUrl: string,
    targetAmount: string,
    deadline: number
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

  // Donate to a campaign
  async donate(campaignId: string, amount: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const amountWei = ethers.parseEther(amount);
    const tx = await this.contract.donate(campaignId, { value: amountWei });
    
    return await tx.wait();
  }

  // Withdraw funds from campaign (owner only)
  async withdraw(campaignId: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.withdraw(campaignId);
    return await tx.wait();
  }

  // Withdraw platform fees (admin only)
  async withdrawPlatformFees() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.withdrawPlatformFees();
    return await tx.wait();
  }

  // Get all campaigns
  async getCampaigns() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.getCampaigns();
  }

  // Get single campaign
  async getCampaign(campaignId: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return await this.contract.getCampaign(campaignId);
  }
}