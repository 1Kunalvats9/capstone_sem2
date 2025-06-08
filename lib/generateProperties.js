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
  const isBiddingActive = faker.datatype.boolean(0.3);

  return {
    id: faker.string.uuid(),
    title: `${faker.location.city()} ${propertyType}`,
    description: `Beautiful ${propertyType.toLowerCase()} located in ${faker.location.city()}. This property features ${bedrooms} bedrooms and ${bathrooms} bathrooms with ${sizeSqFt} square feet of living space. Perfect for ${bedrooms > 3 ? 'large families' : 'small families or couples'}.`,
    propertyType,
    location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
    price,
    bedrooms,
    bathrooms,
    sizeSqFt,
    amenities: randomAmenities,
    status: 'Available',
    isBiddingActive,
    startingBid: isBiddingActive ? Math.floor(price * 0.8) : null,
    currentHighestBid: isBiddingActive ? Math.floor(price * 0.85) : 0,
    biddingEndsAt: isBiddingActive ? faker.date.future({ years: 0.1 }) : null,
    publishedAt: faker.date.recent({ days: 30 }),
    images: []
  };
}

export async function generateProperties(count = 30) {
  const properties = [];

  for (let i = 0; i < count; i++) {
    const property = await generateRandomProperty(i);
    properties.push(property);
  }

  return properties;
}