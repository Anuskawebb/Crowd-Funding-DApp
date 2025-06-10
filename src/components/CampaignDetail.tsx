import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  Share2, 
  Heart,
  ArrowLeft,
  Wallet
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { Campaign, Donation } from '../types/Campaign';
import { ContractService } from '../services/contractService';

export const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { connected, address, signer } = useWallet();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // Mock campaign data - replace with actual contract call
  useEffect(() => {
    const mockCampaign: Campaign = {
      id: id || '1',
      name: 'Revolutionary Green Energy Project',
      description: 'We are developing a groundbreaking solar panel technology that can increase energy efficiency by 40% while reducing manufacturing costs. This project aims to make renewable energy more accessible to communities worldwide. Our team of experienced engineers and scientists have already completed the prototype phase and are ready to scale production. The funds raised will be used for manufacturing equipment, research and development, marketing, and establishing partnerships with distributors globally.',
      imageUrl: 'https://images.pexels.com/photos/9800006/pexels-photo-9800006.jpeg',
      targetAmount: '50.0',
      amountCollected: '32.5',
      deadline: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
      owner: '0x1234567890123456789012345678901234567890',
      isActive: true,
      donations: [
        {
          donor: '0xAbCdEf1234567890123456789012345678901234',
          amount: '5.0',
          timestamp: Date.now() / 1000 - 86400,
        },
        {
          donor: '0x9876543210987654321098765432109876543210',
          amount: '10.0',
          timestamp: Date.now() / 1000 - 172800,
        },
        {
          donor: '0x5555555555555555555555555555555555555555',
          amount: '2.5',
          timestamp: Date.now() / 1000 - 259200,
        },
      ],
    };
    
    setCampaign(mockCampaign);
  }, [id]);

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProgressPercentage = () => {
    const collected = parseFloat(campaign.amountCollected);
    const target = parseFloat(campaign.targetAmount);
    return Math.min((collected / target) * 100, 100);
  };

  const getDaysLeft = () => {
    const timeLeft = campaign.deadline * 1000 - Date.now();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const isOwner = () => {
    return connected && address?.toLowerCase() === campaign.owner.toLowerCase();
  };

  const handleDonate = async () => {
    if (!connected) {
      alert('Please connect your wallet to donate');
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    setLoading(true);

    try {
      const contractService = new ContractService(signer);
      await contractService.donate(campaign.id, donationAmount);
      
      alert('Donation successful!');
      setDonationAmount('');
      
      // Refresh campaign data
      // In a real app, you would refetch from the contract
      setCampaign(prev => prev ? {
        ...prev,
        amountCollected: (parseFloat(prev.amountCollected) + parseFloat(donationAmount)).toString()
      } : null);
    } catch (error) {
      console.error('Error donating:', error);
      alert('Failed to donate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isOwner()) {
      alert('Only the campaign owner can withdraw funds');
      return;
    }

    setWithdrawing(true);

    try {
      const contractService = new ContractService(signer);
      await contractService.withdraw(campaign.id);
      
      alert('Funds withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Failed to withdraw funds. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaigns</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Campaign Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={campaign.imageUrl}
              alt={campaign.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Campaign Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {campaign.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
              <span>Created by {formatAddress(campaign.owner)}</span>
              <span>•</span>
              <span>{campaign.donations?.length || 0} supporters</span>
            </div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {campaign.description}
            </p>
          </div>

          {/* Donation History */}
          {campaign.donations && campaign.donations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Donations
              </h3>
              <div className="space-y-4">
                {campaign.donations.map((donation, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatAddress(donation.donor)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(donation.timestamp)}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-purple-600">
                      {donation.amount} ETH
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="space-y-6">
              {/* Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {getProgressPercentage().toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.amountCollected}
                  </p>
                  <p className="text-sm text-gray-600">ETH Raised</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.targetAmount}
                  </p>
                  <p className="text-sm text-gray-600">ETH Goal</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.donations?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Supporters</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {getDaysLeft()}
                  </p>
                  <p className="text-sm text-gray-600">Days Left</p>
                </div>
              </div>

              {/* Deadline */}
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Campaign ends on</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(campaign.deadline)}
                </p>
              </div>
            </div>
          </div>

          {/* Donation Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Support This Campaign
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount (ETH)
                </label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.001"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>
              
              <button
                onClick={handleDonate}
                disabled={loading || !connected}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>
                  {loading ? 'Donating...' : !connected ? 'Connect Wallet' : 'Donate Now'}
                </span>
              </button>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner() && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Owner Actions
              </h3>
              
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {withdrawing ? 'Withdrawing...' : 'Withdraw Funds'}
              </button>
            </div>
          )}

          {/* Share Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Share Campaign
            </h3>
            
            <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};