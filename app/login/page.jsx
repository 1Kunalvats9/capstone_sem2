"use client"
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const page = () => {
  const [openSignUp, setOpenSignUp] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, seterror] = useState("")
  const router= useRouter()
  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })
      const result = await res.json()
      if (res.ok) {
        console.log('User created:', result.user);
        toast.success("Logged in Successfully")
        router.push('/login');
      } else {
        console.error('Error in registering the user', result.error);
      }


    } catch (err) {
      console.log("Error while signing up", err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/login',{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password }),
      })
      const response = await res.json()
      if(!res.ok){
        seterror(response.error)
      }else{
        localStorage.setItem("token",response.token)
        localStorage.setItem("email",email)
        alert("User logged in successfully")
        router.push("/dashboard")
      }
    } catch (err) {
      console.log("Error while signing up", err)
    }
  }

  return (
    <div className='w-full px-10 md:px-16 lg:px-28 py-4 min-h-screen'>
      <Navbar />
      <div className='w-full min-h-[80vh] my-16 lg:px-28 md:px-16 px-10 mb-10'>
        <div className="flex h-[700px] w-full">
          <div className="w-full rounded-xl hidden md:inline-block">
            <img className="h-full object-cover rounded-xl" src="https://www.adanirealty.com/-/media/project/realty/blogs/types-of-residential-properties.ashx" alt="leftSideImage" />
          </div>

          <div className="w-full flex flex-col items-center justify-center">

            {
              openSignUp ?
                <>
                  <form className="md:w-96 w-80 text-white flex flex-col items-center justify-center" onSubmit={handleSignUp}>
                    <h2 className="text-4xl  font-medium">Sign Up</h2>
                    <p className="text-sm mt-3">Welcome! Please Signup to continue</p>

                    <div className="flex items-center mt-10 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={11} fill="#6B7280" viewBox="0 0 448 512">
                        <path fill="#74829a" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                      </svg>
                      <input type="text" placeholder="Full Name" className="bg-transparent text-white placeholder-gray-500/80 outline-none text-sm w-full h-full" required onChange={(e) => { setName(e.target.value) }} />
                    </div>


                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" />
                      </svg>
                      <input type="email" placeholder="Email id" className="bg-transparent text-white placeholder-gray-500/80 outline-none text-sm w-full h-full" required onChange={(e) => { setEmail(e.target.value) }} />
                    </div>

                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
                      </svg>
                      <input type="password" placeholder="Password" className="bg-transparent text-white placeholder-gray-500/80 outline-none text-sm w-full h-full" required onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-[#0084C7] hover:opacity-90 transition-opacity cursor-pointer">
                      Sign Up
                    </button>
                    <p className="text-gray-500/90 text-sm mt-4">Already have an account? <a className="text-indigo-400 hover:underline" onClick={() => { setOpenSignUp(false) }} href="#">Login </a></p>
                  </form>
                </> :
                <>
                  <form className="md:w-96 w-80 flex flex-col text-white items-center justify-center" onSubmit={handleLogin}>
                    <h2 className="text-4xl font-medium">Log in</h2>
                    <p className="text-sm mt-3">Welcome back! Please log in to continue</p>

                    <div className="flex items-center mt-10 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" />
                      </svg>
                      <input type="email" placeholder="Email id" className="bg-transparent text-white placeholder-gray-500/80 outline-none text-sm w-full h-full" required onChange={(e) => { setEmail(e.target.value) }} />
                    </div>

                    <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
                      </svg>
                      <input type="password" placeholder="Password" className="bg-transparent text-white placeholder-gray-500/80 outline-none text-sm w-full h-full" required onChange={(e) => { setPassword(e.target.value) }} />
                    </div>

                    <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                      <div className="flex items-center gap-2">
                        <input className="h-5" type="checkbox" id="checkbox" />
                        <label className="text-sm" htmlFor="checkbox">Remember me</label>
                      </div>
                      <a className="text-sm underline" href="#">Forgot password?</a>
                    </div>
                    {error && <p className='text-red-500'>{error}</p>}

                    <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-[#0084C7] hover:opacity-90 transition-opacity cursor-pointer">
                      Login
                    </button>
                    <p className="text-gray-500/90 text-sm mt-4">Don’t have an account? <a className="text-blue-300 hover:underline" onClick={() => { setOpenSignUp(true) }} href="#">Sign up</a></p>
                  </form>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
