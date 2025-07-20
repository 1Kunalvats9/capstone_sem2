"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { LogOut, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { MenuIcon, User } from 'lucide-react'

const Navbar = ({ openMenu, setOpenMenu }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    useEffect(() => {
        const email = localStorage.getItem("email")
        if (email) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [])
    const router = useRouter();
    const handleLogin = () => {
        router.push('/login')
    }
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        toast.success("Logged out successfully!")
        router.push('/')
    }
    return (
        <nav className='w-full flex mt-6 items-center justify-between'>
            <h1 className='bg-clip-text text-transparent bg-gradient-to-r text-3xl font-bold from-[#4C53FB] to-[#6C45FA]'>PropBid</h1>
            <ul className='text-white hidden md:flex list-none items-center gap-5'>
                <li className='cursor-pointer hover:text-[#4C53F2] duration-150' onClick={() => { router.push('/home') }}>Home</li>
                <li className='cursor-pointer hover:text-[#4C53F2] duration-150' onClick={() => { router.push(isLoggedIn ? "/properties" : "/login") }}>Properties</li>
                {
                    isLoggedIn &&
                    <>
                        <li className='cursor-pointer hover:text-[#4C53FB] duration-150' onClick={() => { router.push("/profile") }}>My Profile</li>
                        <li className='cursor-pointer hover:text-[#4C53FB] duration-150' onClick={() => { router.push("/add-property") }}>Add Property</li>
                    </>
                }
            </ul>
            <div className='md:flex items-center hidden gap-4'>
                {
                    isLoggedIn ?
                        <div className='flex items-center justify-center border cursor-pointer hover:bg-white hover:text-black duration-200 border-white rounded-full p-1' onClick={()=>{
                            router.push("/profile")
                        }}>
                            <User />
                        </div> :
                        <>
                            <button onClick={handleLogin} className='bg-[#2D3748] text-white px-4 py-1 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>Login</button>
                            <button onClick={handleLogin} className='bg-[#4C53F2] text-white px-4 py-1 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>Register</button>
                        </>
                }
            </div>
            {openMenu ? <X className='md:hidden' onClick={() => { setOpenMenu(!openMenu) }} /> :
                <MenuIcon className='md:hidden' onClick={() => { setOpenMenu(!openMenu) }} />
            }

        </nav>
    )
}

export default Navbar
