import { Ad, User, Report, Review, Comment } from '../types';

export const MOCK_SELLERS: Omit<User, 'password'>[] = [
  {
    id: 'seller-1', name: 'TechieTom', email: 'tom@example.com', phone: '+1-555-0101', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=TechieTom',
    tier: 'gold', createdAt: '2022-01-15T10:00:00Z', bio: 'Your go-to for the latest gadgets and electronics.',
    isVerified: true, rating: 4.9, reviewCount: 152, status: 'active', ipAddress: '73.125.68.21',
    cloudSync: { isEnabled: true, provider: 'google-drive', syncOnWifiOnly: true, mediaCompression: 'medium', lastSync: '2024-05-22T11:00:00Z' }
  },
  {
    id: 'seller-2', name: 'FashionistaFiona', email: 'fiona@example.com', phone: '+1-555-0102', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Fiona',
    tier: 'platinum', createdAt: '2021-03-20T14:30:00Z', bio: 'Curated vintage and modern fashion pieces.',
    isVerified: true, rating: 4.8, reviewCount: 340, status: 'active', ipAddress: '108.45.91.170',
    cloudSync: { isEnabled: true, provider: 'dropbox', syncOnWifiOnly: false, mediaCompression: 'high' }
  },
  {
    id: 'seller-3', name: 'HomebodyHenry', email: 'henry@example.com', phone: '+1-555-0103', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Henry',
    tier: 'silver', createdAt: '2023-05-10T09:00:00Z', bio: 'Making your house a home, one piece of furniture at a time.',
    isVerified: true, rating: 4.7, reviewCount: 88, status: 'active', ipAddress: '24.12.119.5',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  },
  {
    id: 'seller-4', name: 'GearheadGary', email: 'gary@example.com', phone: '+1-555-0104', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Gary',
    tier: 'diamond', createdAt: '2020-11-01T18:00:00Z', bio: 'Collector of classic cars and rare motorcycles.',
    isVerified: true, rating: 5.0, reviewCount: 75, status: 'active', ipAddress: '98.207.23.14',
    cloudSync: { isEnabled: true, provider: 'google-drive', syncOnWifiOnly: true, mediaCompression: 'none' }
  },
  {
    id: 'seller-5', name: 'RealtorRita', email: 'rita@example.com', phone: '+1-555-0105', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Rita',
    tier: 'su_diamond', createdAt: '2019-08-12T11:00:00Z', bio: 'Finding your dream home or commercial space.',
    isVerified: true, rating: 4.9, reviewCount: 210, status: 'active', ipAddress: '172.58.99.82',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  },
  {
    id: 'seller-6', name: 'ServiceSam', email: 'sam@example.com', phone: '+1-555-0106', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Sam',
    tier: 'bronze', createdAt: '2023-09-01T12:00:00Z', bio: 'Freelance web developer and IT support specialist.',
    isVerified: false, rating: 4.6, reviewCount: 32, status: 'active', ipAddress: '68.5.122.34',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  },
  {
    id: 'seller-7', name: 'NewbieNick', email: 'nick@example.com', phone: '+1-555-0107', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Nick',
    tier: 'normal', createdAt: '2024-02-15T16:00:00Z', bio: 'Just getting started, selling some old stuff!',
    isVerified: false, rating: 4.5, reviewCount: 4, status: 'active', ipAddress: '208.73.180.10',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  },
  {
    id: 'seller-8', name: 'AdminAnna', email: 'admin@example.com', phone: '+1-555-0108', avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Anna',
    tier: 'MAZ', createdAt: '2018-01-01T00:00:00Z', bio: 'MAZDADY Marketplace Administrator.',
    isVerified: true, rating: 5.0, reviewCount: 999, status: 'active', isAdmin: true, ipAddress: '127.0.0.1',
    cloudSync: { isEnabled: false, provider: 'none', syncOnWifiOnly: true, mediaCompression: 'medium' }
  }
];

// Helper function to create an Ad object with less boilerplate
const createAd = (id: number, sellerIndex: number, data: any, reports: Report[] = []): Ad => {
    return {
        id: `ad-${id.toString().padStart(2, '0')}`,
        seller: MOCK_SELLERS[sellerIndex] as User,
        reports,
        ...data,
        rating: 0,
        reviews: [],
        comments: [],
        status: 'active'
    } as Ad;
}

export const MOCK_ADS: Ad[] = [
  // 6 Electronics
  createAd(1, 0, {
    title: 'Pristine iPhone 14 Pro', description: 'Barely used iPhone 14 Pro, 256GB, Deep Purple. Comes with original box and cable. No scratches or dents.', price: 850, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1678695193933-4a696a63503a?q=80&w=500', 'https://images.unsplash.com/photo-1663183578338-12585394285b?q=80&w=500', 'https://images.unsplash.com/photo-1664353424454-34327389a952?q=80&w=500'], category: 'Electronics', condition: 'used',
    location: { city: 'San Francisco', country: 'USA', coordinates: { lat: 37.7749, lng: -122.4194 } },
    specifications: { brand: 'Apple', model: 'iPhone 14 Pro', color: 'Deep Purple', size: '256GB', warranty: false },
    stats: { views: 1205, likes: 88, shares: 12, createdAt: '2024-05-20T10:00:00Z', updatedAt: '2024-05-22T11:00:00Z' },
    delivery: { available: true, cost: 15, time: '3-5 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(2, 0, {
    title: 'Dell XPS 15 Laptop', description: 'Powerful developer laptop. Intel i7, 32GB RAM, 1TB SSD, 4K OLED screen. Excellent condition.', price: 1600, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=500', 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=500'], category: 'Electronics', condition: 'used',
    location: { city: 'Austin', country: 'USA', coordinates: { lat: 30.2672, lng: -97.7431 } },
    specifications: { brand: 'Dell', model: 'XPS 15 9520', color: 'Silver', warranty: true },
    stats: { views: 850, likes: 65, shares: 8, createdAt: '2024-05-18T14:00:00Z', updatedAt: '2024-05-21T10:00:00Z' },
    delivery: { available: true, cost: 25, time: '2-4 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true },
    isAuction: true,
    auctionDetails: {
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      startingBid: 1200,
      currentBid: 1600,
      bids: [
        { bidderId: 'seller-3', amount: 1300, timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
        { bidderId: 'seller-4', amount: 1500, timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() },
        { bidderId: 'seller-2', amount: 1600, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      ],
      reservePrice: 1500,
      buyNowPrice: 2000,
    }
  }),
  createAd(3, 6, {
    title: 'Brand New Sony WH-1000XM5 Headphones', description: 'Unopened, factory-sealed Sony noise-cancelling headphones. Won them in a contest but already have a pair.', price: 350, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1654572233687-343d64a81b37?q=80&w=500', 'https://images.unsplash.com/photo-1627916573383-568853a0f7c2?q=80&w=500'], category: 'Electronics', condition: 'new',
    location: { city: 'Miami', country: 'USA', coordinates: { lat: 25.7617, lng: -80.1918 } },
    specifications: { brand: 'Sony', model: 'WH-1000XM5', color: 'Black', warranty: true },
    stats: { views: 2510, likes: 210, shares: 35, createdAt: '2024-05-22T08:00:00Z', updatedAt: '2024-05-22T08:00:00Z' },
    delivery: { available: true, cost: 0, time: '5-7 days', type: 'both' },
    availability: { quantity: 1, inStock: true }
  }, [
    { id: 'rep1', reporter: MOCK_SELLERS[2] as User, reason: 'Price seems too good to be true.', createdAt: new Date('2024-05-22T09:00:00Z') },
    { id: 'rep2', reporter: MOCK_SELLERS[3] as User, reason: 'Suspected scam.', createdAt: new Date('2024-05-22T10:30:00Z') }
  ]),
  createAd(4, 0, {
    title: 'Refurbished Samsung Galaxy Tab S8', description: 'Professionally refurbished tablet. Works like new. Great for media and productivity. 128GB model.', price: 400, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1616443254103-649339463b36?q=80&w=500', 'https://images.unsplash.com/photo-1621360124973-5105e1a35a11?q=80&w=500'], category: 'Electronics', condition: 'refurbished',
    location: { city: 'Seattle', country: 'USA', coordinates: { lat: 47.6062, lng: -122.3321 } },
    specifications: { brand: 'Samsung', model: 'Galaxy Tab S8', color: 'Graphite', size: '128GB', warranty: true },
    stats: { views: 430, likes: 25, shares: 5, createdAt: '2024-05-15T12:00:00Z', updatedAt: '2024-05-20T18:00:00Z' },
    delivery: { available: true, cost: 10, time: '4-6 days', type: 'delivery' },
    availability: { quantity: 5, inStock: true }
  }),
   createAd(5, 7, {
    title: 'GoPro HERO11 Black Action Camera', description: 'Used for one trip, fantastic condition. Includes battery, case, and a few mounts.', price: 300, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1676348149372-76493545464b?q=80&w=500'], category: 'Electronics', condition: 'used',
    location: { city: 'Denver', country: 'USA', coordinates: { lat: 39.7392, lng: -104.9903 } },
    specifications: { brand: 'GoPro', model: 'HERO11', color: 'Black', warranty: false },
    stats: { views: 950, likes: 115, shares: 15, createdAt: '2024-05-23T10:00:00Z', updatedAt: '2024-05-23T10:00:00Z' },
    delivery: { available: true, cost: 10, time: '3-5 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(6, 6, {
    title: 'Nintendo Switch OLED Model', description: 'Like new condition, includes all original accessories and packaging. Super Mario Odyssey included.', price: 320, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1653503525433-213795a1b327?q=80&w=500'], category: 'Electronics', condition: 'used',
    location: { city: 'Tokyo', country: 'Japan', coordinates: { lat: 35.6762, lng: 139.6503 } },
    specifications: { brand: 'Nintendo', model: 'Switch OLED', color: 'White', size: '64GB', warranty: false },
    stats: { views: 1800, likes: 250, shares: 30, createdAt: '2024-05-19T08:30:00Z', updatedAt: '2024-05-22T19:00:00Z' },
    delivery: { available: true, cost: 25, time: '7-10 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  // 6 Fashion
  createAd(7, 1, {
    title: 'Vintage Levi\'s Denim Jacket', description: 'Classic trucker jacket from the 80s. Perfectly worn in. Men\'s size Large.', price: 120, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500', 'https://images.unsplash.com/photo-1608234807921-a3591e84732a?q=80&w=500'], category: 'Fashion', condition: 'used',
    location: { city: 'New York', country: 'USA', coordinates: { lat: 40.7128, lng: -74.0060 } },
    specifications: { brand: 'Levi\'s', model: 'Trucker Jacket', color: 'Blue Denim', size: 'L', warranty: false },
    stats: { views: 980, likes: 150, shares: 20, createdAt: '2024-05-19T11:00:00Z', updatedAt: '2024-05-20T09:00:00Z' },
    delivery: { available: true, cost: 10, time: '3-5 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(8, 1, {
    title: 'Gucci Marmont Handbag', description: 'Authentic Gucci Marmont small matelassé shoulder bag in black leather. Used twice, in mint condition. Comes with dust bag and authenticity cards.', price: 1800, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=500', 'https://images.unsplash.com/photo-1579540645217-a875a5091550?q=80&w=500'], category: 'Fashion', condition: 'used',
    location: { city: 'Los Angeles', country: 'USA', coordinates: { lat: 34.0522, lng: -118.2437 } },
    specifications: { brand: 'Gucci', model: 'Marmont', color: 'Black', warranty: false },
    stats: { views: 2200, likes: 350, shares: 45, createdAt: '2024-05-21T18:00:00Z', updatedAt: '2024-05-21T18:00:00Z' },
    delivery: { available: true, cost: 50, time: '1-3 days (insured)', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(9, 6, {
    title: 'Nike Air Max 90 Sneakers', description: 'Brand new, never worn Air Max 90s in classic white. Size 10 US Men\'s.', price: 130, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500', 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcdda9?q=80&w=500'], category: 'Fashion', condition: 'new',
    location: { city: 'Chicago', country: 'USA', coordinates: { lat: 41.8781, lng: -87.6298 } },
    specifications: { brand: 'Nike', model: 'Air Max 90', color: 'White', size: '10', warranty: false },
    stats: { views: 1500, likes: 180, shares: 25, createdAt: '2024-05-22T12:00:00Z', updatedAt: '2024-05-22T12:00:00Z' },
    delivery: { available: true, cost: 12, time: '4-6 days', type: 'both' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(10, 3, {
    title: 'Ray-Ban Aviator Sunglasses', description: 'Classic Ray-Ban Aviators with gold frame and green lenses. Lightly used, no scratches.', price: 80, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=500', 'https://images.unsplash.com/photo-1577803645773-0ab7d374e2d3?q=80&w=500'], category: 'Fashion', condition: 'used',
    location: { city: 'Las Vegas', country: 'USA', coordinates: { lat: 36.1699, lng: -115.1398 } },
    specifications: { brand: 'Ray-Ban', model: 'Aviator Classic', color: 'Gold', warranty: false },
    stats: { views: 640, likes: 70, shares: 10, createdAt: '2024-05-17T09:00:00Z', updatedAt: '2024-05-19T15:00:00Z' },
    delivery: { available: true, cost: 5, time: '3-5 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
    createAd(11, 1, {
    title: 'Men\'s Leather Dress Shoes', description: 'Brand new Italian leather shoes. Size 11 US, black. Never worn, perfect for formal events.', price: 180, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1449505978122-05f32b35a231?q=80&w=500'], category: 'Fashion', condition: 'new',
    location: { city: 'Milan', country: 'Italy', coordinates: { lat: 45.4642, lng: 9.1900 } },
    specifications: { brand: 'Bontoni', model: 'Classic Oxford', color: 'Black', size: '11', warranty: false },
    stats: { views: 550, likes: 85, shares: 10, createdAt: '2024-05-21T14:00:00Z', updatedAt: '2024-05-21T14:00:00Z' },
    delivery: { available: true, cost: 30, time: '5-8 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(12, 1, {
    title: 'Designer Silk Scarf', description: 'Beautiful 100% silk scarf with a unique pattern. Large size, can be worn many ways.', price: 250, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=500'], category: 'Fashion', condition: 'new',
    location: { city: 'Paris', country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
    specifications: { brand: 'Hermès', model: 'Carré', color: 'Multicolor', size: '90cm x 90cm', warranty: false },
    stats: { views: 900, likes: 180, shares: 28, createdAt: '2024-04-30T10:00:00Z', updatedAt: '2024-05-15T12:00:00Z' },
    delivery: { available: true, cost: 20, time: '4-7 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  // 4 Home & Garden
  createAd(13, 2, {
    title: 'Mid-Century Modern Sofa', description: 'Three-seater sofa in teal fabric with wooden legs. Great condition, from a smoke-free home.', price: 600, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500', 'https://images.unsplash.com/photo-1540574163024-583d3f2c5d49?q=80&w=500'], category: 'Home & Garden', condition: 'used',
    location: { city: 'Portland', country: 'USA', coordinates: { lat: 45.5051, lng: -122.6750 } },
    specifications: { brand: 'West Elm', model: 'Andes', color: 'Teal', warranty: false },
    stats: { views: 750, likes: 95, shares: 15, createdAt: '2024-05-16T19:00:00Z', updatedAt: '2024-05-20T14:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(14, 7, {
    title: 'Dyson V11 Cordless Vacuum', description: 'Powerful and lightweight vacuum. Comes with all original attachments. Battery holds a full charge.', price: 300, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1583744946564-b5291c3874f2?q=80&w=500', 'https://images.unsplash.com/photo-1629102717834-5c90538a8511?q=80&w=500'], category: 'Home & Garden', condition: 'used',
    location: { city: 'London', country: 'UK', coordinates: { lat: 51.5072, lng: -0.1276 } },
    specifications: { brand: 'Dyson', model: 'V11', color: 'Blue', warranty: false },
    stats: { views: 1800, likes: 160, shares: 30, createdAt: '2024-05-20T13:00:00Z', updatedAt: '2024-05-21T16:00:00Z' },
    delivery: { available: true, cost: 20, time: '2-4 days', type: 'delivery' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(15, 2, {
    title: 'Set of 4 Patio Chairs', description: 'Brand new, unassembled wicker patio chairs. Weather-resistant and very comfortable. Cushions included.', price: 250, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1598532289940-1a2218635b7a?q=80&w=500', 'https://images.unsplash.com/photo-1617104677243-57053a45c345?q=80&w=500'], category: 'Home & Garden', condition: 'new',
    location: { city: 'San Diego', country: 'USA', coordinates: { lat: 32.7157, lng: -117.1611 } },
    specifications: { brand: 'Hampton Bay', model: 'Cambridge', color: 'Brown', warranty: false },
    stats: { views: 350, likes: 40, shares: 5, createdAt: '2024-05-21T10:00:00Z', updatedAt: '2024-05-21T10:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(16, 2, {
    title: 'Refurbished KitchenAid Mixer', description: 'Artisan Series 5-quart stand mixer, professionally refurbished. Works perfectly. Comes with three attachments.', price: 220, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1558985228-a2a4a75a7453?q=80&w=500', 'https://images.unsplash.com/photo-1607920591851-970c6ba1c74a?q=80&w=500'], category: 'Home & Garden', condition: 'refurbished',
    location: { city: 'Paris', country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
    specifications: { brand: 'KitchenAid', model: 'Artisan', color: 'Empire Red', warranty: true },
    stats: { views: 990, likes: 110, shares: 18, createdAt: '2024-04-19T16:00:00Z', updatedAt: '2024-05-22T09:00:00Z' },
    delivery: { available: true, cost: 30, time: '5-8 days', type: 'delivery' },
    availability: { quantity: 3, inStock: true }
  }),
  // 3 Vehicles
  createAd(17, 3, {
    title: '2019 Toyota RAV4 Hybrid', description: 'Excellent condition, one owner, low mileage (35,000 miles). All-wheel drive, great fuel economy. All service records available.', price: 28000, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1626953424151-487213425e43?q=80&w=500', 'https://images.unsplash.com/photo-1617469739922-26645e1a6?q=80&w=500'], category: 'Vehicles', condition: 'used',
    location: { city: 'Denver', country: 'USA', coordinates: { lat: 39.7392, lng: -104.9903 } },
    specifications: { brand: 'Toyota', model: 'RAV4 Hybrid XLE', color: 'Magnetic Gray', warranty: false },
    stats: { views: 3500, likes: 250, shares: 40, createdAt: '2024-05-20T15:00:00Z', updatedAt: '2024-05-21T11:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
  createAd(18, 3, {
    title: 'Custom Cafe Racer Motorcycle', description: 'Beautifully restored and customized 1978 Honda CB750. A real head-turner. Runs perfectly.', price: 8500, currency: 'USD',
    images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=500', 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=500'], category: 'Vehicles', condition: 'used',
    location: { city: 'Berlin', country: 'Germany', coordinates: { lat: 52.5200, lng: 13.4050 } },
    specifications: { brand: 'Honda', model: 'CB750 Custom', color: 'Black', warranty: false },
    stats: { views: 4200, likes: 450, shares: 80, createdAt: '2024-05-15T18:00:00Z', updatedAt: '2024-05-22T20:00:00Z' },
    delivery: { available: false, cost: 0, time: 'N/A', type: 'pickup' },
    availability: { quantity: 1, inStock: true }
  }),
];