"use client"
import { useState } from "react";
import Navbar from "./components/Navbar";
import { Check, ChevronDown, HomeIcon } from "lucide-react";
import Footer from "./components/Footer";
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <>
      <div className="bg-white relative w-screen h-[90vh] ">
        <div className="absolute top-0 z-1 w-screen h-[90vh] bg-black opacity-45"></div>
        <Navbar cs="fixed" />
        <img
          src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Luxury Property"
          className="w-[100vw] h-[90vh] absolute top-0  object-cover"
        />
        <div className="z-20 absolute top-0 w-full flex-col h-full lg:px-28 md:px-16 px-10 items-start flex justify-center bg-transparent text-black font-bold">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
              Find Your Dream Property Through Exclusive Auctions
            </h1>
            <p className="text-xl text-white mb-8 font-medium tracking-wider animate-fade-in">
              Discover luxury properties and participate in competitive bidding for your next home or investment opportunity.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#1C4ED8] rounded-lg font-medium hover:scale-102 tracking-wider cursor-pointer hover:bg-blue-800 transition-all duration-150 px-4 py-3 text-white">Search Properties</button>
            <button className="bg-white px-4 rounded-lg hover:scale-102 cursor-pointer hover:bg-gray-200 transition-all duration-200 py-3 text-black font-light">{isLoggedIn ? "Go to Bid" : "Sign Up to Bid"}</button>
          </div>
          <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce bg-transparent">
            <a href="#featured" className="p-2 rounded-full bg-white/20 backdrop-blur-2xl">
              <ChevronDown color="#fff" size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="w-[100vw] min-h-screen bg-white">
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#DBE9FE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <HomeIcon size={28} className="text-[#1C4ED8]" />
                </div>
                <h3 className="text-xl text-black font-semibold mb-3">Browse Properties</h3>
                <p className="text-gray-600">
                  Explore our curated selection of premium properties available for auction or direct purchase.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#DBE9FE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#1C4ED8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-700">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black">Place Your Bid</h3>
                <p className="text-gray-600">
                  Participate in property auctions with transparent bidding and real-time updates on current status.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#DBE9FE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-[#1C4ED8]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black">Secure Your Property</h3>
                <p className="text-gray-600">
                  Win the auction and our team will guide you through the closing process with expert support.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </>
  );
}
