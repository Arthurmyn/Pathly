import type { Metadata } from "next";
import { AuthCard } from "@/components/auth-card";

export const metadata: Metadata = { title: "Get started" };

export default function Register() {
  return <AuthCard mode="register" />;
}
