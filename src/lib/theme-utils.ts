
export type Theme = 'light' | 'dark' | 'system';

/**
 * Gets the current theme preference
 * @returns The current theme: 'light', 'dark', or 'system'
 */
export function getTheme(): Theme {
  // Check for saved theme preference in localStorage
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  
  if (savedTheme) {
    return savedTheme;
  }
  
  // Check for system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'system';
  }
  
  // Default to light theme
  return 'light';
}

/**
 * Sets the theme and updates the document's class list
 * @param theme - The theme to set: 'light', 'dark', or 'system'
 */
export function setTheme(theme: Theme): void {
  // Store the user preference
  localStorage.setItem('theme', theme);
  
  // Apply the theme to the document
  switch (theme) {
    case 'dark':
      document.documentElement.classList.add('dark');
      break;
    case 'light':
      document.documentElement.classList.remove('dark');
      break;
    case 'system':
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      break;
  }
}

/**
 * Initializes theme from saved preference or system preference
 */
export function initTheme(): void {
  const theme = getTheme();
  
  // Apply the theme
  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Listen for system preference changes
  if (theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial check
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    }
    
    // Add event listener for changes
    const listener = (event: MediaQueryListEvent) => {
      if (getTheme() === 'system') {
        document.documentElement.classList.toggle('dark', event.matches);
      }
    };
    
    try {
      mediaQuery.addEventListener('change', listener);
    } catch (error) {
      // Fallback for older browsers
      mediaQuery.addListener(listener);
    }
  }
}
