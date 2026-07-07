export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kreasi Advertising",
    "url": "https://kreasi-cms.com",
    "logo": "https://kreasi-cms.com/logo.png",
    "sameAs": [
      "https://facebook.com/kreasi",
      "https://instagram.com/kreasi"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Sumatera Barat",
      "addressCountry": "ID"
    }
  };
}

export function generateBillboardSchema(billboard: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": billboard.name,
    "description": billboard.description,
    "image": billboard.thumbnail,
    "offers": {
      "@type": "Offer",
      "availability": billboard.status === 'AVAILABLE' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "priceCurrency": "IDR",
      "areaServed": {
        "@type": "City",
        "name": billboard.city
      }
    }
  };
}
