import React from "react";

export default function HeroSectionSkeleton() {
  return (
    <section className="w-full py-12 md:py-20 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
        <div className="h-16 md:h-20 flex justify-center">
          <div className="h-10 md:h-12 w-3/4 md:w-1/2 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="h-10 mt-3 mb-6 flex justify-center">
          <div className="h-6 w-1/2 md:w-1/3 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="h-12 md:h-14 w-full bg-gray-700 rounded-full animate-pulse"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className="h-8 md:h-10 w-20 md:w-24 bg-gray-700 rounded-full animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
