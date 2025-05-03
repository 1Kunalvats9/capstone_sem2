import { faker } from '@faker-js/faker';

async function generateRandomProperty(index) {
  return {
    id: faker.string.uuid(),
    title: `${faker.location.city()} Home`,
    image: `https://loremflickr.com/640/480/house?random=${index}`,
    sizeSqFt: faker.number.int({ min: 500, max: 5000 }),
    bedrooms: faker.number.int({ min: 1, max: 6 }),
    bathrooms: faker.number.int({ min: 1, max: 4 }),
    price: faker.number.int({ min: 50000, max: 1000000 }),
    location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`
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
