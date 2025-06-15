
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookingForm } from "@/components/bookings/BookingForm";

interface ServiceBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string;
  serviceId?: string;
  serviceName: string;
  hourlyRate: number;
  onBookingCreated?: () => void;
}

export function ServiceBookingDialog({
  open,
  onOpenChange,
  providerId,
  serviceId,
  serviceName,
  hourlyRate,
  onBookingCreated
}: ServiceBookingDialogProps) {
  const handleBookingCreated = () => {
    onBookingCreated?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>حجز خدمة: {serviceName}</DialogTitle>
        </DialogHeader>
        
        <BookingForm
          providerId={providerId}
          serviceId={serviceId}
          hourlyRate={hourlyRate}
          onBookingCreated={handleBookingCreated}
        />
      </DialogContent>
    </Dialog>
  );
}
