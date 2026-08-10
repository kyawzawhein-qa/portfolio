"use server";

import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { stringifyHeroTags, stringifyTechList } from "@/lib/parse";

async function getProfileId() {
  const profile = await prisma.profile.findFirst({
    select: { id: true }
  });
  if (!profile) throw new Error("Profile not found. Run seed first.");
  return profile.id;
}

function revalidatePortfolio() {
  revalidatePath("/");
  revalidatePath("/admin");
}

async function saveUpload(file: File | null, prefix: string) {
  if (!file || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error("File too large (max 5MB)");

  const extension = path.extname(file.name).toLowerCase() || ".jpg";
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".docx"];
  if (!allowed.includes(extension)) throw new Error("Unsupported file type");

  const safeName = `${prefix}-${Date.now()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploadPath = path.join(uploadDir, safeName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${safeName}`;
}

export async function updateProfile(formData: FormData) {
  await requireAdmin();
  const id = await getProfileId();
  const uploadedImage = await saveUpload(formData.get("profileImageFile") as File | null, "profile");
  const uploadedResume = await saveUpload(formData.get("resumeFile") as File | null, "resume");
  const imageUrl = String(formData.get("profileImage") || "") || null;
  const resumeUrl = String(formData.get("resumeUrl") || "") || null;

  await prisma.profile.update({
    where: { id },
    data: {
      name: String(formData.get("name") || ""),
      title: String(formData.get("title") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || "") || null,
      location: String(formData.get("location") || "") || null,
      profileImage: uploadedImage || imageUrl,
      linkedinUrl: String(formData.get("linkedinUrl") || "") || null,
      githubUrl: String(formData.get("githubUrl") || "") || null,
      resumeUrl: uploadedResume || resumeUrl,
      heroTags: stringifyHeroTags(formData.get("heroTags")),
      intro: String(formData.get("intro") || ""),
      summary: String(formData.get("summary") || "")
    }
  });
  revalidatePortfolio();
}

export async function createExperience(formData: FormData) {
  await requireAdmin();
  const profileId = await getProfileId();
  const endDateRaw = String(formData.get("endDate") || "");
  const highlightLines = String(formData.get("highlights") || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const experience = await prisma.experience.create({
    data: {
      role: String(formData.get("role") || ""),
      company: String(formData.get("company") || ""),
      description: String(formData.get("description") || "") || null,
      startDate: new Date(String(formData.get("startDate"))),
      endDate: endDateRaw ? new Date(endDateRaw) : null,
      isCurrent: formData.get("isCurrent") === "on",
      order: Number(formData.get("order") || 99),
      profileId
    }
  });

  if (highlightLines.length > 0) {
    await prisma.experienceHighlight.createMany({
      data: highlightLines.map((text, index) => ({
        text,
        order: index + 1,
        experienceId: experience.id
      }))
    });
  }
  revalidatePortfolio();
}

export async function updateExperience(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const endDateRaw = String(formData.get("endDate") || "");
  const highlightLines = String(formData.get("highlights") || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  await prisma.experience.update({
    where: { id },
    data: {
      role: String(formData.get("role") || ""),
      company: String(formData.get("company") || ""),
      description: String(formData.get("description") || "") || null,
      startDate: new Date(String(formData.get("startDate"))),
      endDate: endDateRaw ? new Date(endDateRaw) : null,
      isCurrent: formData.get("isCurrent") === "on",
      order: Number(formData.get("order") || 99)
    }
  });

  await prisma.experienceHighlight.deleteMany({ where: { experienceId: id } });

  if (highlightLines.length > 0) {
    await prisma.experienceHighlight.createMany({
      data: highlightLines.map((text, index) => ({
        text,
        order: index + 1,
        experienceId: id
      }))
    });
  }

  revalidatePortfolio();
}

export async function deleteExperience(formData: FormData) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePortfolio();
}

export async function createEducation(formData: FormData) {
  await requireAdmin();
  const profileId = await getProfileId();
  await prisma.education.create({
    data: {
      institution: String(formData.get("institution") || ""),
      degree: String(formData.get("degree") || ""),
      startYear: Number(formData.get("startYear") || 0) || null,
      endYear: Number(formData.get("endYear") || 0) || null,
      profileId
    }
  });
  revalidatePortfolio();
}

export async function updateEducation(formData: FormData) {
  await requireAdmin();
  await prisma.education.update({
    where: { id: Number(formData.get("id")) },
    data: {
      institution: String(formData.get("institution") || ""),
      degree: String(formData.get("degree") || ""),
      startYear: Number(formData.get("startYear") || 0) || null,
      endYear: Number(formData.get("endYear") || 0) || null
    }
  });
  revalidatePortfolio();
}

export async function deleteEducation(formData: FormData) {
  await requireAdmin();
  await prisma.education.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePortfolio();
}

export async function createSkill(formData: FormData) {
  await requireAdmin();
  const profileId = await getProfileId();
  await prisma.skill.create({
    data: {
      name: String(formData.get("name") || ""),
      category: String(formData.get("category") || "") || null,
      level: String(formData.get("level") || "") || null,
      profileId
    }
  });
  revalidatePortfolio();
}

export async function updateSkill(formData: FormData) {
  await requireAdmin();
  await prisma.skill.update({
    where: { id: Number(formData.get("id")) },
    data: {
      name: String(formData.get("name") || ""),
      category: String(formData.get("category") || "") || null,
      level: String(formData.get("level") || "") || null
    }
  });
  revalidatePortfolio();
}

export async function deleteSkill(formData: FormData) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePortfolio();
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const profileId = await getProfileId();
  await prisma.project.create({
    data: {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || "") || null,
      technologies: stringifyTechList(formData.get("technologies")),
      url: String(formData.get("url") || "") || null,
      githubUrl: String(formData.get("githubUrl") || "") || null,
      imageUrl: String(formData.get("imageUrl") || "") || null,
      category: String(formData.get("category") || "") || null,
      problem: String(formData.get("problem") || "") || null,
      approach: String(formData.get("approach") || "") || null,
      outcome: String(formData.get("outcome") || "") || null,
      featured: formData.get("featured") === "on",
      order: Number(formData.get("order") || 99),
      profileId
    }
  });
  revalidatePortfolio();
}

export async function updateProject(formData: FormData) {
  await requireAdmin();
  await prisma.project.update({
    where: { id: Number(formData.get("id")) },
    data: {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || "") || null,
      technologies: stringifyTechList(formData.get("technologies")),
      url: String(formData.get("url") || "") || null,
      githubUrl: String(formData.get("githubUrl") || "") || null,
      imageUrl: String(formData.get("imageUrl") || "") || null,
      category: String(formData.get("category") || "") || null,
      problem: String(formData.get("problem") || "") || null,
      approach: String(formData.get("approach") || "") || null,
      outcome: String(formData.get("outcome") || "") || null,
      featured: formData.get("featured") === "on",
      order: Number(formData.get("order") || 99)
    }
  });
  revalidatePortfolio();
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  await prisma.project.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePortfolio();
}

export async function createTestimonial(formData: FormData) {
  await requireAdmin();
  const profileId = await getProfileId();
  await prisma.testimonial.create({
    data: {
      name: String(formData.get("name") || ""),
      role: String(formData.get("role") || "") || null,
      company: String(formData.get("company") || "") || null,
      content: String(formData.get("content") || ""),
      rating: Number(formData.get("rating") || 5) || 5,
      imageUrl: String(formData.get("imageUrl") || "") || null,
      order: Number(formData.get("order") || 99),
      profileId
    }
  });
  revalidatePortfolio();
}

export async function updateTestimonial(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.update({
    where: { id: Number(formData.get("id")) },
    data: {
      name: String(formData.get("name") || ""),
      role: String(formData.get("role") || "") || null,
      company: String(formData.get("company") || "") || null,
      content: String(formData.get("content") || ""),
      rating: Number(formData.get("rating") || 5) || 5,
      imageUrl: String(formData.get("imageUrl") || "") || null,
      order: Number(formData.get("order") || 99)
    }
  });
  revalidatePortfolio();
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePortfolio();
}

export async function createCertification(formData: FormData) {
  await requireAdmin();
  const profileId = await getProfileId();
  const dateRaw = String(formData.get("date") || "");
  const expiryRaw = String(formData.get("expiryDate") || "");
  await prisma.certification.create({
    data: {
      name: String(formData.get("name") || ""),
      issuer: String(formData.get("issuer") || "") || null,
      date: dateRaw ? new Date(dateRaw) : null,
      expiryDate: expiryRaw ? new Date(expiryRaw) : null,
      credentialId: String(formData.get("credentialId") || "") || null,
      credentialUrl: String(formData.get("credentialUrl") || "") || null,
      profileId
    }
  });
  revalidatePortfolio();
}

export async function updateCertification(formData: FormData) {
  await requireAdmin();
  const dateRaw = String(formData.get("date") || "");
  const expiryRaw = String(formData.get("expiryDate") || "");
  await prisma.certification.update({
    where: { id: Number(formData.get("id")) },
    data: {
      name: String(formData.get("name") || ""),
      issuer: String(formData.get("issuer") || "") || null,
      date: dateRaw ? new Date(dateRaw) : null,
      expiryDate: expiryRaw ? new Date(expiryRaw) : null,
      credentialId: String(formData.get("credentialId") || "") || null,
      credentialUrl: String(formData.get("credentialUrl") || "") || null
    }
  });
  revalidatePortfolio();
}

export async function deleteCertification(formData: FormData) {
  await requireAdmin();
  await prisma.certification.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePortfolio();
}

export async function createMetric(formData: FormData) {
  await requireAdmin();
  const profileId = await getProfileId();
  await prisma.metric.create({
    data: {
      label: String(formData.get("label") || ""),
      value: String(formData.get("value") || ""),
      order: Number(formData.get("order") || 99),
      profileId
    }
  });
  revalidatePortfolio();
}

export async function updateMetric(formData: FormData) {
  await requireAdmin();
  await prisma.metric.update({
    where: { id: Number(formData.get("id")) },
    data: {
      label: String(formData.get("label") || ""),
      value: String(formData.get("value") || ""),
      order: Number(formData.get("order") || 99)
    }
  });
  revalidatePortfolio();
}

export async function deleteMetric(formData: FormData) {
  await requireAdmin();
  await prisma.metric.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePortfolio();
}

export async function createMarketSignal(formData: FormData) {
  await requireAdmin();
  const profileId = await getProfileId();
  await prisma.marketSignal.create({
    data: {
      title: String(formData.get("title") || ""),
      detail: String(formData.get("detail") || ""),
      tone: String(formData.get("tone") || "cyan"),
      order: Number(formData.get("order") || 99),
      profileId
    }
  });
  revalidatePortfolio();
}

export async function updateMarketSignal(formData: FormData) {
  await requireAdmin();
  await prisma.marketSignal.update({
    where: { id: Number(formData.get("id")) },
    data: {
      title: String(formData.get("title") || ""),
      detail: String(formData.get("detail") || ""),
      tone: String(formData.get("tone") || "cyan"),
      order: Number(formData.get("order") || 99)
    }
  });
  revalidatePortfolio();
}

export async function deleteMarketSignal(formData: FormData) {
  await requireAdmin();
  await prisma.marketSignal.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePortfolio();
}

export async function createDeliveryItem(formData: FormData) {
  await requireAdmin();
  const profileId = await getProfileId();
  await prisma.deliveryItem.create({
    data: {
      label: String(formData.get("label") || ""),
      value: String(formData.get("value") || ""),
      order: Number(formData.get("order") || 99),
      profileId
    }
  });
  revalidatePortfolio();
}

export async function updateDeliveryItem(formData: FormData) {
  await requireAdmin();
  await prisma.deliveryItem.update({
    where: { id: Number(formData.get("id")) },
    data: {
      label: String(formData.get("label") || ""),
      value: String(formData.get("value") || ""),
      order: Number(formData.get("order") || 99)
    }
  });
  revalidatePortfolio();
}

export async function deleteDeliveryItem(formData: FormData) {
  await requireAdmin();
  await prisma.deliveryItem.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePortfolio();
}

export async function submitContactMessage(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { ok: false as const, error: "All fields are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "Enter a valid email address." };
  }
  if (message.length > 5000) {
    return { ok: false as const, error: "Message is too long." };
  }

  await prisma.contactMessage.create({
    data: { name, email, message }
  });

  revalidatePath("/admin");
  return { ok: true as const };
}

export async function markContactRead(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.update({
    where: { id: Number(formData.get("id")) },
    data: { read: true }
  });
  revalidatePath("/admin");
}

export async function deleteContactMessage(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/admin");
}
