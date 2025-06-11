import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CreateCampaignForm } from './components/CreateCampaignForm';
import { CampaignDetail } from './components/CampaignDetail';
import { AdminPanel } from './components/AdminPanel';

// Declare global ethereum object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
          <Header />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateCampaignForm />} />
              <Route path="/campaign/:id" element={<CampaignDetail />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    CrowdFund3
                  </span>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-gray-600 text-sm">
                    Powered by Ethereum • Built with React & Tailwind CSS
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    © 2024 CrowdFund3. Decentralized crowdfunding for the future.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;