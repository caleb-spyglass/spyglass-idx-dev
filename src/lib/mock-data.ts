import { Listing } from '@/types/listing';

// Mock listings for development - replace with Repliers API
export const mockListings: Listing[] = [
  {
    id: '1',
    mlsNumber: 'MLS123456',
    address: {
      street: '2100 Barton Hills Dr',
      city: 'Austin',
      state: 'TX',
      zip: '78704',
      full: '2100 Barton Hills Dr, Austin, TX 78704'
    },
    price: 875000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2450,
    yearBuilt: 1985,
    propertyType: 'Single Family',
    status: 'Active',
    daysOnMarket: 5,
    photos: ['/placeholder-home.jpg'],
    coordinates: { lat: 30.2500, lng: -97.7700 },
    listDate: '2026-01-29',
    updatedAt: '2026-02-03'
  },
  {
    id: '2',
    mlsNumber: 'MLS123457',
    address: {
      street: '1505 S Congress Ave #302',
      city: 'Austin',
      state: 'TX',
      zip: '78704',
      full: '1505 S Congress Ave #302, Austin, TX 78704'
    },
    price: 525000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    yearBuilt: 2018,
    propertyType: 'Condo',
    status: 'Active',
    daysOnMarket: 12,
    photos: ['/placeholder-home.jpg'],
    coordinates: { lat: 30.2450, lng: -97.7500 },
    listDate: '2026-01-22',
    updatedAt: '2026-02-01'
  },
  {
    id: '3',
    mlsNumber: 'MLS123458',
    address: {
      street: '3200 Travis Heights Blvd',
      city: 'Austin',
      state: 'TX',
      zip: '78704',
      full: '3200 Travis Heights Blvd, Austin, TX 78704'
    },
    price: 1250000,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3800,
    yearBuilt: 2020,
    propertyType: 'Single Family',
    status: 'Active',
    daysOnMarket: 3,
    photos: ['/placeholder-home.jpg'],
    coordinates: { lat: 30.2380, lng: -97.7350 },
    listDate: '2026-01-31',
    updatedAt: '2026-02-03'
  },
  {
    id: '4',
    mlsNumber: 'MLS123459',
    address: {
      street: '900 Bouldin Ave',
      city: 'Austin',
      state: 'TX',
      zip: '78704',
      full: '900 Bouldin Ave, Austin, TX 78704'
    },
    price: 695000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    yearBuilt: 1955,
    propertyType: 'Single Family',
    status: 'Pending',
    daysOnMarket: 8,
    photos: ['/placeholder-home.jpg'],
    coordinates: { lat: 30.2520, lng: -97.7580 },
    listDate: '2026-01-26',
    updatedAt: '2026-02-02'
  },
  {
    id: '5',
    mlsNumber: 'MLS123460',
    address: {
      street: '2401 Zilker Park Rd',
      city: 'Austin',
      state: 'TX',
      zip: '78746',
      full: '2401 Zilker Park Rd, Austin, TX 78746'
    },
    price: 1875000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 4200,
    yearBuilt: 2015,
    propertyType: 'Single Family',
    status: 'Active',
    daysOnMarket: 14,
    photos: ['/placeholder-home.jpg'],
    coordinates: { lat: 30.2650, lng: -97.7800 },
    listDate: '2026-01-20',
    updatedAt: '2026-02-03'
  },
  {
    id: '6',
    mlsNumber: 'MLS123461',
    address: {
      street: '1100 S Lamar Blvd #201',
      city: 'Austin',
      state: 'TX',
      zip: '78704',
      full: '1100 S Lamar Blvd #201, Austin, TX 78704'
    },
    price: 425000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 850,
    yearBuilt: 2019,
    propertyType: 'Condo',
    status: 'Active',
    daysOnMarket: 21,
    photos: ['/placeholder-home.jpg'],
    coordinates: { lat: 30.2550, lng: -97.7650 },
    listDate: '2026-01-13',
    updatedAt: '2026-01-30'
  }
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
