
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export interface EventProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: {
    id: string;
    name: string;
    avatarUrl: string;
    university?: string;
  };
  attendees: number;
  maxAttendees: number;
  category: string;
  tags: string[];
  isOnline: boolean;
  isAttending: boolean;
  imageUrl: string;
}

interface EventCardProps {
  event: EventProps;
  isLoggedIn?: boolean;
}

export function EventCard({ event, isLoggedIn = false }: EventCardProps) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const formattedDate = format(startDate, 'EEEE d MMMM yyyy', { locale: ar });
  const formattedStartTime = format(startDate, 'h:mm a', { locale: ar });
  const formattedEndTime = format(endDate, 'h:mm a', { locale: ar });
  
  const availableSeats = event.maxAttendees - event.attendees;
  const isFullyBooked = availableSeats <= 0;
  
  const handleAttendanceToggle = () => {
    // This would normally be connected to your API
    console.log(event.isAttending ? "Leaving event" : "Joining event", event.id);
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={event.imageUrl} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-primary-foreground">
            {event.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-grow p-5">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>من {formattedStartTime} إلى {formattedEndTime}</span>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-start">
            <Users className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>
              {isFullyBooked 
                ? "مكتمل العدد" 
                : `${availableSeats} مقعد متاح من أصل ${event.maxAttendees}`}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex gap-1 flex-wrap">
          {event.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {event.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{event.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/20 p-5 border-t">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={event.organizer.avatarUrl} alt={event.organizer.name} />
              <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{event.organizer.name}</p>
              {event.organizer.university && (
                <p className="text-xs text-muted-foreground">
                  {event.organizer.university}
                </p>
              )}
            </div>
          </div>
          
          {isLoggedIn && (
            <Button
              variant={event.isAttending ? "outline" : "default"}
              size="sm"
              className={event.isAttending ? "text-primary border-primary" : ""}
              disabled={!event.isAttending && isFullyBooked}
              onClick={handleAttendanceToggle}
            >
              {event.isAttending ? "إلغاء الحضور" : "سجل الآن"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
