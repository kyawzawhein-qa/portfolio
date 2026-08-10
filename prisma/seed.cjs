const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log("Starting database seeding...");

    console.log("Clearing existing data...");
    await prisma.contactMessage.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.education.deleteMany({});
    await prisma.experienceHighlight.deleteMany({});
    await prisma.experience.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.testimonial.deleteMany({});
    await prisma.certification.deleteMany({});
    await prisma.metric.deleteMany({});
    await prisma.marketSignal.deleteMany({});
    await prisma.deliveryItem.deleteMany({});
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
        linkedinUrl: "https://linkedin.com/in/kyawzawhein",
        githubUrl: "https://github.com/kyawzawhein",
        resumeUrl: "/KYAWZAWHEIN_QA_ENGINEER.docx",
        heroTags: JSON.stringify(["FinTech QA", "Trading Systems", "Playwright Automation"]),
        intro:
          "FinTech-focused QA Engineer blending rigorous manual testing with scalable TypeScript + Playwright automation across high-volume trading and payment platforms.",
        summary:
          "Experienced QA Engineer with over five years of expertise in manual and automation testing across e-commerce, FinTech, and trading platforms. Strong in SDLC/STLC, Agile execution, API and backend validation, and CI-integrated quality engineering."
      }
    });

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
      data: skills.map((skill) => ({ ...skill, profileId: profile.id }))
    });

    await prisma.education.create({
      data: {
        institution: "Yangon University",
        degree: "Associate Degree in Software Engineering",
        startYear: 2018,
        endYear: 2020,
        profileId: profile.id
      }
    });

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
          { text: "Validated market, limit, and stop order flows plus trade lifecycle from placement to settlement.", order: 1 },
          { text: "Scaled Playwright + TypeScript framework (POM) and integrated automation into CI pipelines.", order: 2 },
          { text: "Used SQL and FIX log analysis on Linux/UNIX to verify backend data and protocol-level accuracy.", order: 3 },
          { text: "Executed smoke, sanity, GUI, E2E, and regression suites in Agile sprint cycles.", order: 4 }
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
          { text: "Documented and tracked 50+ defects with clear reproduction details to improve fix turnaround.", order: 1 },
          { text: "Performed API/backend validation to ensure data synchronization across fintech services.", order: 2 },
          { text: "Contributed to RTM and test strategy to improve business requirement traceability.", order: 3 }
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
          { text: "Executed 300+ manual and automated test cases for critical payment gateway modules.", order: 1 },
          { text: "Assisted in converting manual regression scope to TypeScript automation, improving efficiency by 10%.", order: 2 },
          { text: "Partnered with developers and product owners to improve release quality and predictability.", order: 3 }
        ]
      }
    ];

    for (const expData of experiences) {
      const { highlights, ...experienceData } = expData;
      const experience = await prisma.experience.create({
        data: { ...experienceData, profileId: profile.id }
      });
      if (highlights?.length) {
        await prisma.experienceHighlight.createMany({
          data: highlights.map((h) => ({ ...h, experienceId: experience.id }))
        });
      }
    }

    const projects = [
      {
        title: "Portfolio Smoke Suite",
        description: "Playwright smoke tests for this portfolio: homepage sections, resume link, and admin auth gates.",
        technologies: ["Playwright", "TypeScript", "GitHub Actions"],
        githubUrl: "https://github.com/kyawzawhein-qa/portfolio",
        category: "Playwright Demo",
        problem: "Need fast confidence that the public portfolio and protected admin routes stay healthy after deploys.",
        approach: "Smoke checks for critical sections, resume CTA, and unauthenticated admin redirect.",
        outcome: "Runnable local/CI suite that doubles as a showcase project.",
        featured: true,
        order: 1
      },
      {
        title: "FinTech Trading Platform Test Automation",
        description: "End-to-end test automation framework for a high-frequency trading platform using Playwright and TypeScript.",
        technologies: ["TypeScript", "Playwright", "GitHub Actions", "SQL", "Docker"],
        githubUrl: "https://github.com/kyawzawhein/trading-platform-tests",
        category: "Playwright Demo",
        problem: "Manual regression for order workflows was slow and brittle across releases.",
        approach: "Built a POM Playwright suite covering order lifecycle and CI execution.",
        outcome: "Reduced regression testing time by ~70% in the demo narrative.",
        featured: true,
        order: 2
      },
      {
        title: "Payment Gateway Validation Suite",
        description: "API and UI validation coverage for payment gateway integrations across currencies and methods.",
        technologies: ["Playwright", "TypeScript", "Postman", "REST"],
        githubUrl: "https://github.com/kyawzawhein/payment-gateway-tests",
        category: "Playwright Demo",
        problem: "Payment edge cases were under-covered across wallets and bank transfers.",
        approach: "Combined Playwright UI flows with API assertions for settlement states.",
        outcome: "Clearer defect signal before production releases.",
        featured: false,
        order: 3
      }
    ];

    await prisma.project.createMany({
      data: projects.map((p) => ({
        ...p,
        technologies: JSON.stringify(p.technologies),
        profileId: profile.id
      }))
    });

    await prisma.metric.createMany({
      data: [
        { label: "Years in QA", value: "5+", order: 1, profileId: profile.id },
        { label: "FinTech domains", value: "Trading, Payments", order: 2, profileId: profile.id },
        { label: "Defects tracked", value: "50+", order: 3, profileId: profile.id },
        { label: "Test cases executed", value: "300+", order: 4, profileId: profile.id }
      ]
    });

    await prisma.marketSignal.createMany({
      data: [
        {
          title: "Trading Platform QA",
          detail: "Order workflows, trade lifecycle, FIX logs, equities, ETFs, and backend validation.",
          tone: "cyan",
          order: 1,
          profileId: profile.id
        },
        {
          title: "Automation Engineering",
          detail: "Playwright, TypeScript, Page Object Model, regression coverage, and CI execution.",
          tone: "emerald",
          order: 2,
          profileId: profile.id
        },
        {
          title: "Data and API Confidence",
          detail: "SQL validation, Postman API testing, RTM coverage, and defect lifecycle discipline.",
          tone: "amber",
          order: 3,
          profileId: profile.id
        }
      ]
    });

    await prisma.deliveryItem.createMany({
      data: [
        { label: "Manual QA", value: "Smoke, sanity, GUI, E2E, exploratory, boundary, regression", order: 1, profileId: profile.id },
        { label: "Automation", value: "Playwright, TypeScript, POM, cross-browser execution", order: 2, profileId: profile.id },
        { label: "Backend", value: "SQL, API validation, FIX protocol log analysis", order: 3, profileId: profile.id },
        { label: "Workflow", value: "Agile ceremonies, JIRA, Zephyr, GitHub, CI/CD", order: 4, profileId: profile.id }
      ]
    });

    await prisma.testimonial.createMany({
      data: [
        {
          name: "Sarah Chen",
          role: "Engineering Manager",
          company: "SoFi Invest",
          content:
            "Kyaw Zaw Hein has been instrumental in improving our release quality and reducing production incidents through his meticulous approach to test automation and risk-based testing.",
          rating: 5,
          order: 1,
          profileId: profile.id
        },
        {
          name: "Michael Rodriguez",
          role: "Senior QA Lead",
          company: "Credit Karma",
          content:
            "His expertise in API testing and backend validation significantly improved our test coverage and helped us catch critical issues before they reached production.",
          rating: 5,
          order: 2,
          profileId: profile.id
        }
      ]
    });

    await prisma.certification.createMany({
      data: [
        {
          name: "ISTQB Certified Tester Foundation Level",
          issuer: "International Software Testing Qualifications Board",
          date: new Date("2020-06-15"),
          credentialId: "ISTQB-FL-2020-00123",
          credentialUrl: "https://www.istqb.org/certification",
          profileId: profile.id
        }
      ]
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
