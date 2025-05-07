"use client"
import Navbar from '@/app/components/Navbar'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const page = () => {
  const params = useParams()
  const router = useRouter()
  const [property, setproperty] = useState(null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      router.push("/");
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    const { title } = params;
    const fetchProperty = async () => {
      if (email && title) { 
        const res = await fetch("/api/properties/get-property", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, title }),
        });
        if (!res.ok) {
          toast.error("Could not find property");
        }
        const data = await res.json();
        console.log(title,typeof title)
        console.log(data)
        setproperty(data.property);
      }
    };

    fetchProperty();
  }, [params, email, router]); 

  return (
    <div className='w-full px-10 md:px-16 lg:px-28 py-4 min-h-screen'>
      <Navbar cs="" isLoggedIn={true} />
      <div className='w-full min-h-screen mt-40 lg:px-28 md:px-16 px-10 text-black'>
        <h1>This is property website</h1>
        {property && <h1>{property.title}</h1>}
      </div>
    </div>
  );
};

export default page;