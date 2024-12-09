import StudentUpdate from "./StudentUpdate";
import StudentDelete from "./StudentDelete";

export function StudentDashContent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Students Dashboard
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StudentUpdate />
        <StudentDelete />
      </div>
    </div>
  );
}

export default StudentDashContent;
