// src/services/api.js
const MOCK_DATA = [
  {
    id: 1,
    title: "Programming Classes",
    category: "Tutorials",
    rating: 4.9,
    price: 15.00,
    author: "Liz Pillajo",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80"
  },
  {
    id: 2,
    title: "Homemade Lunch",
    category: "Food",
    rating: 4.8,
    price: 3.50,
    author: "Gastronomy Club",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80"
  },
  {
    id: 3,
    title: "Logo Design Professional", // Título un poco más largo para probar
    category: "Design",
    rating: 4.7,
    price: 20.00,
    author: "Arts Student",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80"
  },
  {
    id: 4,
    title: "English Tutoring",
    category: "Tutorials",
    rating: 4.5,
    price: 10.00,
    author: "Language Dept",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80"
  }
];

export const fetchServices = async () => {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_DATA), 800));
};

// Simular buscar un servicio específico
export const fetchServiceById = async (id) => {
  // Simulamos un retraso de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retornamos datos falsos detallados (hardcoded para el ejemplo)
  return {
    id: id,
    title: "Programming Classes",
    description: "Want to learn how to code but don't know where to start? I'm a Systems Engineering student at UCE and have been teaching programming for 3 years. I've helped over 50 students pass their courses.",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    category: "Tutorials",
    rating: 4.9,
    reviewsCount: 47,
    price: 15.00,
    unit: "/ hour",
    author: {
      name: "Liz Pillajo",
      major: "Systems Engineering",
      semester: "7th semester",
      avatar: "LP",
      memberSince: "March 2023",
      responseTime: "< 1 hour"
    },
    features: [
      "Personalized classes tailored to your level",
      "Preparation for university exams",
      "Practical, real-world projects",
      "Ongoing support via WhatsApp",
      "Study materials included"
    ],
    pricingPackages: [
      { name: "Individual class (1 hour)", price: 15.00 },
      { name: "Package of 4 classes", price: 50.00 },
      { name: "Group class (2-4 people)", price: 10.00 },
      { name: "Exam preparation", price: 20.00 }
    ]
  };
};