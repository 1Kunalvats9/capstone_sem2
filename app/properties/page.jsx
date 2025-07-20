"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'
import images from "@/lib/img"
import PropertyCard from '../components/PropertyCard'
import toast from 'react-hot-toast'
import { Home, LogOut, Filter, Search, LogIn } from 'lucide-react'

const PropertiesPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [openMenu, setOpenMenu] = useState(false)
  const [properties, setProperties] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem("email")
    if (!email) {
      setIsLoggedIn(false)
      toast.error("Please login first")
      router.push("/home")
    } else {
      setIsLoggedIn(true)
      fetchProperties()
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [pagination.page, filters, searchQuery])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchQuery,
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
      })

      const response = await fetch(`/api/properties/all?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }))
      } else {
        toast.error("Failed to fetch properties")
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
      toast.error("Failed to fetch properties")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: ''
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const seedProperties = async () => {
    try {
      const response = await fetch('/api/properties/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 50 }),
      });
      
      if (response.ok) {
        toast.success("Sample properties loaded successfully!")
        fetchProperties();
      } else {
        toast.error("Failed to load sample properties")
      }
    } catch (error) {
      console.error('Error seeding properties:', error);
      toast.error("Failed to load sample properties")
    }
  };

  return (
    <div className='w-full min-h-screen px-10 md:px-16 lg:px-28 py-4'>
      <Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} openMenu={openMenu} setOpenMenu={setOpenMenu}/>
      
      {openMenu && (
        <div className='w-full left-0 top-0 mt-20 h-screen z-10 absolute duration-200 transition-all bg-white/10 backdrop-blur-2xl space-y-4 px-10 py-10'>
          <a onClick={() => router.push("/home")} className='flex items-center gap-2 hover:text-[#38BDF9] duration-150 cursor-pointer'><Home />Home</a>
          <a onClick={() => router.push("/properties")} className='flex items-center gap-2 hover:text-[#38BDF9] duration-150 cursor-pointer'><Home /> Properties</a>
          <a onClick={() => router.push("/home")} className='flex items-center gap-2 hover:text-[#38BDF9] duration-150 cursor-pointer'>{isLoggedIn ? <><LogOut />Logout</> : <><LogIn />Login</>}</a>
          {!isLoggedIn && <button className='w-full bg-[#0084C7] text-white px-4 py-1 text-md rounded-lg cursor-pointer hover:opacity-85 duration-200'>Register</button>}
        </div>
      )}

      <div className="my-16 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder='Search for properties by name or location....' 
              className='w-full border border-gray-500 rounded-lg outline-none placeholder:font-light placeholder-gray-400 px-10 py-3 bg-gray-900 text-white' 
              value={searchQuery}
              onChange={handleSearch} 
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Ranch">Ranch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {properties.length > 0 ? (
            <>
              <div className='w-full grid gap-6 grid-cols-1 my-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {properties.map((item, idx) => {
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
                })}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-4 my-8">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="text-white">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-400 text-lg mb-4">No properties found matching your criteria.</p>
              <button 
                onClick={seedProperties}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Load Sample Properties
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PropertiesPage