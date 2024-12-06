import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  OctagonMinus,
  Zap,
  Smartphone,
  School,
  TrendingUpDown,
  FileJson2,
  FileKey2,
  Filter,
  ListChecks,
  Columns3,
} from "lucide-react";

const FeatureCard = ({ Icon, title, description }) => (
  <Card className="flex flex-col items-center p-6 text-center">
    <CardHeader>
      <Icon className="h-12 w-12 text-primary mb-4" />
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-gray-500 dark:text-gray-400">
      {description}
    </CardContent>
  </Card>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="w-screen px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <School className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold">School Management App</h1>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:underline">
            <Button>Admin</Button>
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium hover:underline"
          >
            <Button>Teachers</Button>
          </a>
          <a href="#cta" className="text-sm font-medium hover:underline">
            <Button>Students</Button>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center  bg-gray-50 dark:bg-gray-800">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Manage Your Entire School Here
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl">
          Take control of your school
        </p>
        <div className="mt-6 flex gap-4">
          <Button>Signup</Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Features that you asked
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              Icon={FileJson2}
              title="CRUD Operation on all Models"
              description="Yours can perform CRUD operations on their profiles."
            />
            <FeatureCard
              Icon={FileKey2}
              title="Secure & Private"
              description="I have use Middleware in every route also I have you the bcrypt library to that your password are hassed in MongoDB"
            />
            <FeatureCard
              Icon={OctagonMinus}
              title="Students Limit"
              description="I have implemented a limiting logic in the backend, so that not more 30 students are allowed to enter in one class"
            />
            <FeatureCard
              Icon={Zap}
              title="One Admin Only"
              description="I have implemented only single admin approach in this application, multiple can't be created. This logic first checks first if admin is created in database"
            />
            <FeatureCard
              Icon={TrendingUpDown}
              title="Dynamic input fields "
              description="In this application I have implemented a dynamic input field based on the model"
            />
            <FeatureCard
              Icon={Smartphone}
              title="Mobile Optimized"
              description="Access your tasks on the go with our mobile-friendly design."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Bonus Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardHeader>
                <Columns3 className="h-10 w-10 text-primary mx-auto" />
                <CardTitle className="text-lg font-bold">Pagination</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-500 dark:text-gray-400">
                "It improves performance and user experience by loading data
                incrementally rather than all at once, often using "next" and
                "previous" navigation or numbered links to switch between
                pages."
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <Filter className="h-10 w-10 text-primary mx-auto" />
                <CardTitle className="text-lg font-bold">
                  Filtering and Sorting
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-500 dark:text-gray-400">
                "Focuses on narrowing down data by applying specific criteria or
                conditions. For example, showing only items that match a
                category."
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardHeader>
                <ListChecks className="h-10 w-10 text-primary mx-auto" />
                <CardTitle className="text-lg font-bold">
                  Form Validation via Zod
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-500 dark:text-gray-400">
                "It allows developers to define schemas for expected data
                structures and automatically validate form inputs against these
                schemas."
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
