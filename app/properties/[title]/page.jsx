"use client";
import Navbar from '@/app/components/Navbar';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { MapPin, Bed, Bath, Maximize, Clock, DollarSign, User, Calendar } from 'lucide-react';
import images from '@/lib/img';

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

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      router.push("/login");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

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
    <div className="min-h-screen bg-black text-white">
      <div className="px-10 md:px-16 lg:px-28 py-4">
        <Navbar isLoggedIn={true} />
        
        <div className="max-w-6xl mx-auto py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
                <Image 
                  src={images[Math.floor(Math.random() * images.length)]} 
                  alt={property.title} 
                  layout="fill" 
                  objectFit="cover" 
                  priority 
                />
              </div>

              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-blue-400 mb-4">{property.title}</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-gray-300">
                    <MapPin size={16} className="mr-2 text-blue-300" />
                    <span className="text-sm">{property.location.city}, {property.location.state}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Bed size={16} className="mr-2 text-blue-300" />
                    <span className="text-sm">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Bath size={16} className="mr-2 text-blue-300" />
                    <span className="text-sm">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Maximize size={16} className="mr-2 text-blue-300" />
                    <span className="text-sm">{property.sizeSqFt} sqft</span>
                  </div>
                </div>

                <div className="text-2xl font-bold text-green-400 mb-4">
                  Listed Price: ${property.price?.toLocaleString()}
                </div>

                {property.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {property.amenities && property.amenities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              {isBiddingActive && (
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                    <DollarSign size={20} className="mr-2" />
                    Live Bidding
                  </h2>
                  
                  {property.biddingEndsAt && (
                    <div className="mb-4 p-3 bg-red-900/30 rounded-lg">
                      <div className="flex items-center text-red-400 mb-1">
                        <Clock size={16} className="mr-2" />
                        <span className="text-sm font-medium">Time Remaining</span>
                      </div>
                      <div className="text-lg font-bold text-white">{timeLeft}</div>
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-green-900/30 rounded-lg">
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
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handlePlaceBid}
                        disabled={bidLoading || !bidAmount}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition-colors"
                      >
                        {bidLoading ? "Placing Bid..." : "Place Bid"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                  <User size={18} className="mr-2" />
                  Recent Bids ({bids.length})
                </h3>
                
                {bids.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {bids.slice(0, 10).map((bid, index) => (
                      <div key={bid._id || index} className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                        <div>
                          <div className="text-sm text-gray-400">
                            {bid.bidder?.userName || 'Anonymous'}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {new Date(bid.bidTime || bid.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-green-400 font-semibold">
                          ${bid.bidAmount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">No bids yet. Be the first to bid!</p>
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