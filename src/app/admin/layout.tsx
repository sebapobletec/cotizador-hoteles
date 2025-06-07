"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-8">
        {children}
      </main>
    </div>
  );
}
