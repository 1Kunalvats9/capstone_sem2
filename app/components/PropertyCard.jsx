"use client";
import React, { useEffect, useState } from 'react';
import { Bath, Bed, Heart, MapPin, Maximize } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, image,setSelectedProperty=()=>{} }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [savedProps, setsavedProps] = useState([])
  const [email, setemail] = useState("")
  const [saved, setsaved] = useState([])
  const router = useRouter()
  const handleSaveClick = async () => {
    const propertyId = property.id;
    const email = localStorage.getItem("email");
    if (!email) {
      router.push('/login')
    }
    try {
      const response = await fetch('/api/properties/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, property }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        toast.success("Property saved successfully")
        setsavedProps(prev => [...prev, propertyId]);
      } else {
        const errorData = await response.json();
        console.error('Failed to save property:', errorData.message);
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  return (
    <div
      className="property-card cursor-pointer  bg-white/10 backdrop-blur-2xl rounded-lg overflow-hidden shadow-property hover:shadow-property-hover transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block">
        <div className="relative">
          <Image
            src={image}
            alt={property.title}
            className="w-full h-52 object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale-105' : 'scale-100' }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 transition-opacity duration-300" style={{ opacity: isHovered ? 0.3 : 0 }}></div>
          <button
            onClick={handleSaveClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-300 ${saved && saved.includes(property.id)
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            <Heart
              size={18}
              className='cursor-pointer hover:scale-115 duration-200'
              fill={saved && saved.includes(property.id) ? 'white' : 'none'}
              stroke={saved && saved.includes(property.id) ? 'none' : 'currentColor'}
            />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-2 text-sm text-gray-500 flex items-center">
            <MapPin size={14} className="mr-1" /> {property.location}
          </div>

          <h3 className="text-lg font-bold text-white mb-2 truncate">{property.title}</h3>

          <div className="mb-4">
            <div className="text-sm text-gray-500">Price</div>
            <div className="text-xl font-bold text-primary-800">
              ${property.price?.toLocaleString()}
            </div>
          </div>

          <div className="flex justify-between text-gray-500 border-t pt-4 text-sm">
            <div className="flex items-center">
              <Bed size={16} className="mr-1" />
              <span>{property.bedrooms || 0} beds</span>
            </div>
            <div className="flex items-center">
              <Bath size={16} className="mr-1" />
              <span>{property.bathrooms || 0} baths</span>
            </div>
            <div className="flex items-center">
              <Maximize size={16} className="mr-1" />
              <span>{property.sizeSqFt ||0} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;