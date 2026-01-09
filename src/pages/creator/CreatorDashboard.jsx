import { useAuth } from '../../context/AuthContext';
import { Plus, Users, Send, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreatorDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.brandName || 'My Publication'}</h1>
            <p className="text-gray-500 text-sm">Creator Dashboard</p>
        </div>
        <Link to="/creator/editor" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
            <Plus size={20} className="mr-2" /> Write New
        </Link>
      </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-500 text-sm font-medium">Total Subscribers</h3>
                 <Users size={20} className="text-blue-500" />
             </div>
             <p className="text-3xl font-bold text-gray-900">0</p>
             <p className="text-xs text-green-600 mt-2 flex items-center">
                 <TrendingUp size={12} className="mr-1" /> +0% this week
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-500 text-sm font-medium">Emails Sent</h3>
                 <Send size={20} className="text-green-500" />
             </div>
             <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-500 text-sm font-medium">Avg. Open Rate</h3>
                 <TrendingUp size={20} className="text-orange-500" />
             </div>
             <p className="text-3xl font-bold text-gray-900">0%</p>
          </div>
       </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Newsletters</h2>
        <div className="border-t border-gray-100">
             <div className="py-8 text-center text-gray-500 text-sm">
                 You haven't sent any newsletters yet.
             </div>
        </div>
      </div>
    </div>
  );
}
