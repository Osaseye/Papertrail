import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, {user?.name}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">This is your User Dashboard. Subscribe to creators to see content here.</p>
        
        {/* Placeholder for feed */}
        <div className="mt-8 border-2 border-dashed border-gray-200 rounded-lg h-64 flex items-center justify-center text-gray-400">
            No newsletters yet. Visit Explore to find creators.
        </div>
      </div>
    </div>
  );
}
