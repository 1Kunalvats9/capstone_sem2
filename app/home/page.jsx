"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { ArrowRight, DollarSign, HandshakeIcon, Home, LogIn, LogOut, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
const page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoggedIn(false)
    } else {
      setIsLoggedIn(true)
    }
  }, [])
  return (
    <div className='w-full px-10 md:px-16 lg:px-28 py-4 min-h-screen'>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} openMenu={openMenu} setOpenMenu={setOpenMenu} />
      {
        openMenu &&
        <div className='w-full left-0 top-0 mt-20 h-screen z-10 absolute duration-200 transition-all bg-white/10 backdrop-blur-2xl space-y-4 px-10 py-10'>
          <a href="/home" className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'><Home />Home</a>
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
            <button onClick={()=>{router.push("/properties")}} className='bg-[#0084C7] text-white px-4 py-2 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>
              Explore Properties
            </button>
            <button onClick={()=>{router.push(isLoggedIn ? "/profile":"/login")}} className='bg-[#2D3748] text-white px-4 py-2 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>
              {isLoggedIn ? "Go to Profile":"Create Account"}
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
              <DollarSign  className="text-white text-2xl" />
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
        <a href="/properties" className='text-blue-300 cursor-pointer text-md md:text-xl'>View all</a>
        </div>
      </div>
    </div>
  )
}

export default page
