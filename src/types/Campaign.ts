export interface Campaign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  targetAmount: string; // in ETH
  amountCollected: string; // in ETH
  deadline: number; // timestamp
  owner: string;
  isActive: boolean;
  donations?: Donation[];
}

export interface Donation {
  donor: string;
  amount: string; // in ETH
  timestamp: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  signer: any | null;
  provider: any | null;
}