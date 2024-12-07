import AdminUpdateDialog from "./AdminUpdateDialog";
import AssignClass from "./AssignClass";
import CreateClass from "./CreateClass";
import UpdateClass from "./UpdateClass";

export function DashboardContent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AdminUpdateDialog />
        <AssignClass />
        <CreateClass />
        <UpdateClass />
        <AssignClass />
      </div>
    </div>
  );
}
