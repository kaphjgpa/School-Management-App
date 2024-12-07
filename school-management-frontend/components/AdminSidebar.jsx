import { Home, Users, Backpack, School } from "lucide-react";
import { cn } from "../src/lib/utils";
import { Button } from "../src/components/ui/button";

const sidebarItems = [
  { icon: Home, label: "Dashboard" },
  { icon: Users, label: "Teachers" },
  { icon: Backpack, label: "Students" },
  { icon: School, label: "Classes" },
];

export function AdminSidebar() {
  return (
    <div className="flex flex-col w-64 bg-white border-r pl-4 pr-4">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-semibold">Admin</span>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2 py-4">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Button
                variant="default"
                className={cn(
                  "w-full justify-start",
                  index === 0 && "bg-blue-500 "
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
