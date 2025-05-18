
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Hourglass, Clock } from "lucide-react";

interface TimeBankCardProps {
  title: string;
  value: number;
  description: string;
  className?: string;
  // Adding compatibility with Index.tsx usage
  hoursEarned?: number;
  hoursSpent?: number;
  pendingHours?: number;
}

export function TimeBankCard({ 
  title, 
  value, 
  description, 
  className = "",
  hoursEarned,
  hoursSpent,
  pendingHours
}: TimeBankCardProps) {
  // Support both usage patterns - direct props or combined props
  if (hoursEarned !== undefined || hoursSpent !== undefined || pendingHours !== undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Hourglass className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">الساعات المكتسبة</h3>
              <p className="text-3xl font-bold">{hoursEarned || 0}</p>
              <CardDescription className="text-white/80">
                إجمالي الساعات التي حصلت عليها
              </CardDescription>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Hourglass className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">الساعات المنفقة</h3>
              <p className="text-3xl font-bold">{hoursSpent || 0}</p>
              <CardDescription className="text-white/80">
                إجمالي الساعات التي أنفقتها
              </CardDescription>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-500 to-orange-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">الساعات المعلقة</h3>
              <p className="text-3xl font-bold">{pendingHours || 0}</p>
              <CardDescription className="text-white/80">
                الساعات التي في انتظار الموافقة
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Original single card implementation
  return (
    <Card className={`text-white ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/20 p-2 rounded-full">
            {title && title.includes("معلقة") ? (
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
