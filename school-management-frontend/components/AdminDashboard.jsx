import { DashboardHeader } from "./DashboardHeader";
import { AdminSidebar } from "./AdminSidebar";
import { DashboardContent } from "./DashboardContent";

export function AdminDashboard() {
  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
