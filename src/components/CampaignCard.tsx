import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Target, Users, TrendingUp } from 'lucide-react';
import { Campaign } from '../types/Campaign';

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getProgressPercentage = () => {
    const collected = parseFloat(campaign.amountCollected);
    const target = parseFloat(campaign.targetAmount);
    return Math.min((collected / target) * 100, 100);
  };

  const isExpired = () => {
    return Date.now() > campaign.deadline * 1000;
  };

  const getDaysLeft = () => {
    const timeLeft = campaign.deadline * 1000 - Date.now();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      {/* Campaign Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.imageUrl || 'https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg'}
          alt={campaign.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isExpired() 
              ? 'bg-red-100 text-red-800' 
              : campaign.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
          }`}>
            {isExpired() ? 'Expired' : campaign.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Campaign Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {campaign.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-purple-600">
              {getProgressPercentage().toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Raised</p>
              <p className="font-semibold text-gray-900">
                {campaign.amountCollected} ETH
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Goal</p>
              <p className="font-semibold text-gray-900">
                {campaign.targetAmount} ETH
              </p>
            </div>
          </div>
        </div>

        {/* Deadline Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {formatDate(campaign.deadline)}
            </span>
          </div>
          <span className="text-sm font-medium text-purple-600">
            {getDaysLeft()} days left
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/campaign/${campaign.id}`}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};