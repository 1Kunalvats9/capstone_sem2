"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [radius, setRadius] = useState(0);
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => {
      setRadius(Math.max(window.innerWidth, window.innerHeight));
    }, 1200);
    const goHome = setTimeout(() => {
      router.push("/home")
    }, 2200);
    return () => {
      clearTimeout(timer)
      clearTimeout(goHome)
    };
  }, []);

  return (
    <div className='w-full h-screen bg-blue-400 text-white flex items-center justify-center overflow-hidden'>
      <h1 className='text-8xl font-bold z-10'>PropBid</h1>
      <div
        className={`rounded-full bg-black z-10 absolute transition-all duration-1000 ease-in-out`}
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          transform: `translate(-50%, -50%)`,
          top: '50%',
          left: '50%',
        }}
      >
      </div>
    </div>
  );
};

export default Page;