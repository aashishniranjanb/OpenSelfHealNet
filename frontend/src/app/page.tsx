"use client";

import { Hero } from "@/components/sections/hero";
import { ChapterOne } from "@/components/sections/chapter-one";
import { ChapterTwo } from "@/components/sections/chapter-two";
import { ChapterThree } from "@/components/sections/chapter-three";
import { ChapterFour } from "@/components/sections/chapter-four";
import { ChapterFive } from "@/components/sections/chapter-five";
import { ChapterSix } from "@/components/sections/chapter-six";
import { ChapterSeven } from "@/components/sections/chapter-seven";
import { ChapterEight } from "@/components/sections/chapter-eight";
import { ChapterNine } from "@/components/sections/chapter-nine";
import { Dashboard } from "@/components/sections/dashboard";
import { Footer } from "@/components/sections/footer";
import { Navigation } from "@/components/ui/navigation";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <ChapterOne />
      <ChapterTwo />
      <ChapterThree />
      <ChapterFour />
      <ChapterFive />
      <ChapterSix />
      <ChapterSeven />
      <ChapterEight />
      <ChapterNine />
      <Dashboard />
      <Footer />
    </main>
  );
}
