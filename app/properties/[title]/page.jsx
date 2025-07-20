"use client";
import Navbar from '@/app/components/Navbar';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { MapPin, Bed, Bath, Maximize, Clock, DollarSign, User, Calendar } from 'lucide-react';
import images from '@/lib/img';
import { getSocketClient } from '@/lib/socketClient';

const PropertyDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [email, setEmail] = useState("");
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      router.push("/login");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    if (property?._id) {
      const socketClient = getSocketClient();
      setSocket(socketClient);
      
      socketClient.emit('join-property', property._id);
      
      socketClient.on('new-bid', (data) => {
        if (data.propertyId === property._id) {
          setProperty(prev => ({
            ...prev,
            currentHighestBid: data.newHighestBid
          }));
          setBids(prev => [data.bid, ...prev]);
          toast.success(`New bid placed: $${data.newHighestBid.toLocaleString()}`);
        }
      });
      
      socketClient.on('user-count', (count) => {
        setOnlineUsers(count);
      });
      
      return () => {
        socketClient.emit('leave-property', property._id);
        socketClient.off('new-bid');
        socketClient.off('user-count');
      };
    }
  }, [property?._id]);
  useEffect(() => {
    const { title } = params;
    const fetchPropertyDetails = async () => {
      if (title && email) {
        setLoading(true);
        try {
          const res = await fetch(`/api/properties/${title}`);
          
          if (!res.ok) {
            toast.error("Property not found");
            router.push('/properties');
            return;
          }
          
          const data = await res.json();
          setProperty(data.property);
          fetchBids(title);
        } catch (error) {
          console.error("Error fetching property:", error);
          toast.error("Failed to fetch property details");
          router.push('/properties');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPropertyDetails();
  }, [params, email, router]);

  const fetchBids = async (propertyId) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/bids`);
      if (response.ok) {
        const data = await response.json();
        setBids(data.bids || []);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  useEffect(() => {
    if (property?.biddingEndsAt) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(property.biddingEndsAt).getTime();
        const distance = endTime - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft('Bidding Ended');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [property]);

  const handlePlaceBid = async () => {
    if (!email) {
      toast.error("Please log in to place a bid.");
      return;
    }
    
    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    const currentHighest = property?.currentHighestBid || property?.startingBid || property?.price || 0;
    
    if (parseFloat(bidAmount) <= currentHighest) {
      toast.error(`Bid must be higher than current highest bid of $${currentHighest.toLocaleString()}`);
      return;
    }

    setBidLoading(true);
    try {
      const response = await fetch(`/api/properties/${property._id}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          bidAmount: parseFloat(bidAmount) 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Bid placed successfully!");
        setBidAmount('');
        setProperty(prev => ({
          ...prev,
          currentHighestBid: data.newHighestBid
        }));
        fetchBids(property._id);
      } else {
        const errorData = await response.json();
        toast.error(errorData?.error || "Failed to place bid.");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid.");
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">Property details not found.</p>
      </div>
    );
  }

  const currentHighestBid = property?.currentHighestBid || property?.startingBid || property?.price || 0;
  const isBiddingActive = property?.isBiddingActive && (!property?.biddingEndsAt || new Date() < new Date(property.biddingEndsAt));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="px-10 md:px-16 lg:px-28 py-4">
        <Navbar isLoggedIn={true} />
        
        <div className="max-w-6xl mx-auto py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={images[Math.floor(Math.random() * images.length)]} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-4 left-4 glass-effect px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-medium">#{property.propertyNumber}</span>
                </div>
                {onlineUsers > 0 && (
                  <div className="absolute top-4 right-4 glass-effect px-3 py-1 rounded-full">
                    <span className="text-green-400 text-sm font-medium">{onlineUsers} viewing</span>
                  </div>
                )}
              </div>

              <div className="glass-effect rounded-xl p-6 mb-6">
                <h1 className="text-3xl font-bold gradient-text mb-4">{property.title}</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-slate-300">
                    <MapPin size={16} className="mr-2 text-blue-400" />
                    <span className="text-sm">{property.location.city}, {property.location.state}</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Bed size={16} className="mr-2 text-blue-400" />
                    <span className="text-sm">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Bath size={16} className="mr-2 text-blue-400" />
                    <span className="text-sm">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Maximize size={16} className="mr-2 text-blue-400" />
                    <span className="text-sm">{property.sizeSqFt} sqft</span>
                  </div>
                </div>

                <div className="text-2xl font-bold text-green-400 mb-4">
                  Listed Price: ${property.price?.toLocaleString()}
                </div>

                {property.description && (
                  <div>
                    <h3 className="text-lg font-semibold gradient-text mb-2">Description</h3>
                    <p className="text-slate-300 leading-relaxed font-light">{property.description}</p>
                  </div>
                )}

                {property.amenities && property.amenities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold gradient-text mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 glass-effect rounded-full text-sm text-slate-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Gallery */}
              {property.images && property.images.length > 1 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold gradient-text mb-4">Property Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.images.slice(1, 7).map((imageUrl, index) => (
                      <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={`${property.title} - Image ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {isBiddingActive && (
                <div className="bid-card rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-semibold gradient-text mb-4 flex items-center">
                    <DollarSign size={20} className="mr-2" />
                    Live Bidding
                  </h2>
                  
                  {property.biddingEndsAt && (
                    <div className="mb-4 p-3 countdown-timer rounded-lg">
                      <div className="flex items-center text-red-400 mb-1">
                        <Clock size={16} className="mr-2" />
                        <span className="text-sm font-medium">Time Remaining</span>
                      </div>
                      <div className="text-lg font-bold text-white">{timeLeft}</div>
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                    <div className="text-sm text-green-400 mb-1">Current Highest Bid</div>
                    <div className="text-2xl font-bold text-white">${currentHighestBid.toLocaleString()}</div>
                  </div>

                  {timeLeft !== 'Bidding Ended' && (
                    <div className="space-y-3">
                      <input
                        type="number"
                        placeholder={`Enter bid (min: $${(currentHighestBid + 1).toLocaleString()})`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={currentHighestBid + 1}
                        className="w-full px-4 py-3 glass-effect border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handlePlaceBid}
                        disabled={bidLoading || !bidAmount}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
                      >
                        {bidLoading ? "Placing Bid..." : "Place Bid"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold gradient-text mb-4 flex items-center">
                  <User size={18} className="mr-2" />
                  Recent Bids ({bids.length})
                </h3>
                
                {bids.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {bids.slice(0, 10).map((bid, index) => (
                      <div key={bid._id || index} className="flex justify-between items-center p-3 glass-effect rounded-lg border border-slate-700">
                        <div>
                          <div className="text-sm text-slate-300 font-medium">
                            {bid.bidder?.userName || 'Anonymous'}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {new Date(bid.bidTime || bid.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-green-400 font-bold">
                          ${bid.bidAmount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-4 font-light">No bids yet. Be the first to bid!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;