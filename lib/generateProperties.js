import { faker } from '@faker-js/faker';

export async function generateRandomProperty(index) {
  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Ranch'];
  const amenitiesList = [
    'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Fireplace',
    'Air Conditioning', 'Heating', 'Security System', 'Elevator',
    'Laundry Room', 'Storage', 'Terrace', 'Garage', 'Walk-in Closet'
  ];

  const randomAmenities = faker.helpers.arrayElements(amenitiesList, { min: 2, max: 6 });
  const propertyType = faker.helpers.arrayElement(propertyTypes);
  const bedrooms = faker.number.int({ min: 1, max: 6 });
  const bathrooms = faker.number.int({ min: 1, max: 4 });
  const sizeSqFt = faker.number.int({ min: 500, max: 5000 });
  const price = faker.number.int({ min: 50000, max: 2000000 });
  const isBiddingActive = faker.datatype.boolean(0.7);

  return {
    title: `${faker.location.city()} ${propertyType}`,
    description: `Beautiful ${propertyType.toLowerCase()} located in ${faker.location.city()}. This property features ${bedrooms} bedrooms and ${bathrooms} bathrooms with ${sizeSqFt} square feet of living space. Perfect for ${bedrooms > 3 ? 'large families' : 'small families or couples'}.`,
    propertyType,
    location: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      country: 'USA'
    },
    price,
    bedrooms,
    bathrooms,
    sizeSqFt,
    amenities: randomAmenities,
    status: 'Available',
    isBiddingActive,
    startingBid: isBiddingActive ? Math.floor(price * 0.8) : price,
    currentHighestBid: isBiddingActive ? Math.floor(price * 0.85) : 0,
    biddingEndsAt: isBiddingActive ? faker.date.future({ years: 0.1 }) : null,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
    ]
  };
}

export async function generateAndSaveProperties(count = 30, ownerEmail = 'admin@propbid.com') {
  const properties = [];

  for (let i = 0; i < count; i++) {
    const propertyData = await generateRandomProperty(i);
    
    try {
      const response = await fetch('/api/properties/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: ownerEmail,
          ...propertyData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        properties.push(result.property);
      }
    } catch (error) {
      console.error(`Error creating property ${i}:`, error);
    }
  }

  return properties;
}

export async function generateProperties(count = 30) {
  const properties = [];

  for (let i = 0; i < count; i++) {
    const property = await generateRandomProperty(i);
    properties.push({
      ...property,
      id: faker.string.uuid(),
      location: `${property.location.city}, ${property.location.state}`
    });
  }

  return properties;
}