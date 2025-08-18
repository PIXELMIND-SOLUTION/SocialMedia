const images = [
  {
    id: 1,
    url: "/assets/images/a1.png",
    title: "Tiger Graphic Design",
    description: "Bold black and yellow tiger design for branding.",
    user: {
      name: "vijay",
      profileImage: "/assets/images/a1.png"
    },
    stats: { 
      saves: 4, 
      likes: 1,
      views: 125,
      downloads: 32
    },
    comments: [
      { 
        user: "Naveen", 
        text: "Nice!", 
        avatar: "/assets/images/a1.png",
        date: "2 days ago"
      },
      { 
        user: "Alex", 
        text: "Great colors!", 
        avatar: "/assets/images/a2.png",
        date: "1 week ago"
      }
    ],
    expansions: ["0% of the total amount of $2 million in the world", "10% of the total amount of $3 million in the world"],
    height: 300,
    width: 400,
    size: "1.2 MB",
    format: "PNG",
    tags: ["tiger", "graphic design", "branding", "yellow"],
    createdDate: "2023-05-15",
    location: "New York, USA",
    cameraInfo: {
      model: "Canon EOS R5",
      lens: "EF 24-70mm f/2.8L",
      iso: 200,
      shutterSpeed: "1/250",
      aperture: "f/5.6"
    },
    license: "Royalty-free",
    price: "$19.99",
    relatedImages: [2, 5, 8],
    isFeatured: true,
    rating: 4.5,
    category: "Graphic Design",
    colorPalette: ["#FFD700", "#000000", "#FFFFFF", "#808080"]
  },
  {
    id: 2,
    url: "/assets/images/a2.png",
    title: "Girl on Scooter",
    description: "Anime-style girl riding a scooter by the ocean.",
    user: {
      name: "sarah",
      profileImage: "/assets/images/a3.png"
    },
    stats: { 
      saves: 8, 
      likes: 3,
      views: 210,
      downloads: 45
    },
    comments: [
      { 
        user: "Sarah", 
        text: "Beautiful colors!", 
        avatar: "/assets/images/a3.png",
        date: "3 days ago"
      }
    ],
    expansions: ["5% of the total amount of $1 million in the world"],
    height: 400,
    width: 600,
    size: "2.1 MB",
    format: "JPEG",
    tags: ["anime", "scooter", "ocean", "girl"],
    createdDate: "2023-06-20",
    location: "Tokyo, Japan",
    cameraInfo: {
      model: "Illustration",
      software: "Adobe Illustrator"
    },
    license: "Creative Commons",
    price: "Free",
    relatedImages: [1, 3, 6],
    isFeatured: false,
    rating: 4.2,
    category: "Illustration",
    colorPalette: ["#00BFFF", "#FF69B4", "#FFFFFF", "#000000"]
  },
  {
    id: 3,
    url: "/assets/images/a3.png",
    title: "Statue at Night",
    description: "Beautifully lit statue by a river at night.",
    user: {
      name: "mike",
      profileImage: "/assets/images/a4.png"
    },
    stats: { 
      saves: 12, 
      likes: 5,
      views: 340,
      downloads: 78
    },
    comments: [
      { 
        user: "Mike", 
        text: "Great composition", 
        avatar: "/assets/images/a4.png",
        date: "1 week ago"
      },
      { 
        user: "Emma", 
        text: "Love the lighting!", 
        avatar: "/assets/images/a4.png",
        date: "5 days ago"
      }
    ],
    expansions: ["15% of the total amount of $4 million in the world"],
    height: 350,
    width: 525,
    size: "1.8 MB",
    format: "JPEG",
    tags: ["statue", "night", "river", "architecture"],
    createdDate: "2023-04-10",
    location: "Paris, France",
    cameraInfo: {
      model: "Sony A7III",
      lens: "FE 16-35mm f/2.8 GM",
      iso: 800,
      shutterSpeed: "1/60",
      aperture: "f/2.8"
    },
    license: "Premium",
    price: "$29.99",
    relatedImages: [2, 4, 7],
    isFeatured: true,
    rating: 4.7,
    category: "Photography",
    colorPalette: ["#00008B", "#ADD8E6", "#FFFFFF", "#FFD700"]
  },
  {
    id: 4,
    url: "/assets/images/a4.png",
    title: "Mountain Landscape",
    description: "Stunning mountain view at sunrise.",
    user: {
      name: "emma",
      profileImage: "/assets/images/a2.png"
    },
    stats: { 
      saves: 6, 
      likes: 2,
      views: 180,
      downloads: 42
    },
    comments: [
      { 
        user: "Emma", 
        text: "Breathtaking!", 
        avatar: "/assets/images/a1.png",
        date: "2 days ago"
      }
    ],
    expansions: ["8% of the total amount of $2.5 million in the world"],
    height: 450,
    width: 675,
    size: "2.5 MB",
    format: "JPEG",
    tags: ["mountain", "landscape", "sunrise", "nature"],
    createdDate: "2023-07-05",
    location: "Swiss Alps",
    cameraInfo: {
      model: "Nikon D850",
      lens: "24-70mm f/2.8E ED VR",
      iso: 100,
      shutterSpeed: "1/125",
      aperture: "f/8"
    },
    license: "Royalty-free",
    price: "$24.99",
    relatedImages: [3, 5, 9],
    isFeatured: false,
    rating: 4.3,
    category: "Nature",
    colorPalette: ["#FF4500", "#4682B4", "#2E8B57", "#FFFFFF"]
  },
  {
    id: 5,
    url: "/assets/images/a3.png",
    title: "Urban Street Art",
    description: "Colorful graffiti in downtown alleyway.",
    user: {
      name: "alex",
      profileImage: "/assets/images/a2.png"
    },
    stats: { 
      saves: 9, 
      likes: 7,
      views: 290,
      downloads: 63
    },
    comments: [
      { 
        user: "Alex", 
        text: "Love the vibrancy!", 
        avatar: "/assets/images/a2.png",
        date: "4 days ago"
      }
    ],
    expansions: ["12% of the total amount of $1.8 million in the world"],
    height: 320,
    width: 480,
    size: "1.5 MB",
    format: "JPEG",
    tags: ["street art", "graffiti", "urban", "colorful"],
    createdDate: "2023-03-22",
    location: "Berlin, Germany",
    cameraInfo: {
      model: "Fujifilm X-T4",
      lens: "XF 16-55mm f/2.8 R LM WR",
      iso: 400,
      shutterSpeed: "1/200",
      aperture: "f/4"
    },
    license: "Creative Commons",
    price: "Free",
    relatedImages: [1, 6, 8],
    isFeatured: true,
    rating: 4.6,
    category: "Street Photography",
    colorPalette: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"]
  },
  {
    id: 6,
    url: "/assets/images/a2.png",
    title: "Coffee Cup Macro",
    description: "Close-up of coffee with artistic foam.",
    user: {
      name: "jamie",
      profileImage: "/assets/images/a2.png"
    },
    stats: { 
      saves: 15, 
      likes: 10,
      views: 420,
      downloads: 95
    },
    comments: [
      { 
        user: "Jamie", 
        text: "Makes me want coffee!", 
        avatar: "/assets/images/a3.png",
        date: "1 day ago"
      },
      { 
        user: "Taylor", 
        text: "Perfect focus", 
        avatar: "/assets/images/a1.png",
        date: "3 days ago"
      }
    ],
    expansions: ["20% of the total amount of $2.2 million in the world"],
    height: 380,
    width: 570,
    size: "2.0 MB",
    format: "JPEG",
    tags: ["coffee", "macro", "food", "beverage"],
    createdDate: "2023-08-12",
    location: "Milan, Italy",
    cameraInfo: {
      model: "Canon EOS 5D Mark IV",
      lens: "EF 100mm f/2.8L Macro IS USM",
      iso: 100,
      shutterSpeed: "1/160",
      aperture: "f/5.6"
    },
    license: "Premium",
    price: "$34.99",
    relatedImages: [2, 5, 7],
    isFeatured: true,
    rating: 4.8,
    category: "Food Photography",
    colorPalette: ["#8B4513", "#FFFFFF", "#000000", "#D2B48C"]
  },
  {
    id: 7,
    url: "/assets/images/a3.png",
    title: "Desert Sunset",
    description: "Vast desert landscape at golden hour.",
    user: {
      name: "taylor",
      profileImage: "/assets/images/a1.png"
    },
    stats: { 
      saves: 7, 
      likes: 4,
      views: 230,
      downloads: 51
    },
    comments: [
      { 
        user: "Taylor", 
        text: "Amazing colors!", 
        avatar: "/assets/images/a2.png",
        date: "1 week ago"
      }
    ],
    expansions: ["6% of the total amount of $3.5 million in the world"],
    height: 420,
    width: 630,
    size: "2.3 MB",
    format: "JPEG",
    tags: ["desert", "sunset", "landscape", "golden hour"],
    createdDate: "2023-02-18",
    location: "Sahara Desert",
    cameraInfo: {
      model: "Sony A7R IV",
      lens: "FE 24-105mm f/4 G OSS",
      iso: 200,
      shutterSpeed: "1/250",
      aperture: "f/8"
    },
    license: "Royalty-free",
    price: "$27.99",
    relatedImages: [3, 6, 9],
    isFeatured: false,
    rating: 4.4,
    category: "Landscape",
    colorPalette: ["#FF8C00", "#CD853F", "#F5DEB3", "#8B0000"]
  },
  {
    id: 8,
    url: "/assets/images/a1.png",
    title: "Abstract Geometry",
    description: "Modern abstract geometric composition.",
    user: {
      name: "casey",
      profileImage: "/assets/images/a4.png"
    },
    stats: { 
      saves: 11, 
      likes: 6,
      views: 310,
      downloads: 72
    },
    comments: [
      { 
        user: "Casey", 
        text: "So contemporary!", 
        avatar: "/assets/images/a3.png",
        date: "5 days ago"
      }
    ],
    expansions: ["14% of the total amount of $1.5 million in the world"],
    height: 290,
    width: 435,
    size: "1.1 MB",
    format: "PNG",
    tags: ["abstract", "geometry", "modern", "design"],
    createdDate: "2023-01-30",
    location: "Digital Art",
    cameraInfo: {
      software: "Adobe Photoshop"
    },
    license: "Creative Commons",
    price: "Free",
    relatedImages: [1, 5, 9],
    isFeatured: true,
    rating: 4.5,
    category: "Abstract Art",
    colorPalette: ["#FF0000", "#00FF00", "#0000FF", "#FFFFFF"]
  },
  {
    id: 9,
    url: "/assets/images/a1.png",
    title: "Waterfall Adventure",
    description: "Majestic waterfall in tropical forest.",
    user: {
      name: "riley",
      profileImage: "/assets/images/a2.png"
    },
    stats: { 
      saves: 18, 
      likes: 12,
      views: 510,
      downloads: 120
    },
    comments: [
      { 
        user: "Riley", 
        text: "Nature at its best!", 
        avatar: "/assets/images/a2.png",
        date: "2 weeks ago"
      },
      { 
        user: "Jordan", 
        text: "Incredible shot", 
        avatar: "/assets/images/a1.png",
        date: "1 week ago"
      }
    ],
    expansions: ["25% of the total amount of $2.8 million in the world"],
    height: 360,
    width: 540,
    size: "2.2 MB",
    format: "JPEG",
    tags: ["waterfall", "forest", "nature", "adventure"],
    createdDate: "2022-12-15",
    location: "Iguazu Falls, Brazil",
    cameraInfo: {
      model: "Canon EOS R6",
      lens: "RF 15-35mm f/2.8L IS USM",
      iso: 100,
      shutterSpeed: "1/15",
      aperture: "f/11"
    },
    license: "Premium",
    price: "$39.99",
    relatedImages: [4, 7, 10],
    isFeatured: true,
    rating: 4.9,
    category: "Nature",
    colorPalette: ["#008000", "#00FFFF", "#FFFFFF", "#000000"]
  },
  {
    id: 10,
    url: "/assets/images/a3.png",
    title: "Minimalist Architecture",
    description: "Clean lines and simple forms in urban design.",
    user: {
      name: "morgan",
      profileImage: "/assets/images/a3.png"
    },
    stats: { 
      saves: 5, 
      likes: 3,
      views: 160,
      downloads: 38
    },
    comments: [
      { 
        user: "Morgan", 
        text: "So clean!", 
        avatar: "/assets/images/a2.png",
        date: "3 days ago"
      }
    ],
    expansions: ["7% of the total amount of $1.2 million in the world"],
    height: 410,
    width: 615,
    size: "1.9 MB",
    format: "JPEG",
    tags: ["architecture", "minimalist", "urban", "design"],
    createdDate: "2023-07-28",
    location: "Copenhagen, Denmark",
    cameraInfo: {
      model: "Leica Q2",
      lens: "Summilux 28mm f/1.7 ASPH.",
      iso: 200,
      shutterSpeed: "1/500",
      aperture: "f/5.6"
    },
    license: "Royalty-free",
    price: "$22.99",
    relatedImages: [3, 6, 9],
    isFeatured: false,
    rating: 4.1,
    category: "Architecture",
    colorPalette: ["#FFFFFF", "#000000", "#808080", "#C0C0C0"]
  }
];

export default images;