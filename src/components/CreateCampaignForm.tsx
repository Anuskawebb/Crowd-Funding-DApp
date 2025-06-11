import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Image, FileText, Type } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { ContractService } from '../services/contractService';

export const CreateCampaignForm: React.FC = () => {
  const navigate = useNavigate();
  const { connected, signer } = useWallet();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    targetAmount: '',
    deadline: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const contractService = new ContractService(signer);
      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
      
      await contractService.createCampaign(
        formData.name,
        formData.description,
        formData.imageUrl || 'https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg',
        formData.targetAmount,
        deadlineTimestamp
      );
      
      alert('Campaign created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  if (!connected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to create a campaign.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Campaign
        </h2>
        <p className="text-gray-600 mb-8">
          Launch your crowdfunding campaign and start raising funds for your project.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="inline w-4 h-4 mr-2" />
              Campaign Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter campaign name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your campaign, goals, and how funds will be used"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="inline w-4 h-4 mr-2" />
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to use a default image
            </p>
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Target Amount (ETH)
            </label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              placeholder="0.0"
              step="0.001"
              min="0"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors.targetAmount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.targetAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Campaign Deadline
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                errors.deadline ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
};