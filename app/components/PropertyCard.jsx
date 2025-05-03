// components/PropertyCard.js
"use client";
import React, { useState } from 'react';
import { Bath, Bed, Heart, MapPin, Maximize } from 'lucide-react';
import Link from 'next/link';

const PropertyCard = ({ property }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveClick = () => {
    setSaved(!saved);
    // Implement your save logic here
  };

  return (
    <div
      className="property-card bg-gray-100 rounded-lg overflow-hidden shadow-property hover:shadow-property-hover transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-52 object-cover transition-transform duration-300"
            style={{ transform: isHovered ? 'scale-105' : 'scale-100' }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 transition-opacity duration-300" style={{ opacity: isHovered ? 0.3 : 0 }}></div>
          <button
            onClick={handleSaveClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-300 ${
              saved ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart size={18} fill={saved ? 'white' : 'none'} stroke={saved ? 'none' : 'currentColor'} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-2 text-sm text-gray-500 flex items-center">
            <MapPin size={14} className="mr-1" /> {property.location}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{property.title}</h3>

          <div className="mb-4">
            <div className="text-sm text-gray-500">Price</div>
            <div className="text-xl font-bold text-primary-800">
              ${property.price?.toLocaleString()}
            </div>
          </div>

          <div className="flex justify-between text-gray-700 border-t pt-4 text-sm">
            <div className="flex items-center">
              <Bed size={16} className="mr-1" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <Bath size={16} className="mr-1" />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <Maximize size={16} className="mr-1" />
              <span>{property.sizeSqFt} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;