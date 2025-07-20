"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import {
    ArrowRight,
    DollarSign,
    HandshakeIcon,
    Home,
    LogIn,
    ClockIcon,
    LogOut,
    Search,
    Clock,
    Gavel,
    TrendingUp, IndianRupee, PlayCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import PropertyCard from '@/app/components/PropertyCard'

// --- HELPER COMPONENTS (MOVED OUTSIDE) ---

// Countdown Timer Component
const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!endTime) return;
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endTime).getTime();
            const distance = end - now;

            if (distance > 0) {
                const hours = Math.floor(distance / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft('Ended');
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return <p className="text-red-400 font-medium text-sm">{timeLeft || '...'}</p>;
};

// Countdown to Start Component
const CountdownToStart = ({ startTime }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!startTime) return;
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const start = new Date(startTime).getTime() - (24 * 60 * 60 * 1000); // 24 hours before end
            const distance = start - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                setTimeLeft(`${days}d ${hours}h`);
            } else {
                setTimeLeft('Started');
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    return timeLeft || '...';
};


// --- MAIN PAGE COMPONENT ---

const images = [
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
];

const Page = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()
    const [openMenu, setOpenMenu] = useState(false)
    const [featuredProperties, setFeaturedProperties] = useState([])
    const [biddingProperties, setBiddingProperties] = useState([])
    const [upcomingBids, setUpcomingBids] = useState([])
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setIsLoggedIn(false)
        } else {
            setIsLoggedIn(true)
        }

        fetchFeaturedProperties();
    }, [])

    const fetchFeaturedProperties = async () => {
        try {
            setLoading(true);
            const [featuredRes, biddingRes] = await Promise.all([
                fetch('/api/properties/all?limit=4'),
                fetch('/api/properties/all?limit=20')
            ]);

            if (featuredRes.ok) {
                const data = await featuredRes.json();
                setFeaturedProperties(data.properties || []);
            } else {
                console.error(`Failed to fetch featured properties. Status: ${featuredRes.status}`);
                setFeaturedProperties([]);
            }

            if (biddingRes.ok) {
                const biddingData = await biddingRes.json();
                const allProperties = biddingData.properties || [];

                const activeBidding = allProperties.filter(prop =>
                    prop.isBiddingActive &&
                    prop.biddingEndsAt &&
                    new Date(prop.biddingEndsAt) > new Date()
                );

                const upcoming = activeBidding.filter(prop =>
                    new Date(prop.biddingEndsAt) > new Date(Date.now() + 24 * 60 * 60 * 1000)
                );

                const current = activeBidding.filter(prop =>
                    new Date(prop.biddingEndsAt) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
                );

                setBiddingProperties(current.slice(0, 6));
                setUpcomingBids(upcoming.slice(0, 4));
            } else {
                console.error(`Failed to fetch bidding properties. Status: ${biddingRes.status}`);
                setBiddingProperties([]);
                setUpcomingBids([]);
            }
        } catch (error) {
            console.error('An error occurred while fetching properties:', error);
            setFeaturedProperties([]);
            setBiddingProperties([]);
            setUpcomingBids([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`w-full px-10 md:px-16 lg:px-28 py-4 transition-opacity min-h-screen duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            {
                openMenu &&
                <div className='w-full left-0 top-0 mt-20 h-screen z-10 absolute duration-200 transition-all bg-white/10 backdrop-blur-2xl space-y-4 px-10 py-10'>
                    <a href="/home" className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'><Home />Home</a>
                    <a href="/properties" className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'><Home /> Properties</a>
                    <a href="/login" className='flex items-center gap-2 hover:text-[#38BDF9] duration-150'>{isLoggedIn ? <><LogOut />Logout</> : <><LogIn />Login</>}</a>
                    {
                        !isLoggedIn && <button onClick={() => router.push('/register')} className='w-full bg-[#0084C7] text-white px-4 py-1 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>Register</button>
                    }
                </div>
            }
            <section className="relative rounded-2xl my-16 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Luxury Home"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/50"></div>
                </div>

                <div className="relative px-6 py-24 sm:px-12 md:py-32 lg:py-40 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text leading-tight">
                        Find Your Perfect Property at the Perfect Price
                    </h1>
                    <p className="mt-6 text-xl text-slate-300 max-w-xl font-light">
                        Browse exclusive properties and place your bid today. Transparent bidding ensures you only pay what you're willing to.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button onClick={() => { router.push("/properties") }} className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 text-md rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300'>
                            Explore Properties
                        </button>
                        <button onClick={() => { router.push(isLoggedIn ? "/profile" : "/login") }} className='glass-effect text-white px-6 py-3 text-md rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300'>
                            {isLoggedIn ? "Go to Profile" : "Create Account"}
                        </button>
                    </div>
                </div>
            </section>

            {/* Live Bidding Section */}
            <section className="my-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold gradient-text flex items-center gap-3">
                            <PlayCircle className="text-red-500" />
                            Live Bidding
                        </h2>
                        <p className="text-slate-400 mt-2">Properties with active bidding - place your bid now!</p>
                    </div>
                    <button
                        onClick={() => router.push("/properties")}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                    >
                        View All <ArrowRight size={16} />
                    </button>
                </div>
                {loading ? <div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div></div> : biddingProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {biddingProperties.map((property, idx) => (
                            <div key={property._id} className="bid-card rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                                    <img
                                        src={property.images?.[0] || images[idx % images.length]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 countdown-timer px-3 py-1 rounded-full text-white text-sm font-medium">
                                        <Clock size={14} className="inline mr-1" />
                                        Live
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{property.title}</h3>
                                <p className="text-slate-400 text-sm mb-3">{property.location.city}, {property.location.state}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-slate-400 text-xs">Current Bid</p>
                                        <p className="text-green-400 font-bold text-lg">${property.currentHighestBid?.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-xs">Ends In</p>
                                        <CountdownTimer endTime={property.biddingEndsAt} />
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push(`/properties/${property._id}`)}
                                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                                >
                                    Place Bid
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-400 text-lg">No properties are currently in live bidding.</p>
                    </div>
                )}
            </section>

            {/* Upcoming Bidding Section */}
            <section className="my-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold gradient-text flex items-center gap-3">
                            <ClockIcon className="text-yellow-500" />
                            Upcoming Bidding
                        </h2>
                        <p className="text-slate-400 mt-2">Properties where bidding starts soon</p>
                    </div>
                </div>
                {loading ? <div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500"></div></div> : upcomingBids.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {upcomingBids.map((property, idx) => (
                            <div key={property._id} className="glass-effect rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                                <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                                    <img
                                        src={property.images?.[0] || images[idx % images.length]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-yellow-500 px-2 py-1 rounded-full text-black text-xs font-medium">
                                        Soon
                                    </div>
                                </div>
                                <h4 className="text-white font-medium mb-1 text-sm">{property.title}</h4>
                                <p className="text-slate-400 text-xs mb-2">{property.location.city}</p>
                                <p className="text-yellow-400 text-xs">Bidding starts in: <CountdownToStart startTime={property.biddingEndsAt} /></p>
                                <button
                                    onClick={() => router.push(`/properties/${property._id}`)}
                                    className="w-full mt-3 bg-yellow-500/20 text-yellow-400 py-1 rounded-md text-sm hover:bg-yellow-500/30 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-400 text-lg">No upcoming bids found.</p>
                    </div>
                )}
            </section>

            <div className='w-full flex flex-col items-center gap-2 mt-10'>
                <h1 className='gradient-text text-3xl font-bold tracking-wide'>How it Works?</h1>
                <p className='text-slate-400 font-light'>Save and Bid on your favourite properties and make them yours.</p>
                <div className="grid grid-cols-1 my-10 md:grid-cols-3 gap-8">
                    <div className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <Search className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Find Properties</h3>
                        <p className="text-slate-400 font-light">
                            Browse our curated selection of high-quality properties from around the world.
                        </p>
                    </div>

                    <div className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <IndianRupee className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Place Your Bid</h3>
                        <p className="text-slate-400 font-light">
                            Set your price and compete with other bidders in a transparent auction process.
                        </p>
                    </div>

                    <div className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <HandshakeIcon className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Close the Deal</h3>
                        <p className="text-slate-400 font-light">
                            Win the auction and complete the purchase with our secure transaction process.
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-full my-10'>
                <div className='w-full flex items-center justify-between'>
                    <h1 className='text-xl md:text-3xl font-bold gradient-text'>Featured Properties</h1>
                    <a href="/properties" className='text-blue-400 cursor-pointer text-md md:text-xl hover:text-blue-300 transition-colors'>View all</a>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 gap-6 md:gap-6 md:grid-cols-3 my-5 lg:grid-cols-4 place-items-center'>
                        {featuredProperties.length > 0 ? (
                            featuredProperties.map((item, idx) => {
                                const propertyForCard = {
                                    id: item._id,
                                    title: item.title,
                                    location: `${item.location.city}, ${item.location.state}`,
                                    price: item.price,
                                    bedrooms: item.bedrooms,
                                    bathrooms: item.bathrooms,
                                    sizeSqFt: item.sizeSqFt,
                                    images: item.images
                                };
                                return (
                                    <PropertyCard
                                        property={propertyForCard}
                                        key={item._id}
                                        image={images[idx % images.length]}
                                    />
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <p className="text-gray-400 text-lg">No properties found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <section className="bg-[#14161A] my-10 p-12 rounded-xl text-center">
                <h2 className="text-3xl font-bold gradient-text mb-4">Ready to Find Your Dream Property?</h2>
                <p className="text-xl text-slate-300 font-light mb-8 max-w-2xl mx-auto">
                    Join PropertyBid today and start bidding on exclusive properties or list your own for auction.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => router.push("/login")} className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 text-md rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300'>
                        Sign Up Now
                    </button>
                    <button onClick={() => router.push("/properties")} className='glass-effect text-white px-6 py-3 text-md rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300'>
                        Browse Properties
                    </button>
                </div>
            </section>
        </div>
    );
}

export default Page;