import React, { useState } from 'react';
import { Shield, DollarSign, BarChart3, Users, TrendingUp } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { ContractService } from '../services/contractService';

export const AdminPanel: React.FC = () => {
  const { connected, signer, address } = useWallet();
  const [withdrawing, setWithdrawing] = useState(false);
  
  // Hardcoded admin address for demo - replace with your admin address
  const ADMIN_ADDRESS = '0xYOUR_ADMIN_ADDRESS_HERE';

  const isAdmin = () => {
    return connected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
  };

  const handleWithdrawPlatformFees = async () => {
    if (!isAdmin()) {
      alert('You are not authorized to perform this action');
      return;
    }

    setWithdrawing(true);

    try {
      const contractService = new ContractService(signer);
      await contractService.withdrawPlatformFees();
      
      alert('Platform fees withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing platform fees:', error);
      alert('Failed to withdraw platform fees. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Access Required
          </h2>
          <p className="text-gray-600">
            Please connect your wallet to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage platform operations and finances</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Campaigns</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-sm text-green-600 mt-1">+3 this month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Raised</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">158.7 ETH</p>
          <p className="text-sm text-green-600 mt-1">+12.3 ETH this month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">1,247</p>
          <p className="text-sm text-green-600 mt-1">+89 this month</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Platform Fees</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">4.76 ETH</p>
          <p className="text-sm text-green-600 mt-1">+0.37 ETH this month</p>
        </div>
      </div>

      {/* Platform Management */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Fee Management */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fee Management</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Platform Fees
                </h3>
                <span className="text-2xl font-bold text-green-600">
                  4.76 ETH
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                Total accumulated platform fees from all campaigns ready for withdrawal.
              </p>
              
              <button
                onClick={handleWithdrawPlatformFees}
                disabled={withdrawing}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {withdrawing ? 'Withdrawing...' : 'Withdraw Platform Fees'}
              </button>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Fee Structure</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium">3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-medium">0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fee:</span>
                  <span className="font-semibold">3.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Analytics */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Analytics</h2>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">New Campaign Created</p>
                    <p className="text-sm text-gray-600">Green Energy Project</p>
                  </div>
                  <span className="text-sm text-gray-500">2h ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Large Donation</p>
                    <p className="text-sm text-gray-600">5 ETH to Education Fund</p>
                  </div>
                  <span className="text-sm text-gray-500">4h ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Campaign Completed</p>
                    <p className="text-sm text-gray-600">Medical Research reached goal</p>
                  </div>
                  <span className="text-sm text-gray-500">1d ago</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Top Categories</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Technology</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-16 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">80%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Healthcare</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Education</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-8 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};