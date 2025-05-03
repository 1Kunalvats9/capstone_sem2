"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'
import { generateProperties } from '@/lib/generateProperties'
import { Heading1 } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'

const page = () => {
  const router = useRouter()
  const [properties, setproperties] = useState([])
  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }
  useEffect(() => {
    const getProperties = async()=>{
      const properties = await generateProperties()
      setproperties(properties)
      console.log(properties)
    }
    getProperties()
  },[])
  return (
    <>
      <Navbar cs="" isLoggedIn={true} />
      <div className='w-full min-h-screen text-black mt-20 lg:px-28 md:px-16 px-10'>
        <div className='grid md:grid-cols-3 grid-cols-2 gap-10'>
        {
          properties.length >0 ? (properties.map((item,idx)=>{
            return <PropertyCard key={idx} property={item} />
          })):<h1 className='text-3xl font-bold'>Loading.....</h1>
        }
        </div>
      </div>
    </>
  )
}

export default page
