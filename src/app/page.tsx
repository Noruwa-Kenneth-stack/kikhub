"use client";

import Navbar from "@/components/Navbar";

export default function Home() {


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative w-full h-[500px] md:h-[700px] lg:h-[90vh] overflow-hidden">
        <video
          className="absolute top-1/2 left-1/2 w-[1400px] h-auto 
          max-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          src="/Logo/kik video.mp4"
          autoPlay
          loop
          muted
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <h2 className="text-white text-5xl font-bold">Admin Panel</h2>
        </div>
      </section>
    </div>
  );
}
