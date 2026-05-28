"use server";

import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

async function getProfileId() {
  const profile = await prisma.profile.findFirst({
    select: { id: true }
  });
  if (!profile) throw new Error("Profile not found. Run seed first.");
  return profile.id;
}

async function saveProfileImage(file: File | null) {
  if (!file || file.size === 0) return null;

  const extension = path.extname(file.name).toLowerCase() || ".jpg";
  const safeName = `profile-${Date.now()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploadPath = path.join(uploadDir, safeName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${safeName}`;
}

export async function updateProfile(formData: FormData) {
  const id = await getProfileId();
  const uploadedImage = await saveProfileImage(formData.get("profileImageFile") as File | null);
  const imageUrl = String(formData.get("profileImage") || "") || null;

  await prisma.profile.update({
    where: { id },
    data: {
      name: String(formData.get("name") || ""),
      title: String(formData.get("title") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || "") || null,
      location: String(formData.get("location") || "") || null,
      profileImage: uploadedImage || imageUrl,
      intro: String(formData.get("intro") || ""),
      summary: String(formData.get("summary") || "")
    }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createExperience(formData: FormData) {
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
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateExperience(formData: FormData) {
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

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteExperience(formData: FormData) {
  await prisma.experience.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createEducation(formData: FormData) {
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
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateEducation(formData: FormData) {
  await prisma.education.update({
    where: { id: Number(formData.get("id")) },
    data: {
      institution: String(formData.get("institution") || ""),
      degree: String(formData.get("degree") || ""),
      startYear: Number(formData.get("startYear") || 0) || null,
      endYear: Number(formData.get("endYear") || 0) || null
    }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteEducation(formData: FormData) {
  await prisma.education.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createSkill(formData: FormData) {
  const profileId = await getProfileId();
  await prisma.skill.create({
    data: {
      name: String(formData.get("name") || ""),
      category: String(formData.get("category") || "") || null,
      level: String(formData.get("level") || "") || null,
      profileId
    }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateSkill(formData: FormData) {
  await prisma.skill.update({
    where: { id: Number(formData.get("id")) },
    data: {
      name: String(formData.get("name") || ""),
      category: String(formData.get("category") || "") || null,
      level: String(formData.get("level") || "") || null
    }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteSkill(formData: FormData) {
  await prisma.skill.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin");
}
