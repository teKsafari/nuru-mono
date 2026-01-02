import ElectronicsSimulator from "@/components/(electronics)/electronics-simulator";
import { Playground } from "@/components/playground/playground"
import { LessonContent } from "@/types/playground";
import { executeNuru } from "@/lib/nuru";

export default function PlayPage() {
  return (
    <main className="font-mono min-h-screen p-4 md:p-8 bg-background">

        <ElectronicsSimulator />
    
    </main>
  );
}



const electronicsLesson: LessonContent = {
  title: "Electronics",
  description: "",
  initialCode: "",
}

