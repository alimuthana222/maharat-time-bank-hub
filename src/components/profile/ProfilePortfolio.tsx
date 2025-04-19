
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

interface ProfilePortfolioProps {
  portfolioItems: PortfolioItem[];
}

export function ProfilePortfolio({ portfolioItems }: ProfilePortfolioProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">المحفظة (نماذج أعمال سابقة)</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            <CardContent className="p-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              {item.link && (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  عرض المشروع
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
