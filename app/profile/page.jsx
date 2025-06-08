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
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen px-10 md:px-16 lg:px-28 py-4 bg-black text-white">
            <Navbar />
            
            <div className="max-w-7xl mx-auto py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-xl p-6 sticky top-4">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">
                                        {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold text-white">{user?.userName}</h2>
                                <p className="text-gray-400 text-sm">{user?.email}</p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Saved Properties:</span>
                                    <span className="text-white font-medium">{user?.saved?.properties?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Published Properties:</span>
                                    <span className="text-white font-medium">{userProperties.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Total Bids:</span>
                                    <span className="text-white font-medium">{userBids.length}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => router.push('/add-property')}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    <Plus size={18} />
                                    Add Property
                                </button>
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-600/50 hover:bg-red-700/50 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="mb-6">
                            <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
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
                                    <h3 className="text-2xl font-semibold mb-6">Saved Properties</h3>
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
                                            <Heart size={48} className="mx-auto text-gray-600 mb-4" />
                                            <p className="text-gray-400 text-lg">No saved properties yet.</p>
                                            <button
                                                onClick={() => router.push('/properties')}
                                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                                            >
                                                Browse Properties
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'published' && (
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6">My Properties</h3>
                                    {userProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {userProperties.map((property, index) => (
                                                <div key={property._id} className="bg-gray-800 rounded-lg overflow-hidden">
                                                    <div className="relative h-48">
                                                        <img
                                                            src={images[index % images.length]}
                                                            alt={property.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-2 right-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                property.status === 'Available' ? 'bg-green-600' :
                                                                property.status === 'Under Offer' ? 'bg-yellow-600' :
                                                                'bg-red-600'
                                                            }`}>
                                                                {property.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="font-semibold text-white mb-2">{property.title}</h4>
                                                        <p className="text-gray-400 text-sm mb-2">{property.location.city}, {property.location.state}</p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-green-400 font-bold">${property.price.toLocaleString()}</span>
                                                            {property.isBiddingActive && (
                                                                <span className="text-blue-400 text-sm">
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
                                            <Home size={48} className="mx-auto text-gray-600 mb-4" />
                                            <p className="text-gray-400 text-lg">No properties published yet.</p>
                                            <button
                                                onClick={() => router.push('/add-property')}
                                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                                            >
                                                Add Your First Property
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'bids' && (
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6">My Bids</h3>
                                    {userBids.length > 0 ? (
                                        <div className="space-y-4">
                                            {userBids.map((bid, index) => (
                                                <div key={bid._id} className="bg-gray-800 rounded-lg p-6">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-white mb-2">{bid.property.title}</h4>
                                                            <p className="text-gray-400 text-sm mb-2">{bid.property.location}</p>
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <span className="text-gray-400">
                                                                    Bid Amount: <span className="text-green-400 font-semibold">${bid.bidAmount.toLocaleString()}</span>
                                                                </span>
                                                                <span className="text-gray-400">
                                                                    Current Highest: <span className="text-blue-400 font-semibold">${bid.property.currentHighestBid.toLocaleString()}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                                                                bid.bidAmount === bid.property.currentHighestBid ? 'bg-green-600' : 'bg-gray-600'
                                                            }`}>
                                                                {bid.bidAmount === bid.property.currentHighestBid ? 'Winning' : 'Outbid'}
                                                            </div>
                                                            <p className="text-gray-400 text-xs">
                                                                {new Date(bid.bidTime).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <Gavel size={48} className="mx-auto text-gray-600 mb-4" />
                                            <p className="text-gray-400 text-lg">No bids placed yet.</p>
                                            <button
                                                onClick={() => router.push('/properties')}
                                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
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