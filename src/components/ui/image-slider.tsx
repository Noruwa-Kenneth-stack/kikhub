import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SliderProps {
  images: { src: string; alt: string; title?: string; description?: string }[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function ImageSlider({
  images,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, nextSlide]);

  return (
    <div
      className={cn(
        "relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl",
        "shadow-[var(--shadow-elegant)] bg-card",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Slider Container */}
      <div className="relative aspect-[3/1] overflow-hidden bg-red-400 ">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index < currentIndex
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            )}
          >
            {/* Background Image */}
            <Image
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
              fill
            />

            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

            {/* Text Content Overlay */}
            <div className="relative z-10 flex flex-col justify-center h-full px-6 py-8 md:px-12 lg:px-16 text-white max-w-2xl">
              {image.title && (
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-tight mb-3 md:mb-4 animate-fade-in">
                  {image.title}
                </h2>
              )}
              {image.description && (
                <p className="text-base md:text-lg lg:text-xl mb-4 md:mb-6 opacity-90 animate-fade-in delay-150">
                  {image.description}
                </p>
              )}
              <div className="animate-fade-in delay-300">
                <button className="bg-blue-400 text-primary px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2 text-sm md:text-base">
                  Browse on your fav store
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6",
          "bg-white/90 hover:bg-white backdrop-blur-sm",
          "shadow-lg transition-all duration-300",
          "opacity-0 group-hover:opacity-100",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        onClick={prevSlide}
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6",
          "bg-white/90 hover:bg-white backdrop-blur-sm",
          "shadow-lg transition-all duration-300",
          "opacity-0 group-hover:opacity-100",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        onClick={nextSlide}
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 md:space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300",
              "hover:scale-110",
              index === currentIndex
                ? "bg-primary shadow-[var(--shadow-glow)] scale-110"
                : "bg-white/60 hover:bg-white/80"
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {autoPlay && !isHovered && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/50">
          <div
            className="h-full bg-orange-300 animate-slideProgress"
            style={{ ["--progress-duration" as string]: `${autoPlayInterval}ms` } as React.CSSProperties}
          />
        </div>
      )}
    </div>
  );
}



