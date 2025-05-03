"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Navbar = ({ cs, isLoggedIn }) => {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();
  const handleLogin = ()=>{
    router.push('/login')
  }
  const handleLogout = ()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    router.push('/')
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  })
  return (
    <nav className={`${cs} w-full z-50 flex items-center justify-between lg:px-28 md:px-16 px-10 py-5 transition-all duration-300 shadow-sm ${scrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
      <h1 className='text-blue-800 w-fit font-bold text-3xl'>PropBid</h1>
      <div className='flex items-center gap-10'>
        <ul className='items-center gap-10 hidden md:flex text-lg text-black font-medium'>
          <li className='cursor-pointer hover:underline hover:scale-105 duration-200 underline-offset-4 transition-all'>Home</li>
          <li className='cursor-pointer hover:underline hover:scale-105 duration-200 underline-offset-4 transition-all'>Properties</li>
          <li className='cursor-pointer hover:underline hover:scale-105 duration-200 underline-offset-4 transition-all'>Search</li>
        </ul>
        <button className={`flex ${isLoggedIn ? "bg-red-500" : "bg-blue-600"} hover:scale-105 duration-200 rounded-lg text-center cursor-pointer text-white items-center gap-2`} onClick={isLoggedIn ? handleLogout:handleLogin}>
          <a className="bg-primary-700 z-20 text-white hover:bg-primary-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center" href="/login">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in mr-1"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg> {isLoggedIn ? "Logout" : "Login"}</a>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
