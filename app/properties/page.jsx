"use client"
import React, { useEffect,useState } from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'
import { generateProperties } from '@/lib/generateProperties'
import images from "@/lib/img"
import Image from 'next/image'
import PropertyCard from '../components/PropertyCard'
import toast from 'react-hot-toast'

const page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [openMenu, setOpenMenu] = useState(false)
  const [properties, setproperties] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProperty, setSelectedProperty] = useState(null)
  const router = useRouter()
  useEffect(()=>{
    const prop = JSON.stringify(selectedProperty) 
    if(selectedProperty!=null){
      router.push(`/properties/${prop}`)
    }
  },[selectedProperty])
  useEffect(()=>{
    const email = localStorage.getItem("email")
    const setProps = async () => {
          const properties = await generateProperties();
          setproperties(properties);
        };
        setProps();
    if(!email){
      setIsLoggedIn(false)
      toast.error("Please login first")
      router.push("/home")
    }else{
      setIsLoggedIn(true)
    }
  },[])
  return (
    <div className='w-full min-h-screen px-10 md:px-16 lg:px-28 py-4'>
      <Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} openMenu={openMenu} setOpenMenu={setOpenMenu}/>
      {
        openMenu &&
        <div className='w-full left-0 top-0 mt-20 h-screen z-10 absolute duration-200 transition-all bg-white/10 backdrop-blur-2xl space-y-4 px-10 py-10'>
          <a onClick={()=>{router.push("/home")}} className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'><Home />Home</a>
          <a onClick={()=>{router.push("/properties")}} className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'><Home /> Properties</a>
          <a onClick={()=>{router.push("/home")}} className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'>{isLoggedIn ? <><LogOut />Logout</> : <><LogIn />Login</>}</a>
          {
            !isLoggedIn && <button className='w-full bg-[#0084C7] text-white px-4 py-1 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>Register</button>
          }
        </div>
      }
      <input type="text" placeholder='Search for properties by name or location....' className='w-full border border-gray-500 rounded-lg outline-none placeholder:font-light placeholder-gray-400 my-16 px-3 py-2' onChange={(e)=>{setSearchQuery(e.target.value)}} />
      <div className='w-full grid gap-4 grid-cols-2 my-10 md:grid-cols-3'>
        {
          searchQuery ? 
          (
            properties.filter((item,idx)=>{
              return item.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase().trim())|| item.location.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase().trim())
            }).map((item,idx)=>{
              return <PropertyCard property={item} key={idx} image={images[idx % images.length]} setSelectedProperty={setSelectedProperty}/>
            })
          ):
          properties ? (
            (
              properties.map((item,idx)=>{
                return <PropertyCard property={item} key={idx} image={images[idx % images.length]} setSelectedProperty={setSelectedProperty} />
              })
            )
          ):<p>Loading.....</p>
        }
      </div>
    </div>
  )
}

export default page
