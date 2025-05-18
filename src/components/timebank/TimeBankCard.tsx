
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Hourglass, Clock } from "lucide-react";

interface TimeBankCardProps {
  title: string;
  value: number;
  description: string;
  className?: string;
}

export function TimeBankCard({ title, value, description, className = "" }: TimeBankCardProps) {
  return (
    <Card className={`text-white ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/20 p-2 rounded-full">
            {title.includes("معلقة") ? (
              <Clock className="h-5 w-5 text-white" />
            ) : (
              <Hourglass className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
          <CardDescription className="text-white/80">
            {description}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}

export type { TimeBankCardProps };
