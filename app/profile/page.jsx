"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import PropertyCard from '../components/PropertyCard'
import images from "@/lib/img"
import { User } from 'lucide-react'

const page = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  useEffect(() => {
    const email = localStorage.getItem("email")
    setEmail(email)
    if (!email) {
      router.push('/')
    }
    const getUser = async () => {
      const res = await fetch("/api/get-user", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        toast.error("User not found")
      }
      const data = await res.json()
      setUser(data.user)
    }
    getUser()
  }, [email])
  return (
    <div className='w-full min-h-screen px-10 md:px-16 lg:px-28 py-5'>
      <Navbar />
      <div className='w-full grid gap-10 grid-cols-1 md:grid-cols-4 my-16'>
        {user &&
          <>
            <div className='border gap-6 border-white flex items-center rounded-2xl h-fit tracking-wide col-span-2 px-8 py-5'>
              <User size="100px" />
              <div>
                <h1 className=' bg-clip-text text-transparent bg-gradient-to-r text-2xl font-bold from-[#36BCF6] to-[#8FCEF9]'>Name: <span className='text-white font-medium'>{user.userName}</span></h1>
                <h1 className='bg-clip-text text-transparent bg-gradient-to-r text-2xl font-bold from-[#36BCF6] to-[#8FCEF9]'>Email: <span className='text-white font-medium'>{user.email}</span></h1>
                <h1 className=' bg-clip-text text-transparent bg-gradient-to-r text-2xl font-bold from-[#36BCF6] to-[#8FCEF9]'>Saved Properties: <span className='text-white font-medium'>{user.saved.properties.length}</span></h1>
                <button className='px-3 py-2 bg-red-600 text-white mt-10 cursor-pointer rounded-xl' onClick={()=>{
                  localStorage.removeItem("email")
                  localStorage.removeItem("token")
                  router.push('/home')
                  toast.success("User logged out successfully")
                }}>Logout</button>
              </div>
            </div>
            <div className='rounded-2xl grid grid-cols-1 gap-10 col-span-2 md:px-8 '>
              {
                user.saved.properties.map((item, idx) => {
                  return <PropertyCard key={idx} property={item} image={images[idx % images.length]} />
                })
              }
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default page
