import { useState } from "react";
import { Home, Users, Backpack, School } from "lucide-react";
import { cn } from "../src/lib/utils";
import { Button } from "../src/components/ui/button";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { icon: Home, label: "Dashboard", route: "/admindashboard" },
  { icon: Users, label: "Teachers", route: "/admindashboard/search-teachers" },
  {
    icon: Backpack,
    label: "Students",
    route: "/admindashboard/search-students",
  },
  { icon: School, label: "Classes", route: "/admindashboard/search-classes" },
  {
    icon: School,
    label: "Class Analytics",
    route: "/admindashboard/class-analytics",
  },
];
export function AdminSidebar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

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
                onClick={() => {
                  setActiveIndex(index);
                  navigate(item.route);
                }} // Set active index on click
                className={cn(
                  "w-full justify-start",
                  activeIndex === index
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
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
