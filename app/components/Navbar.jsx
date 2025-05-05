"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { LogOut, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { MenuIcon } from 'lucide-react'

const Navbar = ({isLoggedIn,setIsLoggedIn, openMenu, setOpenMenu }) => {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter();
  const handleLogin = ()=>{
    router.push('/login')
  }
  const handleLogout = ()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    toast.success("Logged out successfully!")
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
    <nav className='w-full flex top-0 items-center justify-between'>
      <h1 className='bg-clip-text text-transparent bg-gradient-to-r text-3xl font-bold from-[#36BCF6] to-[#8FCEF9]'>PropBid</h1>
      <ul className='text-white hidden md:flex list-none items-center gap-5'>
        <li className='cursor-pointer hover:text-[#38BDF9] duration-150' onClick={()=>{router.push('/home')}}>Home</li>
        <li className='cursor-pointer hover:text-[#38BDF9] duration-150' onClick={()=>{router.push(isLoggedIn ? "/properties":"/login")}}>Properties</li>
        {
          isLoggedIn && 
          <>
            <li className='cursor-pointer hover:text-[#38BDF9] duration-150'></li>
            <li className='cursor-pointer hover:text-[#38BDF9] duration-150'></li>
          </>
        }
      </ul>
      <div className='md:flex items-center hidden gap-4'>
        {
          isLoggedIn  ?
          <button className='flex items-center gap-2' onClick={handleLogout}><LogOut />Logout</button>:
          <>
            <button className='bg-[#2D3748] text-white px-4 py-1 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>Login</button>
            <button className='bg-[#0084C7] text-white px-4 py-1 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>Register</button>
          </>
        }
      </div>
      {openMenu ? <X className='md:hidden' onClick={()=>{setOpenMenu(!openMenu)}} /> :
        <MenuIcon className='md:hidden' onClick={()=>{setOpenMenu(!openMenu)}}/>
      }
      
    </nav>  
  )
}

export default Navbar
