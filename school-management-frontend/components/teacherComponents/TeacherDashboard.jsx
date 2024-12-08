import SearchTeacher from "./SearchTeacher";
import TeacherDashContent from "./TeacherDashContent";
import TeacherDashHeader from "./TeacherDashHeader";

export function TeacherDashboard() {
  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col flex-1 overflow-hidden">
        <TeacherDashHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <TeacherDashContent />
          <SearchTeacher />
        </main>
      </div>
    </div>
  );
}
export default TeacherDashboard;
