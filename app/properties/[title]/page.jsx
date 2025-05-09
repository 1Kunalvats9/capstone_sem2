"use client";
import Navbar from '@/app/components/Navbar';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';

const PropertyDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [email, setEmail] = useState("");
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidSuccess, setBidSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      router.push("/login");
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    const { title } = params; // Access the dynamic segment using 'title'
    const fetchPropertyDetails = async () => {
      if (title && email) {
        setLoading(true);
        try {
          const res = await fetch(`/api/properties/get-property`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
          if (!res.ok) {
            toast.error("Could not fetch properties");
            router.push('/home');
            return;
          }
          const data = await res.json();
          console.log(data);
          // Assuming your property objects have an 'id' property
          const foundProperty = data?.data?.find((prop) => prop.id === title);
          if (foundProperty) {
            setProperty(foundProperty);
            setBids(foundProperty.bids || []); // Initialize bids
          } else {
            toast.error("Property not found");
            router.push('/home');
          }
        } catch (error) {
          console.error("Error fetching properties:", error);
          toast.error("Failed to fetch properties");
          router.push('/home');
        } finally {
          setLoading(false);
        }
      } else {
        console.log("Title or email is undefined:", title, email); // Debugging log
      }
    };

    fetchPropertyDetails();
  }, [params, email, router]);

  const handleBidChange = (e) => {
    setBidAmount(e.target.value);
  };

  const handlePlaceBid = async () => {
    if (!email) {
      toast.error("Please log in to place a bid.");
      return;
    }
    if (!property?.id) {
      toast.error("Property ID is missing.");
      return;
    }
    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    try {
      const res = await fetch(`/api/properties/${property.id}/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, bidAmount: parseFloat(bidAmount) }),
      });

      if (res.ok) {
        toast.success("Bid placed successfully!");
        const data = await res.json();
        setBids(data.bids);
        setBidAmount('');
        setBidSuccess(true);
        setTimeout(() => setBidSuccess(false), 3000);
      } else {
        const errorData = await res.json();
        toast.error(errorData?.message || "Failed to place bid.");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid.");
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

  return (
    <div className="min-h-screen bg-black  text-white">
      <Navbar cs="" isLoggedIn={true} />
      <div className="container mx-auto py-10 px-6 md:px-12 lg:px-24">
        <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-lg p-8">
          {/* Image Section */}
          {property.image && (
            <div className="relative w-full h-96 rounded-md overflow-hidden mb-6">
              <Image src={property.image} alt={property.title} layout="fill" objectFit="cover" priority />
            </div>
          )}

          {/* Property Details */}
          <h1 className="text-3xl font-bold text-blue-400 mb-4">{property.title}</h1>
          <div className="mb-4 text-gray-300">
            <div className="flex items-center mb-2">
              <MapPin size={16} className="mr-2 text-blue-300" /> {property.location}
            </div>
            <div className="flex items-center mb-2">
              <Bed size={16} className="mr-2 text-blue-300" /> {property.bedroom} Bedrooms
            </div>
            <div className="flex items-center mb-2">
              <Bath size={16} className="mr-2 text-blue-300" /> {property.bathroom} Bathrooms
            </div>
            <div className="flex items-center mb-2">
              <Maximize size={16} className="mr-2 text-blue-300" /> {property.sizeSqFt} sqft
            </div>
            <div className="text-xl font-semibold text-green-400">Price: ${property.price?.toLocaleString()}</div>
          </div>

          {/* Bid Section */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Place Your Bid</h2>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="number"
                placeholder="Enter your bid amount"
                value={bidAmount}
                onChange={handleBidChange}
                className="bg-gray-700 text-white rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handlePlaceBid}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Place Bid
              </button>
            </div>
            {bidSuccess && <p className="text-green-400 text-sm mt-2">Bid placed successfully!</p>}
          </div>

          {/* Existing Bids */}
          {bids.length > 0 && (
            <div className="mt-8 border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold text-blue-400 mb-4">Recent Bids</h2>
              <ul className="list-disc pl-5 text-gray-300">
                {bids.map((bid) => (
                  <li key={bid._id}>
                    User: {bid.userEmail} - Amount: ${bid.bidAmount.toLocaleString()} - Date: {new Date(bid.createdAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;