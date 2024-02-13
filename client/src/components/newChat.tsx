import { Card } from "./ui/card";

export default function Component({
  data,
  handleSuggestions,
}: {
  data: string[];
  handleSuggestions: (str: string) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Start sending messages to the world
        </h4>
        <p className="text-gray-500 dark:text-gray-400">
          You are connected to the chat room. Start typing to send messages.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data.map((str, idx) => (
          <Card
            key={idx}
            onClick={() => handleSuggestions(str)}
            className="flex-1 rounded-lg bg-gray-100 dark:bg-gray-900 p-4 shadow-sm cursor-pointer transition-all duration-300"
          >
            <p className="text-sm">{str}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
