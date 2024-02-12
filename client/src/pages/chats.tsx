import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChangeEvent, useEffect, useState } from "react";

import { Socket, io } from "socket.io-client";
import Component from "@/components/chat";

export default function ChatDashboard() {
  const [socket, setSocket] = useState<Socket>();

  const [input, setInput] = useState("");

  useEffect(() => {
    const socketIo = io("wss://localhost:9000");

    socketIo.on("connect", () => {
      console.log("Connection established");
    });

    socketIo.on("disconnect", () => {
      console.log("Disconntected");
    });

    setSocket(socketIo);
    return () => {
      socketIo.close();
    };
  }, []);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const handleSuggestions = (sugg: string) => {
    setInput(sugg);
  };

  const handleSend = () => {
    socket?.emit("message", input);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 border-b grid place-items-center">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-normal lg:text-4xl">
          Random Forest
        </h1>
      </header>
      <main className="flex-1 grid place-items-center p-4">
        <div className="h-full w-full sm:max-w-2xl space-y-4">
          <div className="flex-1 h-full w-full flex flex-col justify-center">
            {false ? (
              <Component />
            ) : (
              <>
                <div className="space-y-2">
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Start sending messages to the world
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    You are connected to the chat room. Start typing to send
                    messages.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {arr.map((str, idx) => (
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
            )}
          </div>
          <div className="flex gap-4 h-12 items-center">
            <Input
              className="h-full flex-1 p-4 text-md"
              placeholder="Type a message"
              value={input}
              onChange={handleOnChange}
            />
            <Button
              size="lg"
              className="h-[90%]"
              onClick={handleSend}
              disabled={!input.length}
            >
              Send
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

const arr = Array(6).fill("Hey, how's it going? 😊");
