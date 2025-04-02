import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming shadcn/ui
import { Button } from '@/components/ui/button';

// TODO: Replace with your actual Amazon Affiliate Tag
const AMAZON_AFFILIATE_TAG = 'your_affiliate_id-20';

// Helper function to create affiliate links
const createAffiliateLink = (baseUrl: string): string => {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
    return url.toString();
  } catch (e) {
    console.error("Invalid URL for affiliate link:", baseUrl);
    return baseUrl; // Return original URL if invalid
  }
};

// Example Product Data (Replace with actual recommendations)
const recommendedProducts = [
  {
    name: 'Solar Panel Cleaning Kit',
    description: 'Keep your panels efficient with this easy-to-use cleaning kit.',
    amazonUrl: 'https://www.amazon.com/dp/EXAMPLE_ASIN1', // Replace ASIN
    category: 'Maintenance',
  },
  {
    name: 'Smart Home Energy Monitor',
    description: 'Track your energy production and consumption in real-time.',
    amazonUrl: 'https://www.amazon.com/dp/EXAMPLE_ASIN2', // Replace ASIN
    category: 'Monitoring',
  },
  {
    name: 'LED Smart Bulbs (Energy Star)',
    description: 'Reduce your overall consumption with efficient smart lighting.',
    amazonUrl: 'https://www.amazon.com/dp/EXAMPLE_ASIN3', // Replace ASIN
    category: 'Efficiency',
  },
   {
    name: 'Portable Power Station (Solar Ready)',
    description: 'Basic backup power for essential devices, rechargeable via solar.',
    amazonUrl: 'https://www.amazon.com/dp/EXAMPLE_ASIN4', // Replace ASIN
    category: 'Backup',
  },
];

// Example Guide Data (Replace or fetch dynamically)
const guides = [
   {
    title: 'Basic Solar Panel Maintenance Checklist',
    content: 'Learn the simple steps to keep your solar investment performing optimally...',
    link: '/docs/Afiliados/Guias/panel-maintenance.md', // Link to potential future detailed guide
  },
   {
    title: 'Understanding Your Energy Bill with Solar',
    content: 'Demystify net metering and how your solar production impacts your monthly bill...',
     link: '/docs/Afiliados/Guias/understanding-bills.md',
  },
];

const AffiliateAdvisorSection: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Solar Setup Advisor & Recommended Gear</h2>
      <p className="text-center text-muted-foreground mb-10">
        Optimize your solar experience with these resources and recommended products.
        <br />
        <small>(As an Amazon Associate, we earn from qualifying purchases)</small>
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Guides Section */}
        <Card>
          <CardHeader>
            <CardTitle>Guides & Checklists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {guides.map((guide, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-semibold mb-1">{guide.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{guide.content}</p>
                {/* TODO: Implement routing or modal to show full guide */}
                <Button variant="link" size="sm" disabled>Read More (Coming Soon)</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Products Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedProducts.map((product, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                <a
                  href={createAffiliateLink(product.amazonUrl)}
                  target="_blank"
                  rel="noopener noreferrer sponsored" // 'sponsored' is recommended by Google for affiliate links
                >
                  <Button variant="outline" size="sm">View on Amazon</Button>
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

       {/* TODO: Add Calculators/Estimators Section */}
       {/*
       <div className="mt-8">
         <Card>
           <CardHeader><CardTitle>Calculators & Estimators</CardTitle></CardHeader>
           <CardContent>
             <p>Interactive tools coming soon!</p>
             {/* Placeholder for calculator components *}
           </CardContent>
         </Card>
       </div>
       */}
    </div>
  );
};

export default AffiliateAdvisorSection;