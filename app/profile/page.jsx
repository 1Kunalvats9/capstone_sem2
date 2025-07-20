"use client"
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PropertyCard from '../components/PropertyCard';
import images from "@/lib/img";
import { Plus, Home, Heart, Gavel, Settings } from 'lucide-react';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('saved');
    const [userProperties, setUserProperties] = useState([]);
    const [userBids, setUserBids] = useState([]);

    useEffect(() => {
        const userEmail = localStorage.getItem("email");
        setEmail(userEmail);

        if (!userEmail) {
            router.push('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const [userRes, propertiesRes, bidsRes] = await Promise.all([
                    fetch("/api/get-user", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: userEmail }),
                    }),
                    fetch(`/api/user/properties?email=${userEmail}`),
                    fetch(`/api/user/bids?email=${userEmail}`)
                ]);

                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData.user);
                }

                if (propertiesRes.ok) {
                    const propertiesData = await propertiesRes.json();
                    setUserProperties(propertiesData.properties || []);
                }

                if (bidsRes.ok) {
                    const bidsData = await bidsRes.json();
                    setUserBids(bidsData.bids || []);
                }

            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to fetch user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        router.push('/home');
        toast.success("Logged out successfully");
    };

    const tabs = [
        { id: 'saved', label: 'Saved Properties', icon: Heart },
        { id: 'published', label: 'My Properties', icon: Home },
        { id: 'bids', label: 'My Bids', icon: Gavel },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen px-10 md:px-16 lg:px-28 py-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <Navbar />
            
            <div className="max-w-7xl mx-auto py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="glass-effect rounded-xl p-6 sticky top-4 border border-slate-700">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-2xl font-bold text-white">
                                        {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold gradient-text">{user?.userName}</h2>
                                <p className="text-slate-400 text-sm font-light">{user?.email}</p>
                            </div>

                            <div className="space-y-4 mb-6 bg-slate-800/50 rounded-lg p-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-light">Saved Properties:</span>
                                    <span className="text-blue-400 font-bold">{user?.saved?.properties?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-light">Published Properties:</span>
                                    <span className="text-green-400 font-bold">{userProperties.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-light">Total Bids:</span>
                                    <span className="text-purple-400 font-bold">{userBids.length}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => router.push('/add-property')}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                                >
                                    <Plus size={18} />
                                    Add Property
                                </button>
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-3 rounded-lg transition-colors border border-red-500/30"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="mb-6">
                            <div className="flex space-x-1 glass-effect p-1 rounded-xl border border-slate-700">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 flex-1 justify-center font-medium ${
                                                activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                            }`}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="min-h-96">
                            {activeTab === 'saved' && (
                                <div>
                                    <h3 className="text-2xl font-bold gradient-text mb-6">Saved Properties</h3>
                                    {user?.saved?.properties?.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {user.saved.properties.map((property, index) => (
                                                <PropertyCard 
                                                    key={property.id || index} 
                                                    property={property} 
                                                    image={images[index % images.length]} 
                                                    isSavedPage={true}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="glass-effect rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                                <Heart size={48} className="text-slate-500" />
                                            </div>
                                            <p className="text-slate-400 text-lg font-light mb-4">No saved properties yet.</p>
                                            <button
                                                onClick={() => router.push('/properties')}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                                            >
                                                Browse Properties
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'published' && (
                                <div>
                                    <h3 className="text-2xl font-bold gradient-text mb-6">My Properties</h3>
                                    {userProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {userProperties.map((property, index) => (
                                                <div key={property._id} className="glass-effect rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
                                                    <div className="relative h-48">
                                                        {property.images && property.images.length > 0 ? (
                                                            <img
                                                                src={property.images[0]}
                                                                alt={property.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={images[index % images.length]}
                                                                alt={property.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                        <div className="absolute top-2 right-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                property.status === 'Available' ? 'bg-green-600' :
                                                                property.status === 'Under Offer' ? 'bg-yellow-600' :
                                                                'bg-red-600'
                                                            }`}>
                                                                {property.status}
                                                            </span>
                                                        </div>
                                                        <div className="absolute top-2 left-2 glass-effect px-2 py-1 rounded-full">
                                                            <span className="text-white text-xs font-medium">#{property.propertyNumber}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="font-bold text-white mb-2">{property.title}</h4>
                                                        <p className="text-slate-400 text-sm mb-2 font-light">{property.location.city}, {property.location.state}</p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-green-400 font-bold">${property.price.toLocaleString()}</span>
                                                            {property.isBiddingActive && (
                                                                <span className="text-blue-400 text-sm font-medium">
                                                                    Highest: ${property.currentHighestBid.toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="glass-effect rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                                <Home size={48} className="text-slate-500" />
                                            </div>
                                            <p className="text-slate-400 text-lg font-light mb-4">No properties published yet.</p>
                                            <button
                                                onClick={() => router.push('/add-property')}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                                            >
                                                Add Your First Property
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'bids' && (
                                <div>
                                    <h3 className="text-2xl font-bold gradient-text mb-6">My Bids</h3>
                                    {userBids.length > 0 ? (
                                        <div className="space-y-4">
                                            {userBids.map((bid, index) => (
                                                <div key={bid._id} className="glass-effect rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-white mb-2">{bid.property.title}</h4>
                                                            <p className="text-slate-400 text-sm mb-2 font-light">{bid.property.location}</p>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <span className="text-slate-400 font-light">
                                                                    Bid Amount: <span className="text-green-400 font-bold">${bid.bidAmount.toLocaleString()}</span>
                                                                </span>
                                                                <span className="text-slate-400 font-light">
                                                                    Current Highest: <span className="text-blue-400 font-bold">${bid.property.currentHighestBid.toLocaleString()}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                                                                bid.bidAmount === bid.property.currentHighestBid ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                            }`}>
                                                                {bid.bidAmount === bid.property.currentHighestBid ? 'Winning' : 'Outbid'}
                                                            </div>
                                                            <p className="text-slate-400 text-xs font-light">
                                                                {new Date(bid.bidTime).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="glass-effect rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                                <Gavel size={48} className="text-slate-500" />
                                            </div>
                                            <p className="text-slate-400 text-lg font-light mb-4">No bids placed yet.</p>
                                            <button
                                                onClick={() => router.push('/properties')}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
                                            >
                                                Start Bidding
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;