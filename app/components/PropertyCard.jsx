"use client";
import React, { useEffect, useState } from 'react';
import { Bath, Bed, Heart, MapPin, Maximize, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, image, isSavedPage = false, setSelectedProperty = () => { } }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [saved, setsaved] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedProperties = async () => {
      const email = localStorage.getItem("email");
      if (email) {
        try {
          const response = await fetch(`/api/properties/get-property`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
          if (response.ok) {
            const data = await response.json();
            if (data.data) {
              setsaved(data.data);
            }
          } else {
            console.error('Failed to fetch saved properties');
          }
        } catch (error) {
          console.error('Error fetching saved properties:', error);
        }
      }
    };

    fetchSavedProperties();
  }, [property?.id]);

  const handleSaveClick = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      router.push('/login');
      return;
    }
    const isCurrentlySaved = saved.some(savedProp => savedProp?.id === property?.id);
    const fetchUrl = isCurrentlySaved ? '/api/properties/delete' : '/api/properties/save';
    const method = 'POST';
    const body = JSON.stringify({ email, property }); // Ensure 'property' prop has 'bathrooms' and 'bedrooms'

    try {
      const response = await fetch(fetchUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        if (isCurrentlySaved) {
          setsaved(prev => prev.filter(item => item.id !== property.id));
        } else {
          setsaved(prev => [...prev, property]);
        }
      } else {
        const errorData = await response.json();
        console.log(`Failed to ${isCurrentlySaved ? 'unsave' : 'save'} property:`, errorData.message);
        toast.error(`Failed to ${isCurrentlySaved ? 'unsave' : 'save'} property`);
      }
    } catch (error) {
      console.log(`Error ${isCurrentlySaved ? 'unsaving' : 'saving'} property:`, error);
      toast.error(`Error ${isCurrentlySaved ? 'unsaving' : 'saving'} property`);
    }
  };

  const handleDeleteClick = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Please log in to delete saved properties.");
      return;
    }
    try {
      const response = await fetch('/api/saved/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, property }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Property removed successfully");
        setsaved(prev => prev.filter(item => item.id !== property.id));
        if (isSavedPage) {
          router.refresh();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to delete property:', errorData.message);
        toast.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  return (
    <div
      className="property-card cursor-pointer  bg-white/10 backdrop-blur-2xl rounded-lg overflow-hidden shadow-property hover:shadow-property-hover transition-shadow duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block">
        <div className="relative">
          <Image
            src={image}
            alt={property?.title}
            className="w-full h-52 object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale-105' : 'scale-100' }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 transition-opacity duration-300" style={{ opacity: isHovered ? 0.3 : 0 }}></div>
          <button
            onClick={property && handleSaveClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-300 z-10 ${saved.some(savedProp => savedProp?.id === property?.id)
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            <Heart
              size={18}
              className='cursor-pointer hover:scale-115 duration-200'
              fill={saved.some(savedProp => savedProp?.id === property?.id) ? 'white' : 'none'}
              stroke={saved.some(savedProp => savedProp?.id === property?.id) ? 'none' : 'currentColor'}
            />
          </button>
          {isSavedPage && (
            <button
              onClick={handleDeleteClick}
              className="absolute top-3 left-3 p-2 rounded-full bg-white text-red-500 hover:bg-red-100 transition-colors duration-300 z-10"
            >
              <Trash2 size={18} className='cursor-pointer hover:scale-115 duration-200' />
            </button>
          )}
        </div>

        <div className="p-4 relative">
          <div className="mb-2 text-sm text-gray-500 flex items-center">
            <MapPin size={14} className="mr-1" /> {property?.location}
          </div>

          <h3 className="text-lg font-bold text-white mb-2 truncate">{property?.title}</h3>

          <div className="mb-4">
            <div className="text-sm text-gray-500">Price</div>
            <div className="text-xl font-bold text-primary-800">
              ${property?.price?.toLocaleString()}
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
            <div className="absolute top-4 right-4" onClick={()=>{
              router.push(`/properties/${property.id}`)
            }}>
              <span className="text-blue-400 font-semibold">Bid on it</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PropertyCard;