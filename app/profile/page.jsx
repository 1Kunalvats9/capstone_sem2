"use client"
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PropertyCard from '../components/PropertyCard';
import images from "@/lib/img";

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userEmail = localStorage.getItem("email");
        setEmail(userEmail);

        if (!userEmail) {
            router.push('/');
            return;
        }

        const getUser = async () => {
            try {
                const res = await fetch("/api/get-user", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail }),
                });

                if (!res.ok) {
                    toast.error("User not found");
                    router.push('/');
                    return;
                }

                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                toast.error("Failed to fetch user data");
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [router, email]);

    return (
        <div className="w-full min-h-screen  px-10 md:px-16 lg:px-28 py-4 bg-black text-white">
            <Navbar />
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-8 text-center text-white">
                    Your Profile
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                        <div className="col-span-2 grid grid-cols-1 gap-6">

                        </div>
                    </div>
                ) : user ? (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

                        <div className="col-span-2 bg-gray-800 h-fit rounded-xl p-6 shadow-lg border border-gray-700">
                            <div className="flex flex-col  items-start gap-6">

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-blue-400">
                                        Name: <span className="text-white font-medium">{user.userName}</span>
                                    </h2>
                                    <p className="text-gray-400">
                                        Email: <span className="text-white font-medium">{user.email}</span>
                                    </p>
                                    <p className="text-gray-400">
                                        Saved Properties: <span className="text-white font-medium">{user.saved.properties.length}</span>
                                    </p>
                                    <button
                                        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                                        onClick={() => {
                                            localStorage.removeItem("email");
                                            localStorage.removeItem("token");
                                            router.push('/home');
                                            toast.success("Logged out successfully");
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div className="col-span-3 grid grid-cols-1 gap-6">
                            {user.saved.properties.length > 0 ? (
                                user.saved.properties.map((item, index) => {
                                    return <PropertyCard key={index} property={item} image={images[index % images.length]} />;
                                })
                            ) : (
                                <div className="bg-gray-800 rounded-xl border border-gray-700">
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">You have not saved any properties yet.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        Failed to load user data.  Please check back later.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

