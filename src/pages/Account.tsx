import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Account() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');

  if (!user) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col">
        <Header onBuyClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-4">Please login first</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleUpdateProfile = () => {
    updateProfile({ name });
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header onBuyClick={() => {}} />
      <div className="flex-1 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black text-yellow-400">My Account</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>

          {/* Profile Section */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-gray-400 text-sm">Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none mt-1"
                  />
                ) : (
                  <p className="text-lg font-semibold mt-1">{name}</p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-lg font-semibold mt-1">{user.email}</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Phone</label>
                <p className="text-lg font-semibold mt-1">{user.phone}</p>
              </div>
            </div>

            {editMode ? (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setName(user.name);
                  }}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
