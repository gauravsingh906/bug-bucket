
"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { TypewriterEffect, TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Register from "./(auth)/register/page";
import Link from "next/link";

export default function Home() {
  const words = [

    {
      text: "Unlock",
    },
    {
      text: "Insights,",
    },
    {
      text: "Resolve",
    },
    {
      text: "Issues,",
    },
    {
      text: "Empower",
    },

    {
      text: "Developers!",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (<>
    <div className="flex flex-col items-center justify-center lg:h-[35rem] h-[40rem] ">
      <p className="text- text-slate-800 dark:text-slate-200text-[.75rem] sm:text-[1rem] lg:text-xl font-bold  text-center mb-6 text-wrap">
        Where Coders Unite to Turn Frustration into Fixes and Deliver Solutions Together!
      </p>
      <TypewriterEffect words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        <Link href={"/login"}><button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Join now
        </button></Link>
        <Link href={"/register"}>
          <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
            Signup
          </button></Link>
      </div>
    </div>
    <ShootingStars minDelay={1500} />
    <StarsBackground />
  </>
  );
}
