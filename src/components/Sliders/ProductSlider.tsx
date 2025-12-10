'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ProductCard from "../productCard/ProductCard";
import { TProductResponse } from "@/types/Product";


interface IProps{
    products: TProductResponse[];
    title?: string
}

export default function ProductSlider({products, title}: IProps) {


  return (
    <div className="p-6 bg-white shadow-xl border border-gray-100 rounded-lg max-w-7xl mx-auto my-8 h-fit">
      
      
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h3>
      
      
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 4
        }}
      >
        <CarouselContent className="max-h-fit">
          {products.map((product, index) => (
            
            <CarouselItem 
              key={product.id} 
              className="pl-4 basis-1/5 max-lg:basis-1/4 max-md:basis-1/2"
            >
              <div>
                <ProductCard 
                  product={product} 
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
        
      </Carousel>
    </div>
  );
}