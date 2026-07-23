import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("Seeding database...");

  const client = await pool.connect();
  try {
    // Admin User
    const adminPassword = await hashPassword("admin");
    await client.query(`
      INSERT INTO "User" (id, email, password, name, "nameAr", role, "emailVerified", "isActive", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'yossefkhaled551@gmail.com',
        $1,
        'Eng. Youssef Khaled',
        'م. يوسف خالد',
        'SUPER_ADMIN',
        NOW(),
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET password = $1, name = 'Eng. Youssef Khaled', role = 'SUPER_ADMIN'
    `, [adminPassword]);
    console.log("  Admin user created/updated");

    // Course Categories
    const categories = [
      { name: "Programming", nameAr: "البرمجة", slug: "programming", icon: "Code2", color: "#1976FF" },
      { name: "Artificial Intelligence", nameAr: "الذكاء الاصطناعي", slug: "artificial-intelligence", icon: "Brain", color: "#00C2FF" },
      { name: "Web Development", nameAr: "تطوير الويب", slug: "web-development", icon: "Globe", color: "#2DA6FF" },
      { name: "Mobile Development", nameAr: "تطوير التطبيقات", slug: "mobile-development", icon: "Smartphone", color: "#0C1F4F" },
    ];

    for (const cat of categories) {
      await client.query(`
        INSERT INTO "CourseCategory" (id, name, "nameAr", slug, icon, color, "order", "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 0, true, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING
      `, [cat.name, cat.nameAr, cat.slug, cat.icon, cat.color]);
    }
    console.log("  Course categories created");

    // Get category IDs
    const catResult = await client.query(`SELECT id, slug FROM "CourseCategory"`);
    const catMap: Record<string, string> = {};
    for (const row of catResult.rows) {
      catMap[row.slug] = row.id;
    }

    // Get admin user ID
    const adminResult = await client.query(`SELECT id FROM "User" WHERE email = 'yossefkhaled551@gmail.com'`);
    const adminId = adminResult.rows[0]?.id;

    // Sample Courses
    const courses = [
      {
        title: "Python Programming Fundamentals",
        titleAr: "أساسيات البرمجة بلغة بايثون",
        slug: "python-fundamentals",
        description: "Master Python from basics to advanced concepts. Learn data types, control flow, functions, OOP, and more.",
        shortDescription: "Learn Python programming from scratch",
        category: "programming",
        level: "BEGINNER",
        duration: 40,
        price: 0,
        isFree: true,
        isPublished: true,
        isFeatured: true,
      },
      {
        title: "JavaScript & React Masterclass",
        titleAr: "دورة جافاسكريبت وريأكت الشاملة",
        slug: "javascript-react-masterclass",
        description: "Complete JavaScript and React development course. Build modern web applications from scratch.",
        shortDescription: "Build modern web apps with JS and React",
        category: "web-development",
        level: "INTERMEDIATE",
        duration: 60,
        price: 1999,
        isFree: false,
        isPublished: true,
        isFeatured: true,
      },
      {
        title: "AI & Machine Learning Introduction",
        titleAr: "مقدمة في الذكاء الاصطناعي والتعلم الآلي",
        slug: "ai-ml-introduction",
        description: "Introduction to artificial intelligence and machine learning. Understand neural networks, deep learning, and practical AI applications.",
        shortDescription: "Explore AI and Machine Learning",
        category: "artificial-intelligence",
        level: "BEGINNER",
        duration: 35,
        price: 2499,
        isFree: false,
        isPublished: true,
        isFeatured: true,
      },
    ];

    const courseIds: string[] = [];
    for (const course of courses) {
      const result = await client.query(`
        INSERT INTO "Course" (id, title, "titleAr", slug, description, "shortDescription", "categoryId", "instructorId", level, duration, price, "isFree", "isPublished", "isFeatured", "enrolledCount", rating, "reviewCount", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0, 0, 0, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING
        RETURNING id
      `, [course.title, course.titleAr, course.slug, course.description, course.shortDescription, catMap[course.category], adminId, course.level, course.duration, course.price, course.isFree, course.isPublished, course.isFeatured]);
      if (result.rows[0]) courseIds.push(result.rows[0].id);
    }
    console.log("  Courses created");

    // Modules and Lessons for Python course
    if (courseIds[0]) {
      const modules = [
        { title: "Getting Started with Python", lessons: ["Introduction to Python", "Setting Up Your Environment", "Your First Python Program", "Python Syntax Basics"] },
        { title: "Data Types & Variables", lessons: ["Numbers and Strings", "Lists and Tuples", "Dictionaries and Sets", "Type Conversion"] },
        { title: "Control Flow", lessons: ["If/Else Statements", "For Loops", "While Loops", "Break and Continue"] },
      ];

      let moduleOrder = 1;
      for (const mod of modules) {
        const modResult = await client.query(`
          INSERT INTO "Module" (id, title, "courseId", "order", "isPublished", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, $2, $3, true, NOW(), NOW()) RETURNING id
        `, [mod.title, courseIds[0], moduleOrder++]);
        const moduleId = modResult.rows[0]?.id;

        if (moduleId) {
          let lessonOrder = 1;
          for (const lessonTitle of mod.lessons) {
            await client.query(`
              INSERT INTO "Lesson" (id, title, "moduleId", "order", "isFree", "isPublished", duration, "createdAt", "updatedAt")
              VALUES (gen_random_uuid(), $1, $2, $3, true, true, 15, NOW(), NOW())
            `, [lessonTitle, moduleId, lessonOrder++]);
          }
        }
      }
      console.log("  Python course modules and lessons created");
    }

    // FAQs
    const faqs = [
      { question: "What courses does YK Academy offer?", answer: "We offer courses in Programming, Artificial Intelligence, Web Development, and Mobile Development. Our courses range from beginner to advanced levels.", category: "General", order: 1 },
      { question: "Are the courses online or offline?", answer: "We offer both online and offline learning options. You can choose the format that works best for you.", category: "General", order: 2 },
      { question: "Do I get a certificate after completing a course?", answer: "Yes! Upon successful completion of a course, you receive a professional certificate from YK Academy that you can share on LinkedIn and your resume.", category: "Courses", order: 3 },
      { question: "What is the refund policy?", answer: "We offer a 30-day money-back guarantee on all paid courses. If you're not satisfied, contact us for a full refund.", category: "Payment", order: 4 },
      { question: "Can I access course materials after completion?", answer: "Yes, you have lifetime access to all course materials, including future updates.", category: "Courses", order: 5 },
      { question: "How do I contact support?", answer: "You can reach us via email at support@ykacademy.com, WhatsApp, or through the contact form on our website.", category: "Support", order: 6 },
    ];

    for (const faq of faqs) {
      await client.query(`
        INSERT INTO "FAQ" (id, question, answer, category, "order", "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW())
      `, [faq.question, faq.answer, faq.category, faq.order]);
    }
    console.log("  FAQs created");

    // Testimonials
    const testimonials = [
      { name: "Ahmed Hassan", role: "Software Engineer", content: "YK Academy transformed my career. The Python course was incredibly well-structured and the instructors are amazing.", rating: 5, isFeatured: true },
      { name: "Fatima Ali", role: "Data Scientist", content: "The AI course gave me a solid foundation in machine learning. I landed my dream job thanks to the skills I learned here.", rating: 5, isFeatured: true },
      { name: "Omar Mohamed", role: "Web Developer", content: "Best investment in my education. The React masterclass is comprehensive and practical.", rating: 5, isFeatured: true },
      { name: "Layla Ibrahim", role: "Student", content: "The teaching quality is outstanding. Complex concepts are explained in a way that's easy to understand.", rating: 4, isFeatured: true },
    ];

    for (const t of testimonials) {
      await client.query(`
        INSERT INTO "Testimonial" (id, name, role, content, rating, "isFeatured", "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW())
      `, [t.name, t.role, t.content, t.rating, t.isFeatured]);
    }
    console.log("  Testimonials created");

    // Site Settings
    const settings = [
      { key: "site_name", value: "YK Academy", group: "general", type: "STRING" },
      { key: "site_description", value: "Premier programming and AI education platform", group: "general", type: "STRING" },
      { key: "contact_email", value: "contact@ykacademy.com", group: "contact", type: "STRING" },
      { key: "contact_phone", value: "+20 100 000 0000", group: "contact", type: "STRING" },
      { key: "contact_address", value: "Cairo, Egypt", group: "contact", type: "STRING" },
      { key: "whatsapp", value: "+201000000000", group: "contact", type: "STRING" },
      { key: "facebook", value: "https://facebook.com/ykacademy", group: "social", type: "STRING" },
      { key: "youtube", value: "https://youtube.com/@ykacademy", group: "social", type: "STRING" },
    ];

    for (const s of settings) {
      await client.query(`
        INSERT INTO "SiteSetting" (id, "key", value, "group", type, "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
        ON CONFLICT ("key") DO UPDATE SET value = $2
      `, [s.key, s.value, s.group, s.type]);
    }
    console.log("  Site settings created");

    console.log("\nDatabase seeded successfully!");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
