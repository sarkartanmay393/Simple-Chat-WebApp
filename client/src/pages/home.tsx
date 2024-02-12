import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-screen flex flex-col gap-6 items-center justify-center overflow-hidden">
      <ModeToggle className="absolute top-4 right-4" />
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Welcome to Global Chats
      </h2>
      <Button variant="default" size="lg" onClick={() => navigate("/chats")}>
        Start Chatting
      </Button>
    </div>
  );
}

export default HomePage;
