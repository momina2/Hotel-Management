export const hotels = [
  {
    id: 1,
    name: "Hunza Mountain Retreat",
    destination: "Hunza",
    location: "Karimabad, Hunza",
    rating: 4.8,
    reviews: 124,
    price: 18500,
    type: "Luxury Resort",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200",
    ],
    amenities: ["WiFi", "Parking", "Breakfast", "Mountain View"],
    description:
      "Experience peaceful mountain surroundings with comfortable rooms, beautiful views and warm hospitality.",
    rooms: [
      { id: 101, name: "Deluxe Room", price: 18500, capacity: 2, available: 5 },
      {
        id: 102,
        name: "Family Suite",
        price: 28000,
        capacity: 4,
        available: 3,
      },
    ],
  },
  {
    id: 2,
    name: "Skardu Valley Resort",
    destination: "Skardu",
    location: "Skardu, Gilgit-Baltistan",
    rating: 4.7,
    reviews: 98,
    price: 14500,
    type: "Resort",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200",
    ],
    amenities: ["WiFi", "Parking", "Restaurant", "Mountain View"],
    description:
      "Enjoy a relaxing getaway surrounded by breathtaking landscapes and modern comforts.",
    rooms: [
      {
        id: 201,
        name: "Standard Room",
        price: 14500,
        capacity: 2,
        available: 6,
      },
      {
        id: 202,
        name: "Executive Suite",
        price: 24500,
        capacity: 3,
        available: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Naran Riverside Hotel",
    destination: "Naran",
    location: "Main Naran Road",
    rating: 4.5,
    reviews: 76,
    price: 9500,
    type: "Hotel",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
    ],
    amenities: ["WiFi", "Parking", "Restaurant"],
    description:
      "A comfortable stay close to scenic landscapes, local attractions and beautiful riverside surroundings.",
    rooms: [
      {
        id: 301,
        name: "Standard Room",
        price: 9500,
        capacity: 2,
        available: 8,
      },
      { id: 302, name: "Family Room", price: 16500, capacity: 4, available: 4 },
    ],
  },
  {
    id: 4,
    name: "Swat Alpine Lodge",
    destination: "Swat",
    location: "Malam Jabba, Swat",
    rating: 4.6,
    reviews: 88,
    price: 12500,
    type: "Mountain Lodge",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
    ],
    amenities: ["WiFi", "Parking", "Breakfast"],
    description:
      "A charming mountain lodge designed for a relaxing escape in the beautiful Swat Valley.",
    rooms: [
      { id: 401, name: "Deluxe Room", price: 12500, capacity: 2, available: 4 },
    ],
  },
  {
    id: 5,
    name: "Murree Pine View Hotel",
    destination: "Murree",
    location: "Murree Hills",
    rating: 4.4,
    reviews: 112,
    price: 11000,
    type: "Hotel",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200",
    ],
    amenities: ["WiFi", "Parking", "Restaurant"],
    description:
      "Comfortable rooms and scenic hill views for couples, families and holiday travelers.",
    rooms: [
      { id: 501, name: "Deluxe Room", price: 11000, capacity: 2, available: 7 },
    ],
  },
];
export const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
