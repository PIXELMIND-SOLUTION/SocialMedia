const images = [
  {
    id: 1,
    url: "/assets/images/a1.png",
    title: "Tiger Graphic Design",
    description: "Bold black and yellow tiger design for branding.",
    stats: { saves: 4, likes: 1 },
    comments: [{ user: "Naveen", text: "Nice!" }],
    expansions: ["0% of the total amount of $2 million in the world", "10% of the total amount of $3 million in the world"],
    height: 300
  },
  {
    id: 2,
    url: "/assets/images/a2.png",
    title: "Girl on Scooter",
    description: "Anime-style girl riding a scooter by the ocean.",
    stats: { saves: 8, likes: 3 },
    comments: [{ user: "Sarah", text: "Beautiful colors!" }],
    expansions: ["5% of the total amount of $1 million in the world"],
    height: 400
  },
  {
    id: 3,
    url: "/assets/images/a3.png",
    title: "Statue at Night",
    description: "Beautifully lit statue by a river at night.",
    stats: { saves: 12, likes: 5 },
    comments: [{ user: "Mike", text: "Great composition" }],
    expansions: ["15% of the total amount of $4 million in the world"],
    height: 350
  },
  {
    id: 4,
    url: "/assets/images/a4.png",
    title: "Mountain Landscape",
    description: "Stunning mountain view at sunrise.",
    stats: { saves: 6, likes: 2 },
    comments: [{ user: "Emma", text: "Breathtaking!" }],
    expansions: ["8% of the total amount of $2.5 million in the world"],
    height: 450
  },
  {
    id: 5,
    url: "/assets/images/a3.png",
    title: "Urban Street Art",
    description: "Colorful graffiti in downtown alleyway.",
    stats: { saves: 9, likes: 7 },
    comments: [{ user: "Alex", text: "Love the vibrancy!" }],
    expansions: ["12% of the total amount of $1.8 million in the world"],
    height: 320
  },
  {
    id: 6,
    url: "/assets/images/a2.png",
    title: "Coffee Cup Macro",
    description: "Close-up of coffee with artistic foam.",
    stats: { saves: 15, likes: 10 },
    comments: [{ user: "Jamie", text: "Makes me want coffee!" }],
    expansions: ["20% of the total amount of $2.2 million in the world"],
    height: 380
  },
  {
    id: 7,
    url: "/assets/images/a3.png",
    title: "Desert Sunset",
    description: "Vast desert landscape at golden hour.",
    stats: { saves: 7, likes: 4 },
    comments: [{ user: "Taylor", text: "Amazing colors!" }],
    expansions: ["6% of the total amount of $3.5 million in the world"],
    height: 420
  },
  {
    id: 8,
    url: "/assets/images/a1.png",
    title: "Abstract Geometry",
    description: "Modern abstract geometric composition.",
    stats: { saves: 11, likes: 6 },
    comments: [{ user: "Casey", text: "So contemporary!" }],
    expansions: ["14% of the total amount of $1.5 million in the world"],
    height: 290
  },
  {
    id: 9,
    url: "/assets/images/a1.png",
    title: "Waterfall Adventure",
    description: "Majestic waterfall in tropical forest.",
    stats: { saves: 18, likes: 12 },
    comments: [{ user: "Riley", text: "Nature at its best!" }],
    expansions: ["25% of the total amount of $2.8 million in the world"],
    height: 360
  },
  {
    id: 10,
    url: "/assets/images/a3.png",
    title: "Minimalist Architecture",
    description: "Clean lines and simple forms in urban design.",
    stats: { saves: 5, likes: 3 },
    comments: [{ user: "Morgan", text: "So clean!" }],
    expansions: ["7% of the total amount of $1.2 million in the world"],
    height: 410
  },
  {
    id: 11,
    url: "/assets/images/a2.png",
    title: "Vintage Car",
    description: "Classic 1960s car in perfect condition.",
    stats: { saves: 14, likes: 9 },
    comments: [{ user: "Jordan", text: "What a beauty!" }],
    expansions: ["18% of the total amount of $3.2 million in the world"],
    height: 340
  },
  {
    id: 12,
    url: "/assets/images/a3.png",
    title: "Ocean Waves",
    description: "Powerful ocean waves crashing at sunset.",
    stats: { saves: 8, likes: 5 },
    comments: [{ user: "Skyler", text: "So powerful!" }],
    expansions: ["9% of the total amount of $2.1 million in the world"],
    height: 390
  },
  {
    id: 13,
    url: "/assets/images/a4.png",
    title: "Space Nebula",
    description: "Colorful nebula in deep space.",
    stats: { saves: 22, likes: 15 },
    comments: [{ user: "Dakota", text: "Out of this world!" }],
    expansions: ["30% of the total amount of $4.5 million in the world"],
    height: 310
  },
  {
    id: 14,
    url: "/assets/images/a2.png",
    title: "Winter Cabin",
    description: "Cozy cabin in snowy mountains.",
    stats: { saves: 10, likes: 7 },
    comments: [{ user: "Quinn", text: "So cozy!" }],
    expansions: ["12% of the total amount of $1.7 million in the world"],
    height: 440
  },
  {
    id: 15,
    url: "/assets/images/a1.png",
    title: "Fruit Still Life",
    description: "Vibrant fruits in artistic arrangement.",
    stats: { saves: 6, likes: 4 },
    comments: [{ user: "Peyton", text: "Looks delicious!" }],
    expansions: ["8% of the total amount of $1.9 million in the world"],
    height: 370
  },
  {
    id: 16,
    url: "/assets/images/a4.png",
    title: "City Skyline",
    description: "Metropolitan skyline at twilight.",
    stats: { saves: 13, likes: 8 },
    comments: [{ user: "Avery", text: "Urban beauty!" }],
    expansions: ["17% of the total amount of $3.8 million in the world"],
    height: 330
  },
  {
    id: 17,
    url: "/assets/images/a1.png",
    title: "Jungle Adventure",
    description: "Lush green jungle with sunlight filtering through.",
    stats: { saves: 9, likes: 6 },
    comments: [{ user: "Rylan", text: "So tropical!" }],
    expansions: ["11% of the total amount of $2.4 million in the world"],
    height: 400
  },
  {
    id: 18,
    url: "/assets/images/a2.png",
    title: "Abstract Paint",
    description: "Colorful abstract paint strokes.",
    stats: { saves: 7, likes: 5 },
    comments: [{ user: "Sawyer", text: "Very expressive!" }],
    expansions: ["9% of the total amount of $1.3 million in the world"],
    height: 350
  },
  {
    id: 19,
    url: "/assets/images/a3.png",
    title: "Mountain Lake",
    description: "Crystal clear lake surrounded by mountains.",
    stats: { saves: 16, likes: 11 },
    comments: [{ user: "Ellis", text: "Perfect reflection!" }],
    expansions: ["21% of the total amount of $3.1 million in the world"],
    height: 380
  },
  {
    id: 20,
    url: "/assets/images/a4.png",
    title: "Desert Road",
    description: "Long road through endless desert.",
    stats: { saves: 11, likes: 7 },
    comments: [{ user: "Reese", text: "Great perspective!" }],
    expansions: ["15% of the total amount of $2.6 million in the world"],
    height: 420
  },
  {
    id: 21,
    url: "/assets/images/a1.png",
    title: "Beach Sunset",
    description: "Palm trees silhouetted against sunset.",
    stats: { saves: 14, likes: 9 },
    comments: [{ user: "Hayden", text: "Paradise!" }],
    expansions: ["19% of the total amount of $3.3 million in the world"],
    height: 360
  },
  {
    id: 22,
    url: "/assets/images/a2.png",
    title: "Autumn Forest",
    description: "Colorful autumn leaves in sunlight.",
    stats: { saves: 8, likes: 5 },
    comments: [{ user: "Cameron", text: "Fall vibes!" }],
    expansions: ["10% of the total amount of $1.8 million in the world"],
    height: 390
  }
];

export default images;