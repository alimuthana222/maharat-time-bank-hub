
/**
 * Formats a date string into a localized format
 * @param dateString - ISO date string to format
 * @param format - Optional format type: 'full', 'short', or 'time'
 * @returns Formatted date string
 */
export function formatDate(dateString: string, format: 'full' | 'short' | 'time' = 'full'): string {
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'تاريخ غير صالح';
    }
    
    switch (format) {
      case 'full':
        // Full date and time format
        return date.toLocaleDateString('ar-SA', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      
      case 'short':
        // Short date format (no time)
        return date.toLocaleDateString('ar-SA', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      
      case 'time':
        // Time only
        return date.toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
      default:
        return date.toLocaleDateString('ar-SA');
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'تاريخ غير صالح';
  }
}

/**
 * Calculates time elapsed since a given date
 * @param dateString - ISO date string
 * @returns String representation of time elapsed
 */
export function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'تاريخ غير صالح';
    }
    
    // Less than a minute
    if (seconds < 60) {
      return 'الآن';
    }
    
    // Less than an hour
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `منذ ${minutes} دقيقة`;
    }
    
    // Less than a day
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `منذ ${hours} ساعة`;
    }
    
    // Less than a week
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `منذ ${days} يوم`;
    }
    
    // Less than a month
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `منذ ${weeks} أسبوع`;
    }
    
    // Less than a year
    if (days < 365) {
      const months = Math.floor(days / 30);
      return `منذ ${months} شهر`;
    }
    
    // More than a year
    const years = Math.floor(days / 365);
    return `منذ ${years} سنة`;
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'تاريخ غير صالح';
  }
}

/**
 * Formats a date for input fields
 * @param date - Date to format
 * @returns YYYY-MM-DD format for input fields
 */
export function formatDateForInput(date: Date | null): string {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns Boolean indicating if the date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Get relative date label
 * @param dateString - ISO date string
 * @returns String label like "Today", "Yesterday", or formatted date
 */
export function getRelativeDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (isToday(date)) {
    return 'اليوم';
  } else if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'الأمس';
  } else {
    return formatDate(dateString, 'short');
  }
}
