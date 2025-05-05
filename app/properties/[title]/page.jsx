"use client"
import Navbar from '@/app/components/Navbar'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { ArrowLeft } from 'lucide-react'

const page = () => {
  const params = useParams()
  const router = useRouter()
  const { title } = params
  return (
    <div className='top-0 z-1 w-screen'>
      <Navbar cs="top-0 fixed" isLoggedIn={true} />
      <div className='w-full min-h-screen mt-40 lg:px-28 md:px-16 px-10 text-black'>
        <button className='flex top-20 absolute items-center gap-2 rounded-lg bg-blue-600 text-white px-2 py-2 cursor-pointer hover:bg-blue-700 duration-200' onClick={()=>{router.push('/dashboard')}}>
          <ArrowLeft />
          Go to Home
        </button>
        <h1>This is property webste</h1>
        <h2>The title is {title.split("%20").join(" ")}</h2>
      </div>
    </div>
  )
}

export default page
