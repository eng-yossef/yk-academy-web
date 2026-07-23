import { PrismaClient, Role, CourseLevel, BlogStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("Seeding database...");

  // ─── Admin User ───────────────────────────
  const adminPassword = await hashPassword("admin");
  const admin = await prisma.user.upsert({
    where: { email: "yossefkhaled551@gmail.com" },
    update: {},
    create: {
      email: "yossefkhaled551@gmail.com",
      name: "Eng. Youssef Khaled",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
      isActive: true,
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // ─── Course Categories ────────────────────
  const categoriesData = [
    {
      name: "Programming",
      nameAr: "البرمجة",
      slug: "programming",
      description: "Master programming languages and software development",
      icon: "Code2",
      color: "#2563eb",
      order: 1,
    },
    {
      name: "Artificial Intelligence",
      nameAr: "الذكاء الاصطناعي",
      slug: "artificial-intelligence",
      description: "Learn AI, machine learning, and deep learning",
      icon: "Brain",
      color: "#06b6d4",
      order: 2,
    },
    {
      name: "Web Development",
      nameAr: "تطوير المواقع",
      slug: "web-development",
      description: "Build modern web applications from scratch",
      icon: "Globe",
      color: "#10b981",
      order: 3,
    },
    {
      name: "Mobile Development",
      nameAr: "تطوير التطبيقات",
      slug: "mobile-development",
      description: "Create mobile apps for iOS and Android",
      icon: "Smartphone",
      color: "#8b5cf6",
      order: 4,
    },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.courseCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, nameAr: cat.nameAr, description: cat.description, icon: cat.icon, color: cat.color, order: cat.order },
      create: cat,
    });
    categories.push(category);
  }
  console.log(`${categories.length} categories created`);

  // ─── Courses ──────────────────────────────
  const programmingCat = categories.find((c) => c.slug === "programming")!;
  const aiCat = categories.find((c) => c.slug === "artificial-intelligence")!;
  const webCat = categories.find((c) => c.slug === "web-development")!;

  const coursesData = [
    {
      title: "Python Programming Masterclass",
      titleAr: "دورة شاملة في برمجة بايثون",
      slug: "python-programming-masterclass",
      description:
        "Comprehensive Python course covering fundamentals, OOP, data structures, and real-world projects. Perfect for beginners and intermediate developers.",
      shortDescription: "Learn Python from scratch with hands-on projects",
      level: CourseLevel.BEGINNER,
      price: 0,
      isFree: true,
      isPublished: true,
      isFeatured: true,
      language: "ar",
      tags: ["python", "programming", "beginner"],
      requirements: ["Basic computer skills", "Internet connection"],
      learningOutcomes: [
        "Write Python programs from scratch",
        "Understand OOP concepts",
        "Work with data structures",
        "Build real-world projects",
      ],
      prerequisites: [],
      duration: 40,
      categoryId: programmingCat.id,
      instructorId: admin.id,
      modules: {
        create: [
          {
            title: "Python Basics",
            description: "Get started with Python fundamentals",
            order: 1,
            isPublished: true,
            lessons: {
              create: [
                { title: "Introduction to Python", order: 1, isFree: true, isPublished: true, duration: 15, description: "What is Python and why learn it" },
                { title: "Setting Up Your Environment", order: 2, isFree: true, isPublished: true, duration: 10, description: "Install Python and VS Code" },
                { title: "Variables and Data Types", order: 3, isPublished: true, duration: 20, description: "Understanding variables, strings, and numbers" },
                { title: "Control Flow", order: 4, isPublished: true, duration: 25, description: "If statements, loops, and conditionals" },
              ],
            },
          },
          {
            title: "Object-Oriented Programming",
            description: "Master OOP in Python",
            order: 2,
            isPublished: true,
            lessons: {
              create: [
                { title: "Classes and Objects", order: 1, isPublished: true, duration: 30, description: "Creating and using classes" },
                { title: "Inheritance and Polymorphism", order: 2, isPublished: true, duration: 25, description: "Advanced OOP concepts" },
                { title: "Magic Methods", order: 3, isPublished: true, duration: 20, description: "Dunder methods and operator overloading" },
              ],
            },
          },
        ],
      },
    },
    {
      title: "Machine Learning with Python",
      titleAr: "التعلم الآلي باستخدام بايثون",
      slug: "machine-learning-with-python",
      description:
        "Dive into machine learning with scikit-learn, TensorFlow, and real datasets. Learn regression, classification, clustering, and neural networks.",
      shortDescription: "Build intelligent systems with ML algorithms",
      level: CourseLevel.INTERMEDIATE,
      price: 499,
      discountPrice: 399,
      isPublished: true,
      isFeatured: true,
      language: "ar",
      tags: ["machine-learning", "python", "AI", "data-science"],
      requirements: ["Python basics", "High school math"],
      learningOutcomes: [
        "Understand ML algorithms",
        "Build prediction models",
        "Work with real datasets",
        "Deploy ML models",
      ],
      prerequisites: ["Python Programming Masterclass"],
      duration: 60,
      categoryId: aiCat.id,
      instructorId: admin.id,
      modules: {
        create: [
          {
            title: "Introduction to ML",
            description: "Foundations of machine learning",
            order: 1,
            isPublished: true,
            lessons: {
              create: [
                { title: "What is Machine Learning?", order: 1, isFree: true, isPublished: true, duration: 15, description: "Overview of ML concepts" },
                { title: "Types of ML", order: 2, isPublished: true, duration: 20, description: "Supervised, unsupervised, and reinforcement learning" },
                { title: "Setting Up ML Environment", order: 3, isPublished: true, duration: 15, description: "Installing libraries" },
              ],
            },
          },
          {
            title: "Supervised Learning",
            description: "Regression and classification algorithms",
            order: 2,
            isPublished: true,
            lessons: {
              create: [
                { title: "Linear Regression", order: 1, isPublished: true, duration: 30, description: "Fitting lines to data" },
                { title: "Logistic Regression", order: 2, isPublished: true, duration: 25, description: "Binary classification" },
                { title: "Decision Trees", order: 3, isPublished: true, duration: 25, description: "Tree-based models" },
              ],
            },
          },
        ],
      },
    },
    {
      title: "Full-Stack Web Development",
      titleAr: "تطوير الويب الشامل",
      slug: "full-stack-web-development",
      description:
        "Complete web development bootcamp covering HTML, CSS, JavaScript, React, Node.js, databases, and deployment. Build 10+ real projects.",
      shortDescription: "Become a full-stack developer from zero",
      level: CourseLevel.BEGINNER,
      price: 799,
      discountPrice: 599,
      isPublished: true,
      isFeatured: true,
      language: "ar",
      tags: ["web-development", "react", "nodejs", "fullstack"],
      requirements: ["Basic computer skills", "Internet connection"],
      learningOutcomes: [
        "Build responsive websites",
        "Master React and Node.js",
        "Work with databases",
        "Deploy applications to production",
      ],
      prerequisites: [],
      duration: 100,
      categoryId: webCat.id,
      instructorId: admin.id,
      modules: {
        create: [
          {
            title: "HTML & CSS Fundamentals",
            description: "Build the foundation of web development",
            order: 1,
            isPublished: true,
            lessons: {
              create: [
                { title: "HTML Essentials", order: 1, isFree: true, isPublished: true, duration: 20, description: "Tags, elements, and structure" },
                { title: "CSS Styling", order: 2, isFree: true, isPublished: true, duration: 25, description: "Selectors, layout, and responsive design" },
                { title: "Flexbox & Grid", order: 3, isPublished: true, duration: 30, description: "Modern CSS layout techniques" },
              ],
            },
          },
          {
            title: "JavaScript Deep Dive",
            description: "Master modern JavaScript",
            order: 2,
            isPublished: true,
            lessons: {
              create: [
                { title: "JavaScript Basics", order: 1, isPublished: true, duration: 25, description: "Variables, functions, and scope" },
                { title: "ES6+ Features", order: 2, isPublished: true, duration: 30, description: "Arrow functions, destructuring, modules" },
                { title: "Async JavaScript", order: 3, isPublished: true, duration: 30, description: "Promises, async/await, fetch API" },
              ],
            },
          },
        ],
      },
    },
  ];

  for (const courseData of coursesData) {
    const { modules: modulesData, ...courseFields } = courseData;
    const course = await prisma.course.upsert({
      where: { slug: courseFields.slug },
      update: courseFields,
      create: {
        ...courseFields,
        modules: modulesData,
      },
      include: { modules: true },
    });
    console.log(`Course created: ${course.title}`);
  }

  // ─── FAQ Items ────────────────────────────
  const faqsData = [
    { question: "What courses does YK Academy offer?", answer: "We offer courses in programming, AI, web development, and mobile development. Our courses range from beginner to advanced levels.", category: "general", order: 1 },
    { question: "Are the courses available in Arabic?", answer: "Yes! All our courses are taught in Arabic with English technical terms to help you learn in your native language.", category: "general", order: 2 },
    { question: "Can I get a certificate after completing a course?", answer: "Yes, you receive a verified certificate upon completing all course modules and passing the final assessment.", category: "courses", order: 3 },
    { question: "Do you offer payment plans?", answer: "Yes, we offer flexible payment plans for paid courses. You can split the cost into monthly installments.", category: "pricing", order: 4 },
    { question: "How do I access course materials?", answer: "Once enrolled, you can access all course materials through your student dashboard, including videos, documents, and assignments.", category: "courses", order: 5 },
    { question: "Can I get a refund if I'm not satisfied?", answer: "We offer a 14-day money-back guarantee for paid courses if you're not satisfied with the content.", category: "pricing", order: 6 },
  ];

  for (const faq of faqsData) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`${faqsData.length} FAQ items created`);

  // ─── Testimonials ─────────────────────────
  const testimonialsData = [
    { name: "Ahmed Mohamed", role: "Software Developer", content: "YK Academy transformed my career. The Python course was comprehensive and the projects really helped me land my first developer job.", rating: 5, isFeatured: true },
    { name: "Fatma Hassan", role: "Computer Science Student", content: "The best online learning platform I've used. The Arabic courses make it so much easier to understand complex topics.", rating: 5, isFeatured: true },
    { name: "Omar Ibrahim", role: "Data Analyst", content: "The Machine Learning course was exactly what I needed. The instructor explains everything clearly with real-world examples.", rating: 5, isFeatured: true },
    { name: "Nour El-Din", role: "Freelance Developer", content: "I went from knowing nothing about web development to building full-stack applications. Thank you, YK Academy!", rating: 5, isFeatured: true },
  ];

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log(`${testimonialsData.length} testimonials created`);

  // ─── Site Settings ────────────────────────
  const settingsData = [
    { key: "site_name", value: "YK Academy", type: "STRING" as const, group: "general" },
    { key: "site_description", value: "Online learning platform for technology and programming courses", type: "STRING" as const, group: "general" },
    { key: "site_email", value: "info@ykacademy.com", type: "STRING" as const, group: "contact" },
    { key: "site_phone", value: "+20 100 000 0000", type: "STRING" as const, group: "contact" },
    { key: "site_address", value: "Cairo, Egypt", type: "STRING" as const, group: "contact" },
    { key: "footer_text", value: "2024 YK Academy. All rights reserved.", type: "STRING" as const, group: "general" },
    { key: "hero_title", value: "Master Programming & AI", type: "STRING" as const, group: "home" },
    { key: "hero_subtitle", value: "Join thousands of students learning technology with YK Academy", type: "STRING" as const, group: "home" },
  ];

  for (const setting of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`${settingsData.length} site settings created`);

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
