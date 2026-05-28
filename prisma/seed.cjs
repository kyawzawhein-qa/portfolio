const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log("Starting database seeding...");
    
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.skill.deleteMany({});
    await prisma.education.deleteMany({});
    await prisma.experience.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.testimonial.deleteMany({});
    await prisma.certification.deleteMany({});
    await prisma.profile.deleteMany({});
    
    console.log("Creating profile...");
    const profile = await prisma.profile.create({
      data: {
        name: "Kyaw Zaw Hein",
        title: "QA Engineer",
        email: "kyawzaw.hein.qa@gmail.com",
        phone: "(929) 677-9606",
        location: "Yangon, Myanmar",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        intro:
          "FinTech-focused QA Engineer blending rigorous manual testing with scalable TypeScript + Playwright automation across high-volume trading and payment platforms.",
        summary:
          "Experienced QA Engineer with over five years of expertise in manual and automation testing across e-commerce, FinTech, and trading platforms. Strong in SDLC/STLC, Agile execution, API and backend validation, and CI-integrated quality engineering.",
      }
    });
    
    console.log("Creating skills...");
    const skills = [
      { name: "Python", category: "Language" },
      { name: "JavaScript", category: "Language" },
      { name: "TypeScript", category: "Language" },
      { name: "HTML/CSS", category: "Language" },
      { name: "SQL", category: "Database" },
      { name: "MS SQL", category: "Database" },
      { name: "MySQL", category: "Database" },
      { name: "DBeaver", category: "Database" },
      { name: "Playwright", category: "Automation" },
      { name: "Postman", category: "API Testing" },
      { name: "JIRA", category: "Project" },
      { name: "Zephyr", category: "Project" },
      { name: "GitHub Actions", category: "CI/CD" }
    ];
    
    await prisma.skill.createMany({
      data: skills.map(skill => ({ ...skill, profileId: profile.id }))
    });
    
    console.log("Creating education...");
    await prisma.education.create({
      data: {
        institution: "Yangon University",
        degree: "Associate Degree in Software Engineering",
        startYear: 2018,
        endYear: 2020,
        profileId: profile.id
      }
    });
    
    console.log("Creating experiences...");
    const experiences = [
      {
        role: "QA Engineer",
        company: "SoFi Invest",
        description:
          "Testing modern stock trading, ETF, and automated investment workflows with a strong focus on reliability and order lifecycle accuracy.",
        startDate: new Date("2024-05-01"),
        isCurrent: true,
        order: 1,
        highlights: [
          {
            text: "Validated market, limit, and stop order flows plus trade lifecycle from placement to settlement.",
            order: 1
          },
          {
            text: "Scaled Playwright + TypeScript framework (POM) and integrated automation into CI pipelines.",
            order: 2
          },
          {
            text: "Used SQL and FIX log analysis on Linux/UNIX to verify backend data and protocol-level accuracy.",
            order: 3
          },
          {
            text: "Executed smoke, sanity, GUI, E2E, and regression suites in Agile sprint cycles.",
            order: 4
          }
        ]
      },
      {
        role: "QA Analyst",
        company: "Credit Karma",
        description:
          "Quality assurance for financial reporting and recommendation systems with strong functional, API, and regression coverage.",
        startDate: new Date("2022-05-01"),
        endDate: new Date("2024-04-01"),
        isCurrent: false,
        order: 2,
        highlights: [
          {
            text: "Documented and tracked 50+ defects with clear reproduction details to improve fix turnaround.",
            order: 1
          },
          {
            text: "Performed API/backend validation to ensure data synchronization across fintech services.",
            order: 2
          },
          {
            text: "Contributed to RTM and test strategy to improve business requirement traceability.",
            order: 3
          }
        ]
      },
      {
        role: "QA Junior",
        company: "Paypal",
        description:
          "Executed high-volume test coverage for payment gateway flows and helped drive the transition toward Agile QA practices.",
        startDate: new Date("2021-02-01"),
        endDate: new Date("2022-02-01"),
        isCurrent: false,
        order: 3,
        highlights: [
          {
            text: "Executed 300+ manual and automated test cases for critical payment gateway modules.",
            order: 1
          },
          {
            text: "Assisted in converting manual regression scope to TypeScript automation, improving efficiency by 10%.",
            order: 2
          },
          {
            text: "Partnered with developers and product owners to improve release quality and predictability.",
            order: 3
          }
        ]
      }
    ];
    
    for (const expData of experiences) {
      const { highlights, ...experienceData } = expData;
      const experience = await prisma.experience.create({
        data: {
          ...experienceData,
          profileId: profile.id
        }
      });
      
      if (highlights && highlights.length > 0) {
        await prisma.experienceHighlight.createMany({
          data: highlights.map(h => ({ ...h, experienceId: experience.id }))
        });
      }
    }
    
    console.log("Creating projects...");
    const projects = [
      {
        title: "FinTech Trading Platform Test Automation",
        description: "End-to-end test automation framework for a high-frequency trading platform using Playwright and TypeScript, reducing regression testing time by 70%.",
        technologies: ["TypeScript", "Playwright", "GitHub Actions", "SQL", "Docker"],
        url: "https://github.com/kyawzawhein/trading-platform-tests",
        githubUrl: "https://github.com/kyawzawhein/trading-platform-tests",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        featured: true,
        order: 1
      },
      {
        title: "Payment Gateway Validation Suite",
        description: "Comprehensive test suite for payment gateway integrations covering credit cards, digital wallets, and bank transfers across multiple currencies.",
        technologies: ["Java", "Selenium", "TestNG", "REST Assured", "Jenkins"],
        url: "https://github.com/kyawzawhein/payment-gateway-tests",
        githubUrl: "https://github.com/kyawzawhein/payment-gateway-tests",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
        featured: true,
        order: 2
      },
      {
        title: "E-commerce Platform Quality Dashboard",
        description: "Real-time quality metrics dashboard built with React and D3.js, providing visibility into test execution, defect trends, and release readiness.",
        technologies: ["React", "TypeScript", "D3.js", "Chart.js", "WebSocket"],
        url: "https://github.com/kyawzawhein/quality-dashboard",
        githubUrl: "https://github.com/kyawzawhein/quality-dashboard",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
        featured: false,
        order: 3
      }
    ];
    
    await prisma.project.createMany({
      data: projects.map(p => ({
        ...p,
        technologies: JSON.stringify(p.technologies),
        profileId: profile.id
      }))
    });
    
    console.log("Creating testimonials...");
    const testimonials = [
      {
        name: "Sarah Chen",
        role: "Engineering Manager",
        company: "SoFi Invest",
        content: "Kyaw Zaw Hein has been instrumental in improving our release quality and reducing production incidents through his meticulous approach to test automation and risk-based testing.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&face=face",
        order: 1
      },
      {
        name: "Michael Rodriguez",
        role: "Senior QA Lead",
        company: "Credit Karma",
        content: "His expertise in API testing and backend validation significantly improved our test coverage and helped us catch critical issues before they reached production.",
        rating: 5,
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&face=face",
        order: 2
      },
      {
        name: "James Wilson",
        role: "Director of Quality Engineering",
        company: "Paypal",
        content: "Kyaw Zaw Hein played a key role in our transition to Agile QA practices, helping teams adopt better testing strategies and improve collaboration.",
        rating: 4,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&face=face",
        order: 3
      }
    ];
    
    await prisma.testimonial.createMany({
      data: testimonials.map(t => ({ ...t, profileId: profile.id }))
    });
    
    console.log("Creating certifications...");
    const certifications = [
      {
        name: "ISTQB Certified Tester Foundation Level",
        issuer: "International Software Testing Qualifications Board",
        date: new Date("2020-06-15"),
        expiryDate: null,
        credentialId: "ISTQB-FL-2020-00123",
        credentialUrl: "https://www.istqb.org/certification"
      },
      {
        name: "Certified Selenium Professional",
        issuer: "Selenium Official",
        date: new Date("2021-03-22"),
        expiryDate: new Date("2024-03-22"),
        credentialId: "CSP-2021-00456",
        credentialUrl: "https://www.selenium.dev/certification"
      }
    ];
    
    await prisma.certification.createMany({
      data: certifications.map(c => ({ ...c, profileId: profile.id }))
    });
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
