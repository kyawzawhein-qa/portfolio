const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      console.log("No profile found. Run npm run prisma:seed on the server if this is a fresh install.");
      return;
    }

    const updates = {};
    if (!profile.linkedinUrl) updates.linkedinUrl = "https://linkedin.com/in/kyawzawhein";
    if (!profile.githubUrl) updates.githubUrl = "https://github.com/kyawzawhein";
    if (!profile.resumeUrl) updates.resumeUrl = "/KYAWZAWHEIN_QA_ENGINEER.docx";
    if (!profile.heroTags || profile.heroTags === "[]") {
      updates.heroTags = JSON.stringify(["FinTech QA", "Trading Systems", "Playwright Automation"]);
    }
    if (Object.keys(updates).length) {
      await prisma.profile.update({ where: { id: profile.id }, data: updates });
      console.log("Updated profile defaults.");
    }

    if ((await prisma.metric.count({ where: { profileId: profile.id } })) === 0) {
      await prisma.metric.createMany({
        data: [
          { label: "Years in QA", value: "5+", order: 1, profileId: profile.id },
          { label: "FinTech domains", value: "Trading, Payments", order: 2, profileId: profile.id },
          { label: "Defects tracked", value: "50+", order: 3, profileId: profile.id },
          { label: "Test cases executed", value: "300+", order: 4, profileId: profile.id }
        ]
      });
      console.log("Seeded metrics.");
    }

    if ((await prisma.marketSignal.count({ where: { profileId: profile.id } })) === 0) {
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
      console.log("Seeded market signals.");
    }

    if ((await prisma.deliveryItem.count({ where: { profileId: profile.id } })) === 0) {
      await prisma.deliveryItem.createMany({
        data: [
          { label: "Manual QA", value: "Smoke, sanity, GUI, E2E, exploratory, boundary, regression", order: 1, profileId: profile.id },
          { label: "Automation", value: "Playwright, TypeScript, POM, cross-browser execution", order: 2, profileId: profile.id },
          { label: "Backend", value: "SQL, API validation, FIX protocol log analysis", order: 3, profileId: profile.id },
          { label: "Workflow", value: "Agile ceremonies, JIRA, Zephyr, GitHub, CI/CD", order: 4, profileId: profile.id }
        ]
      });
      console.log("Seeded delivery items.");
    }

    if ((await prisma.project.count({ where: { profileId: profile.id } })) === 0) {
      await prisma.project.createMany({
        data: [
          {
            title: "Portfolio Smoke Suite",
            description: "Playwright smoke tests for this portfolio homepage and admin auth gates.",
            technologies: JSON.stringify(["Playwright", "TypeScript", "GitHub Actions"]),
            githubUrl: "https://github.com/kyawzawhein-qa/portfolio",
            category: "Playwright Demo",
            problem: "Need fast confidence after each deploy.",
            approach: "Smoke checks for critical public sections and admin redirect.",
            outcome: "Runnable suite that also showcases Playwright skills.",
            featured: true,
            order: 1,
            profileId: profile.id
          }
        ]
      });
      console.log("Seeded starter Playwright project.");
    }

    console.log("ensure-content complete.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
