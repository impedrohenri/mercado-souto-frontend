'use client'

import { Carousel, CarouselContent, CarouselPrevious, CarouselNext, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function BannersCarousel() {

  const bannersPath = [
    '/static/images/homeBanner/carousel0.webp',
    '/static/images/homeBanner/carousel1.webp',
    '/static/images/homeBanner/carousel2.webp',
    '/static/images/homeBanner/carousel3.webp',
    '/static/images/homeBanner/carousel4.webp',
  ]

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 8000,
        }),
      ]}
    >
      <CarouselContent>
        
        {bannersPath.map((path, key) => (
          <CarouselItem key={key} className="p-0">
            
            <div className="relative w-full h-[400px] 3xl:h-[500px] shadow-amber-50 inset-shadow-accent-foreground">
              <Image
                src={path}
                alt=""
                fill
                className="object-cover"
              />
							<div 
            className="absolute inset-x-0 bottom-0 h-5/12 bg-linear-to-t from-white to-transparent"
        />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />

    </Carousel>
  )
}