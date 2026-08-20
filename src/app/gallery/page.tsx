"use client";

import { useState, useEffect } from "react";
import { Lightbox } from "@/components/gallery/lightbox";
import { X, Search, Filter, MapPin, Camera, Users, Truck, Loader2 } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  location: string;
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/media");
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = filter === "all" 
    ? images 
    : images.filter(img => img.category === filter.toLowerCase());

  // Get unique categories from available images and standardize labels
  const availableCategories = [...new Set(images.map(img => img.category))];
  
  const categoryLabels: Record<string, string> = {
    'store': 'Store',
    'products': 'Products', 
    'team': 'Team',
    'customers': 'Customers',
    'service': 'Service'
  };
  
  const categories = [
    { id: "all", label: "All Photos" },
    ...availableCategories.map(cat => ({ 
      id: cat, 
      label: categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

  // Add structured data for image gallery
  useEffect(() => {
    if (images.length === 0) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "name": "iPhone Hub Zimbabwe Photo Gallery",
      "description": "Photo gallery of iPhone Hub Zimbabwe store, products, and customer experiences in Masvingo, Zimbabwe",
      "url": "https://iphonehubzimbabwe.co.zw/gallery",
      "provider": {
        "@type": "LocalBusiness",
        "name": "iPhone Hub Zimbabwe",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Masvingo",
          "addressRegion": "Masvingo",
          "addressCountry": "ZW"
        }
      },
      "image": images.map(img => ({
        "@type": "ImageObject",
        "url": img.src.startsWith('http') ? img.src : `https://iphonehubzimbabwe.co.zw${img.src}`,
        "caption": img.alt,
        "description": img.description,
        "locationCreated": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": img.location.split(',')[0],
            "addressCountry": "ZW"
          }
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [images]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#CDB586] mx-auto mb-4" />
          <p className="text-[#5F3C18]">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      {/* Hero Section */}
      <section className="section-spacing bg-[#0E161B] wood-texture">
        <div className="site-container text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EBE2C5] font-manrope mb-6">
            Photo Gallery
          </h1>
          <p className="text-lg sm:text-xl text-[#EBE2C5]/80 leading-relaxed">
            Explore our store, products, and customer experiences. See why iPhone Hub Zimbabwe is your trusted iPhone destination in Masvingo.
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="section-spacing">
        <div className="site-container">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  filter === category.id
                    ? "bg-[#CDB586] text-[#0E161B]"
                    : "bg-white text-[#5F3C18] border border-[#CDB586]/30 hover:bg-[#CDB586]/10"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8 min-w-0">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-[4/3] sm:aspect-square bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-[#CDB586]/20"
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23F7F5EF' width='400' height='400'/%3E%3Ctext fill='%23CDB586' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage Coming Soon%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-medium">{image.title}</p>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {image.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[#5F3C18] text-lg">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* SEO Info Section */}
      <section className="bg-[#0E161B] py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center min-w-0">
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-[#CDB586]/20 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-[#CDB586]" />
              </div>
              <h3 className="text-[#CDB586] font-semibold mb-3 text-lg text-center">Store Photos</h3>
              <p className="text-[#EBE2C5]/80 text-sm leading-relaxed text-center">
                View our store location, interior, and team in Masvingo, Zimbabwe
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-[#CDB586]/20 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-7 h-7 text-[#CDB586]" />
              </div>
              <h3 className="text-[#CDB586] font-semibold mb-3 text-lg text-center">Product Gallery</h3>
              <p className="text-[#EBE2C5]/80 text-sm leading-relaxed text-center">
                Explore our iPhone collection and accessories
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-[#CDB586]/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-[#CDB586]" />
              </div>
              <h3 className="text-[#CDB586] font-semibold mb-3 text-lg text-center">Customer Stories</h3>
              <p className="text-[#EBE2C5]/80 text-sm leading-relaxed text-center">
                See happy customers and their experiences with iPhone Hub Zimbabwe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Integration Info */}
      <section className="section-spacing bg-[#F7F5EF]">
        <div className="site-container">
          <div className="text-center flex flex-col items-center justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0E161B] mb-6">
              Find Us on Google Maps
            </h2>
            <p className="text-[#5F3C18] mb-8 leading-relaxed">
              iPhone Hub Zimbabwe is located in Masvingo and serves customers across Zimbabwe. 
              Our photo gallery is indexed on Google Maps and local search directories.
            </p>
            <a
              href="https://www.google.com/maps/search/iPhone+Hub+Zimbabwe+Masvingo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#CDB586] text-[#0E161B] px-8 py-3 rounded-lg font-semibold hover:bg-[#EBE2C5] transition-colors h-12"
            >
              <MapPin className="w-5 h-5" />
              Search on Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
