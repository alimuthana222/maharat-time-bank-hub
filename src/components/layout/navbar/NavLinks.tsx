
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Calendar,
  Search,
  Store
} from "lucide-react";

export function NavLinks() {
  const { user } = useAuth();

  // إخفاء القوائم للمستخدمين غير المسجلين
  if (!user) {
    return null;
  }

  const mainLinks = [
    {
      title: "المتجر",
      href: "/marketplace",
      icon: Store,
      description: "استعرض الخدمات المتاحة"
    },
    {
      title: "المجتمع",
      href: "/community",
      icon: Users,
      description: "تفاعل مع أعضاء المجتمع"
    },
    {
      title: "الرسائل",
      href: "/messages",
      icon: MessageSquare,
      description: "محادثاتك الشخصية"
    },
    {
      title: "الفعاليات",
      href: "/events",
      icon: Calendar,
      description: "الفعاليات والأنشطة"
    },
    {
      title: "البحث",
      href: "/search",
      icon: Search,
      description: "ابحث عن الخدمات والمستخدمين"
    }
  ];

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>التصفح</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {mainLinks.map((link) => (
                <ListItem
                  key={link.title}
                  title={link.title}
                  href={link.href}
                  icon={link.icon}
                >
                  {link.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { 
    title: string; 
    icon: React.ComponentType<{ className?: string }>;
  }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
