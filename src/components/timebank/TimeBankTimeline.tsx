
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, HourglassIcon, Clock3 } from "lucide-react";
import { formatDate, getRelativeDateLabel } from "@/lib/date-utils";

interface TimelineEvent {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  action: "provided" | "received" | "created" | "approved" | "rejected" | "canceled";
  hours: number;
  description: string;
  timestamp: string;
  status: "pending" | "completed" | "rejected" | "canceled";
}

const statusIcons = {
  pending: <HourglassIcon className="h-4 w-4 text-amber-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  rejected: <AlertCircle className="h-4 w-4 text-red-500" />,
  canceled: <Clock3 className="h-4 w-4 text-gray-500" />,
};

const statusColors = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-200",
  completed: "bg-green-500/10 text-green-600 border-green-200",
  rejected: "bg-red-500/10 text-red-600 border-red-200",
  canceled: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const actionText = {
  provided: "قدم",
  received: "استلم",
  created: "أنشأ",
  approved: "وافق على",
  rejected: "رفض",
  canceled: "ألغى",
};

interface TimeBankTimelineProps {
  events?: TimelineEvent[];
}

// Sample data for demonstration
const sampleEvents: TimelineEvent[] = [
  {
    id: "1",
    user: {
      name: "أحمد محمد",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    action: "provided",
    hours: 3,
    description: "تدريس مادة الرياضيات",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    id: "2",
    user: {
      name: "سارة عبدالله",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
    action: "created",
    hours: 2,
    description: "مساعدة في تصميم شعار",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "3",
    user: {
      name: "خالد العمري",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    action: "received",
    hours: 1.5,
    description: "مساعدة في برمجة موقع",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
  {
    id: "4",
    user: {
      name: "ليلى أحمد",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
    },
    action: "rejected",
    hours: 4,
    description: "ترجمة مستندات قانونية",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "rejected",
  },
  {
    id: "5",
    user: {
      name: "محمد العلي",
      avatarUrl: "https://i.pravatar.cc/150?img=14",
    },
    action: "approved",
    hours: 2,
    description: "تصميم عرض تقديمي",
    timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
  },
];

export function TimeBankTimeline({ events = sampleEvents }: TimeBankTimelineProps) {
  // Group events by date
  const groupedEvents = events.reduce<Record<string, TimelineEvent[]>>(
    (groups, event) => {
      const dateKey = getRelativeDateLabel(event.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
      return groups;
    },
    {}
  );

  // Sort dates by recency
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    if (a === "اليوم") return -1;
    if (b === "اليوم") return 1;
    if (a === "الأمس") return -1;
    if (b === "الأمس") return 1;
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>سجل المعاملات</CardTitle>
        <CardDescription>تاريخ معاملات بنك الوقت الخاص بك</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sortedDates.map((dateKey) => (
            <div key={dateKey} className="space-y-4">
              <h3 className="text-md font-medium text-muted-foreground border-b pb-1">{dateKey}</h3>
              
              <div className="space-y-4">
                {groupedEvents[dateKey].map((event) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Clock className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center">
                        <p className="font-medium text-sm">
                          <span className="font-bold">{event.user.name}</span>{" "}
                          {actionText[event.action]}{" "}
                          <span className="font-bold text-primary">{event.hours} ساعة</span>
                        </p>
                        
                        <Badge
                          variant="outline"
                          className={`mr-2 ${statusColors[event.status]}`}
                        >
                          <div className="flex items-center gap-1">
                            {statusIcons[event.status]}
                            <span>{event.status === "completed" ? "مكتمل" : event.status === "pending" ? "قيد الانتظار" : event.status === "rejected" ? "مرفوض" : "ملغي"}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      
                      <p className="text-xs text-muted-foreground">
                        {formatDate(event.timestamp, 'time')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
