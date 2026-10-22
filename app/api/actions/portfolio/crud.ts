"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// ===== PROJECTS CRUD =====
export async function getProjects() {
  const profile = await prisma.profile.findFirst({ select: { id: true } });
  if (!profile) throw new Error("Profile not found");
  
  return await prisma.project.findMany({
    where: { profileId: profile.id },
    orderBy: { order: "asc" }
  });
}

export async function createProject(formData: FormData) {
  const profile = await prisma.profile.findFirst({ select: { id: true } });
  if (!profile) throw new Error("Profile not found");

  const technologies = String(formData.get("technologies") || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  await prisma.project.create({
    data: {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || "") || null,
      technologies: JSON.stringify(technologies),
      url: String(formData.get("url") || "") || null,
      githubUrl: String(formData.get("githubUrl") || "") || null,
      imageUrl: String(formData.get("imageUrl") || "") || null,
      featured: formData.get("featured") === "on",
      order: Number(formData.get("order") || 99),
      profileId: profile.id
    }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateProject(formData: FormData) {
  const id = Number(formData.get("id"));

  const technologies = String(formData.get("technologies") || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  await prisma.project.update({
    where: { id },
    data: {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || "") || null,
      technologies: JSON.stringify(technologies),
      url: String(formData.get("url") || "") || null,
      githubUrl: String(formData.get("githubUrl") || "") || null,
      imageUrl: String(formData.get("imageUrl") || "") || null,
      featured: formData.get("featured") === "on",
      order: Number(formData.get("order") || 99)
    }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProject(formData: FormData) {
  await prisma.project.delete({
    where: { id: Number(formData.get("id")) }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

// ===== TESTIMONIALS CRUD =====
export async function getTestimonials() {
  const profile = await prisma.profile.findFirst({ select: { id: true } });
  if (!profile) throw new Error("Profile not found");
  
  return await prisma.testimonial.findMany({
    where: { profileId: profile.id },
    orderBy: { order: "asc" }
  });
}

export async function createTestimonial(formData: FormData) {
  const profile = await prisma.profile.findFirst({ select: { id: true } });
  if (!profile) throw new Error("Profile not found");

  await prisma.testimonial.create({
    data: {
      name: String(formData.get("name") || ""),
      role: String(formData.get("role") || "") || null,
      company: String(formData.get("company") || "") || null,
      content: String(formData.get("content") || ""),
      rating: Number(formData.get("rating") || 5),
      imageUrl: String(formData.get("imageUrl") || "") || null,
      order: Number(formData.get("order") || 99),
      profileId: profile.id
    }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateTestimonial(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.testimonial.update({
    where: { id },
    data: {
      name: String(formData.get("name") || ""),
      role: String(formData.get("role") || "") || null,
      company: String(formData.get("company") || "") || null,
      content: String(formData.get("content") || ""),
      rating: Number(formData.get("rating") || 5),
      imageUrl: String(formData.get("imageUrl") || "") || null,
      order: Number(formData.get("order") || 99)
    }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteTestimonial(formData: FormData) {
  await prisma.testimonial.delete({
    where: { id: Number(formData.get("id")) }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

// ===== CERTIFICATIONS CRUD =====
export async function getCertifications() {
  const profile = await prisma.profile.findFirst({ select: { id: true } });
  if (!profile) throw new Error("Profile not found");
  
  return await prisma.certification.findMany({
    where: { profileId: profile.id }
  });
}

export async function createCertification(formData: FormData) {
  const profile = await prisma.profile.findFirst({ select: { id: true } });
  if (!profile) throw new Error("Profile not found");

  const date = String(formData.get("date") || "");
  const expiryDate = String(formData.get("expiryDate") || "");

  await prisma.certification.create({
    data: {
      name: String(formData.get("name") || ""),
      issuer: String(formData.get("issuer") || "") || null,
      date: date ? new Date(date) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      credentialId: String(formData.get("credentialId") || "") || null,
      credentialUrl: String(formData.get("credentialUrl") || "") || null,
      profileId: profile.id
    }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateCertification(formData: FormData) {
  const id = Number(formData.get("id"));
  const date = String(formData.get("date") || "");
  const expiryDate = String(formData.get("expiryDate") || "");

  await prisma.certification.update({
    where: { id },
    data: {
      name: String(formData.get("name") || ""),
      issuer: String(formData.get("issuer") || "") || null,
      date: date ? new Date(date) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      credentialId: String(formData.get("credentialId") || "") || null,
      credentialUrl: String(formData.get("credentialUrl") || "") || null
    }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteCertification(formData: FormData) {
  await prisma.certification.delete({
    where: { id: Number(formData.get("id")) }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}
