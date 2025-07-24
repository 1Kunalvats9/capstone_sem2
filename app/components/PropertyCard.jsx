"use client";
import React, { useEffect, useState } from 'react';
import { Bath, Bed, Heart, MapPin, Maximize, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, isSavedPage = false, setSelectedProperty = () => { } }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [saved, setSaved] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedProperties = async () => {
      const email = localStorage.getItem("email");
      if (email) {
        try {
          const response = await fetch(`/api/properties/saved?email=${email}`);
          if (response.ok) {
            const data = await response.json();
            setSaved(data.savedProperties || []);
          }
        } catch (error) {
          console.error('Error fetching saved properties:', error);
        }
      }
    };

    fetchSavedProperties();
  }, []);

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    const email = localStorage.getItem("email");
    if (!email) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/properties/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          propertyId: property.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);

        const isCurrentlySaved = saved.some(savedProp => savedProp._id === property.id);
        if (isCurrentlySaved) {
          setSaved(prev => prev.filter(item => item._id !== property.id));
        } else {
          setSaved(prev => [...prev, { _id: property.id }]);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData?.error || "Failed to save/unsave property");
      }
    } catch (error) {
      console.error("Error saving/unsaving property:", error);
      toast.error("Error saving/unsaving property");
    }
  };

  const handleCardClick = () => {
    router.push(`/properties/${property.id}`);
  };

  const isPropertySaved = saved.some(savedProp => savedProp._id === property.id);

  return (
      <div
          className="property-card cursor-pointer bg-white/10 backdrop-blur-2xl rounded-lg overflow-hidden shadow-property hover:shadow-property-hover transition-shadow duration-300 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCardClick}
      >
        <div className="block">
          <div className="relative">
            {/* Check for property images */}
            {property?.images && property.images.length > 0 ? (
                <img
                    src={property.images[0]}
                    alt={property?.title}
                    className="w-full h-52 object-cover transition-transform duration-300"
                    style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                />
            ) : (
                // Fallback to an icon if no image is available
                <div
                    className="w-full h-52 bg-slate-800 flex items-center justify-center transition-transform duration-300"
                    style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                >
                  <Home className="w-16 h-16 text-slate-600" />
                </div>
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 transition-opacity duration-300" style={{ opacity: isHovered ? 0.3 : 0 }}></div>
            <button
                onClick={handleSaveClick}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-300 z-10 ${
                    isSavedPage
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Heart
                  size={18}
                  className='cursor-pointer hover:scale-115 duration-200'
                  fill={isPropertySaved ? 'white' : 'none'}
                  stroke={isPropertySaved ? 'none' : 'currentColor'}
              />
            </button>
          </div>

          <div className="p-4 relative">
            <div className="mb-2 text-sm text-gray-500 flex items-center">
              <MapPin size={14} className="mr-1" /> {property?.location}
            </div>

            <h3 className="text-lg font-bold text-white mb-2 truncate">{property?.title}</h3>

            <div className="mb-4">
              <div className="text-sm text-gray-500">Price</div>
              <div className="text-xl font-bold text-primary-800">
                ₹{property?.price?.toLocaleString()}
              </div>
            </div>

            <div className="flex justify-between text-gray-500 border-t pt-4 text-sm">
              <div className="flex items-center">
                <Bed size={16} className="mr-1" />
                <span>{property?.bedrooms} beds</span>
              </div>
              <div className="flex items-center">
                <Bath size={16} className="mr-1" />
                <span>{property?.bathrooms} baths</span>
              </div>
              <div className="flex items-center">
                <Maximize size={16} className="mr-1" />
                <span>{property?.sizeSqFt} sqft</span>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <span className="text-blue-400 font-semibold">Bid on it</span>
            </div>
          </div>
        </div>
      </div>
  );
}

export default PropertyCard;
