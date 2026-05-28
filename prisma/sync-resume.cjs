const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const skills = [
  { name: "Python", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "TypeScript", category: "Languages" },
  { name: "SQL", category: "Languages" },
  { name: "HTML/CSS", category: "Languages" },
  { name: "MS SQL", category: "RDBMS" },
  { name: "MySQL", category: "RDBMS" },
  { name: "DBeaver", category: "RDBMS" },
  { name: "VS Code", category: "Testing Tools" },
  { name: "Playwright", category: "Testing Tools" },
  { name: "Postman", category: "Testing Tools" },
  { name: "GitHub Actions", category: "Deployment Tools" },
  { name: "Git", category: "Deployment Tools" },
  { name: "GitHub", category: "Deployment Tools" },
  { name: "JIRA", category: "Bug Tracking Tools" },
  { name: "Zephyr", category: "Bug Tracking Tools" },
  { name: "Windows", category: "Platforms" },
  { name: "Linux", category: "Platforms" },
  { name: "Mac OSX", category: "Platforms" },
  { name: "SDLC/STLC", category: "QA Process" },
  { name: "Agile", category: "QA Process" },
  { name: "Waterfall", category: "QA Process" },
  { name: "RTM", category: "QA Process" },
  { name: "FIX Protocol", category: "FinTech Domain" },
  { name: "Trade Lifecycle", category: "FinTech Domain" }
];

const experiences = [
  {
    role: "QA Engineer",
    company: "SoFi Invest",
    description:
      "Modern financial services platform work covering stock trading, ETFs, automated investing, real-time market data, order workflows, and integrated financial tools.",
    startDate: new Date("2024-05-01"),
    endDate: null,
    isCurrent: true,
    order: 1,
    highlights: [
      "Participates in Agile ceremonies including daily stand-ups, sprint planning, sprint review, and retrospectives.",
      "Follows SDLC and STLC processes while authoring detailed test plans, test cases, and sign-off documentation.",
      "Performs smoke, sanity, GUI, end-to-end, backend, exploratory, boundary, and regression testing.",
      "Validates market, limit, and stop order flows, including placement, modification, cancellation, execution, and settlement.",
      "Tests internalization processes and trade lifecycle behavior across changing market conditions.",
      "Converts manual test cases into TypeScript + Playwright automation using the Page Object Model pattern.",
      "Enhances and scales the automation framework for broader regression coverage and efficient execution.",
      "Uses Linux/UNIX to access FIX logs and validate protocol messages, tags, and values.",
      "Writes SQL queries to validate backend data accuracy and support end-to-end testing.",
      "Uses Postman for manual API validation and collaborates with developers, QA teammates, and stakeholders."
    ]
  },
  {
    role: "QA Analyst",
    company: "Credit Karma",
    description:
      "Personal finance platform work focused on credit reporting modules, financial recommendations, data accuracy, API reliability, and regression coverage.",
    startDate: new Date("2022-05-01"),
    endDate: new Date("2024-04-01"),
    isCurrent: false,
    order: 2,
    highlights: [
      "Executed functional and regression testing on credit reporting modules with strong attention to financial data accuracy.",
      "Identified and documented 50+ defects in JIRA with clear reproduction steps to improve bug-fix turnaround.",
      "Performed API testing to validate backend services and data synchronization across FinTech application layers.",
      "Contributed to Requirements Traceability Matrix coverage to align testing with business requirements.",
      "Used JIRA and Zephyr Scale to manage test cases, track defects, and document testing progress.",
      "Conducted GUI, smoke, sanity, end-to-end, backend, and regression testing across release cycles.",
      "Developed and maintained Playwright + TypeScript automation scenarios and executed cross-browser validation.",
      "Used Git and GitHub for version control and collaborative automation workflow."
    ]
  },
  {
    role: "QA Junior",
    company: "PayPal",
    description:
      "Global payment platform work focused on payment gateway reliability, transaction quality, Agile QA adoption, and automation support.",
    startDate: new Date("2021-02-01"),
    endDate: new Date("2022-02-01"),
    isCurrent: false,
    order: 3,
    highlights: [
      "Executed 300+ manual and automated test cases for global payment gateway modules.",
      "Helped maintain release quality by validating critical payment transaction flows and reducing major release risk.",
      "Assisted in creating TypeScript automated regression scripts to move manual workflows toward automation.",
      "Supported the team's transition from Waterfall to Agile QA practices and adapted to faster delivery workflows.",
      "Collaborated closely with developers and Product Owners to identify issues and deliver high-quality products.",
      "Applied teamwork, communication, and deadline ownership to support reliable quality deliverables."
    ]
  }
];

async function main() {
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    throw new Error("No profile found. Run the seed script first.");
  }

  await prisma.experienceHighlight.deleteMany({
    where: { experience: { profileId: profile.id } }
  });
  await prisma.experience.deleteMany({ where: { profileId: profile.id } });
  await prisma.education.deleteMany({ where: { profileId: profile.id } });
  await prisma.skill.deleteMany({ where: { profileId: profile.id } });

  await prisma.skill.createMany({
    data: skills.map((skill) => ({
      ...skill,
      profileId: profile.id
    }))
  });

  await prisma.education.create({
    data: {
      institution: "Yangon University, Yangon, Myanmar",
      degree: "Associate Degree in Software Engineering",
      startYear: 2016,
      endYear: 2018,
      profileId: profile.id
    }
  });

  for (const item of experiences) {
    const { highlights, ...experienceData } = item;
    const experience = await prisma.experience.create({
      data: {
        ...experienceData,
        profileId: profile.id
      }
    });

    await prisma.experienceHighlight.createMany({
      data: highlights.map((text, index) => ({
        text,
        order: index + 1,
        experienceId: experience.id
      }))
    });
  }

  console.log(`Synced ${skills.length} skills, 1 education, and ${experiences.length} experiences.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
