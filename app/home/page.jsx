"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { ArrowRight, DollarSign, HandshakeIcon, Home, LogIn, LogOut, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import images from "@/lib/img"
import PropertyCard from '../components/PropertyCard'
import Footer from '../components/Footer'

const page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState(false)
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoggedIn(false)
    } else {
      setIsLoggedIn(true)
    }
    
    fetchFeaturedProperties();
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties/all?limit=4');
      if (response.ok) {
        const data = await response.json();
        setFeaturedProperties(data.properties || []);
      } else {
        console.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedProperties = async () => {
    try {
      const response = await fetch('/api/properties/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 50 }),
      });
      
      if (response.ok) {
        fetchFeaturedProperties();
      }
    } catch (error) {
      console.error('Error seeding properties:', error);
    }
  };

  return (
    <div
      className={`w-full px-10 md:px-16 lg:px-28 py-4 transition-opacity min-h-screen duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} openMenu={openMenu} setOpenMenu={setOpenMenu} />
      {
        openMenu &&
        <div className='w-full left-0 top-0 mt-20 h-screen z-10 absolute duration-200 transition-all bg-white/10 backdrop-blur-2xl space-y-4 px-10 py-10'>
          <a href="/home\" className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'><Home />Home</a>
          <a href="/home" className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'><Home /> Properties</a>
          <a href="/home" className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'>{isLoggedIn ? <><LogOut />Logout</> : <><LogIn />Login</>}</a>
          {
            !isLoggedIn && <button className='w-full bg-[#0084C7] text-white px-4 py-1 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>Register</button>
          }
        </div>
      }
      <section className="relative rounded-2xl my-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Luxury Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/25"></div>
        </div>

        <div className="relative px-6 py-24 sm:px-12 md:py-32 lg:py-40 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Find Your Perfect Property at the Perfect Price
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-xl">
            Browse exclusive properties and place your bid today. Transparent bidding ensures you only pay what you're willing to.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button onClick={() => { router.push("/properties") }} className='bg-[#0084C7] text-white px-4 py-2 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>
              Explore Properties
            </button>
            <button onClick={() => { router.push(isLoggedIn ? "/profile" : "/login") }} className='bg-[#2D3748] text-white px-4 py-2 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>
              {isLoggedIn ? "Go to Profile" : "Create Account"}
            </button>
          </div>
        </div>
      </section>
      <div className='w-full flex flex-col items-center gap-2 mt-10'>
        <h1 className='text-white text-3xl font-semibold tracking-wide'>How it Works?</h1>
        <p className='text-gray-500/80'>Save and Bid on your favourite properties and make them yours.</p>
        <div className="grid grid-cols-1 my-10 md:grid-cols-3 gap-8">
          <div className="glass p-6 bg-[#14161A] rounded-xl text-center">
            <div className="bg-[#0084C7] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Search className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Find Properties</h3>
            <p className="text-gray-400">
              Browse our curated selection of high-quality properties from around the world.
            </p>
          </div>

          <div className="glass p-6 rounded-xl bg-[#14161A] text-center">
            <div className="bg-[#0084C7] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <DollarSign className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Place Your Bid</h3>
            <p className="text-gray-400">
              Set your price and compete with other bidders in a transparent auction process.
            </p>
          </div>

          <div className="glass p-6 rounded-xl bg-[#14161A] text-center">
            <div className="bg-[#0084C7] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <HandshakeIcon className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Close the Deal</h3>
            <p className="text-gray-400">
              Win the auction and complete the purchase with our secure transaction process.
            </p>
          </div>
        </div>
      </div>
      <div className='w-full my-10'>
        <div className='w-full flex items-center justify-between'>
          <h1 className='text-xl md:text-3xl font-semibold text-white'>Featured Properties</h1>
          <div className="flex gap-4">
            {featuredProperties.length === 0 && (
              <button 
                onClick={seedProperties}
                className='text-blue-300 cursor-pointer text-md md:text-xl hover:underline'
              >
                Load Sample Properties
              </button>
            )}
            <a href="/properties" className='text-blue-300 cursor-pointer text-md md:text-xl'>View all</a>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:gap-6 md:grid-cols-3 my-5 lg:grid-cols-4 place-items-center'>
            {featuredProperties.length > 0 ? (
              featuredProperties.map((item, idx) => {
                const propertyForCard = {
                  id: item._id,
                  title: item.title,
                  location: `${item.location.city}, ${item.location.state}`,
                  price: item.price,
                  bedrooms: item.bedrooms,
                  bathrooms: item.bathrooms,
                  sizeSqFt: item.sizeSqFt
                };
                return (
                  <PropertyCard 
                    property={propertyForCard} 
                    key={item._id} 
                    image={images[idx % images.length]} 
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-400 text-lg mb-4">No properties available yet.</p>
                <button 
                  onClick={seedProperties}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Load Sample Properties
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <section className="bg-[#14161A] my-10 p-12 rounded-xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Property?</h2>
        <p className="text-xl text-[#D1D5DB] mb-8 max-w-2xl mx-auto">
          Join PropertyBid today and start bidding on exclusive properties or list your own for auction.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => router.push("/login")} className='bg-[#0084C7] text-white px-4 py-2 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>
            Sign Up Now
          </button>
          <button onClick={() => router.push("/properties")} className='bg-[#2D3748] text-white px-4 py-2 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>
            Browse Properties
          </button>
        </div>
      </section>
    </div>
  )
}

export default page