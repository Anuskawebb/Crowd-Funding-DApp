import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { CampaignCard } from '../components/CampaignCard';
import { Campaign } from '../types/Campaign';

export const HomePage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'completed'>('all');

  // Mock campaigns data - replace with actual contract calls
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Revolutionary Green Energy Project',
        description: 'Developing advanced solar panel technology to increase efficiency by 40% while reducing costs.',
        imageUrl: 'https://images.pexels.com/photos/9800006/pexels-photo-9800006.jpeg',
        targetAmount: '50.0',
        amountCollected: '32.5',
        deadline: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        owner: '0x1234567890123456789012345678901234567890',
        isActive: true,
      },
      {
        id: '2',
        name: 'Medical Research for Rare Diseases',
        description: 'Funding critical research to find treatments for rare genetic disorders affecting children.',
        imageUrl: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg',
        targetAmount: '25.0',
        amountCollected: '18.7',
        deadline: Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60,
        owner: '0x2345678901234567890123456789012345678901',
        isActive: true,
      },
      {
        id: '3',
        name: 'Education Initiative for Rural Communities',
        description: 'Building digital learning centers in underserved rural areas to provide quality education.',
        imageUrl: 'https://images.pexels.com/photos/5427673/pexels-photo-5427673.jpeg',
        targetAmount: '15.0',
        amountCollected: '15.2',
        deadline: Math.floor(Date.now() / 1000) - 5 * 24 * 60 * 60,
        owner: '0x3456789012345678901234567890123456789012',
        isActive: false,
      },
      {
        id: '4',
        name: 'Clean Water Solutions for Africa',
        description: 'Installing water purification systems in African villages to provide clean drinking water.',
        imageUrl: 'https://images.pexels.com/photos/6994311/pexels-photo-6994311.jpeg',
        targetAmount: '40.0',
        amountCollected: '12.3',
        deadline: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60,
        owner: '0x4567890123456789012345678901234567890123',
        isActive: true,
      },
      {
        id: '5',
        name: 'Blockchain Gaming Platform',
        description: 'Creating a decentralized gaming platform with play-to-earn mechanics and NFT integration.',
        imageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
        targetAmount: '100.0',
        amountCollected: '67.8',
        deadline: Math.floor(Date.now() / 1000) + 20 * 24 * 60 * 60,
        owner: '0x5678901234567890123456789012345678901234',
        isActive: true,
      },
      {
        id: '6',
        name: 'Sustainable Fashion Startup',
        description: 'Launching an eco-friendly clothing line using recycled materials and sustainable practices.',
        imageUrl: 'https://images.pexels.com/photos/5698853/pexels-photo-5698853.jpeg',
        targetAmount: '30.0',
        amountCollected: '8.9',
        deadline: Math.floor(Date.now() / 1000) + 35 * 24 * 60 * 60,
        owner: '0x6789012345678901234567890123456789012345',
        isActive: true,
      },
    ];

    setCampaigns(mockCampaigns);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterActive === 'all') return matchesSearch;
    
    const isExpired = Date.now() > campaign.deadline * 1000;
    if (filterActive === 'active') return matchesSearch && !isExpired && campaign.isActive;
    if (filterActive === 'completed') return matchesSearch && (isExpired || !campaign.isActive);
    
    return matchesSearch;
  });

  const getTotalStats = () => {
    const totalRaised = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.amountCollected), 0);
    const activeCampaigns = campaigns.filter(c => c.isActive && Date.now() <= c.deadline * 1000).length;
    
    return {
      totalRaised: totalRaised.toFixed(1),
      activeCampaigns,
      totalCampaigns: campaigns.length,
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fund the Future with
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Decentralized Crowdfunding
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8">
            Support innovative projects, back revolutionary ideas, and be part of the Web3 revolution.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">{stats.totalRaised}</div>
              <div className="text-purple-200 text-sm md:text-base">ETH Raised</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">{stats.activeCampaigns}</div>
              <div className="text-purple-200 text-sm md:text-base">Active Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">{stats.totalCampaigns}</div>
              <div className="text-purple-200 text-sm md:text-base">Total Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'completed')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            >
              <option value="all">All Campaigns</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaign Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filterActive === 'all' ? 'All Campaigns' : 
             filterActive === 'active' ? 'Active Campaigns' : 'Completed Campaigns'}
          </h2>
          <div className="flex items-center space-x-2 text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">{filteredCampaigns.length} campaigns</span>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No campaigns found
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No campaigns match "${searchTerm}". Try adjusting your search.`
                  : 'No campaigns available for this filter.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};