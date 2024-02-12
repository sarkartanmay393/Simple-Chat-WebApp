import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Component() {
  return (
    <ScrollArea className="flex-1 min-h-[90%]">
      <div className="p-0 space-y-4">
        <div className="flex gap-2 items-start">
          <Avatar>
            <AvatarImage alt="User 1" src="/placeholder-avatar.jpg" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-4 max-w-[75%]">
            <p className="text-sm">Hey, how's it going? 😊</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
