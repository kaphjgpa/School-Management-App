import TeacherUpdate from "./TeacherUpdate";
import TeacherDelete from "./TeacherDelete";

export function TeacherDashContent() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Teacher Dashboard
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TeacherUpdate />
        <TeacherDelete />
      </div>
    </div>
  );
}

export default TeacherDashContent;
