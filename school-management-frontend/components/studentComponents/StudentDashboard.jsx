import SearchStudent from "./SearchStudent";
import StudentDashContent from "./StudentDashContent";

import StudentDashHeader from "./StudentDashHeader";

export function StudentDashboard() {
  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col flex-1 overflow-hidden">
        <StudentDashHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <StudentDashContent />
          <SearchStudent />
        </main>
      </div>
    </div>
  );
}
export default StudentDashboard;
