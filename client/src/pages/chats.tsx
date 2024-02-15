import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Socket, io } from "socket.io-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { BASEURL, cn, session } from "@/lib/utils";

interface Message {
  body: string;
  userName: string;
  sendAt: Date;
}

export default function ChatDashboard() {
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [typingUser, setTypingUser] = useState<Set<string>>(new Set());
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newUser, setNewUser] = useState(true);

  const { set, get } = session();

  useEffect(() => {
    const username = get();
    if (!username) {
      return;
    }

    setNewUser(false);
    setUsername(username);
    setMessages(
      Array(50).fill({
        body: "Hey, how's it going? 😊",
        userName: "",
        sendAt: new Date(),
      })
    );

    const socket = io(BASEURL);

    socket.on("connect", () => {
      console.log("Connection established");
    });

    socket.on("disconnect", () => {
      console.log("Disconntected");
    });

    socket.on("globalMessage", (message, username, time) => {
      setMessages((p) => [
        ...p,
        {
          body: message,
          userName: username,
          sendAt: time,
        },
      ]);
    });

    socket.on("globalTyping", (username: string, isTyping) => {
      console.log(username, isTyping);
      if (isTyping) {
        if (!typingUser.has(username)) {
          setTypingUser((p) => {
            const n = new Set([...p, username]);
            return n;
          });
        }
      } else {
        setTypingUser(new Set());
      }
    });

    setSocket(socket);
    return () => {
      socket.close();
    };
  }, [newUser]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
    socket?.emit("typing", username, true);
  };

  // const handleSuggestions = (sugg: string) => {
  //   setInput(sugg);
  // };

  const handleNewUser = useCallback(() => {
    if (username) {
      setNewUser(false);
      set(username);
    }
  }, [username]);

  const handleSend = () => {
    if (input) {
      socket?.emit("userMessage", input, username);
      setInput("");
      socket?.emit("typing", username, false);
    }
  };

  const typers = useMemo(() => {
    const arr = [] as string[];
    typingUser.forEach((user) => {
      arr.push(user);
    });

    return arr;
  }, [typingUser]);

  return (
    <div className="h-screen flex flex-col overflow-hidden items-center">
      <header className="h-[4rem] p-1 border-b flex flex-col items-center justify-center">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-normal lg:text-3xl">
          Global Chats
        </h1>
        <div className="w-full h-fit overflow-x-scroll overflow-y-hidden">
          <p
            className={cn(
              "text-sm text-muted-foreground transition-display duration-300",
              typingUser.size === 0 && "hidden"
            )}
          >
            {typers.length === 1
              ? typers[0] !== username && "Typing "
              : "Typing "}
            {typers.map((user, i) => {
              if (user === username) {
                return "";
              }
              if (i + 1 === typers.length) {
                return user;
              }
              return `${user}, `;
            })}
          </p>
        </div>
      </header>
      <main className="h-[calc(100%-4rem)] p-4 w-full sm:max-w-2xl space-y-4 flex flex-col">
        {!newUser ? (
          <>
            <div className="flex-1 w-full flex flex-col justify-end overflow-auto">
              <ScrollingMessages username={username} messages={messages} />
            </div>
            <div className="h-14 flex gap-4 items-center">
              <Input
                className="h-full flex-1 p-4 text-md"
                placeholder="Type a message"
                value={input}
                // onFocus={handleFocus}
                // onBlur={handleBlur}
                onChange={handleOnChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
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
          </>
        ) : (
          <NewUserOnboarding
            username={username}
            setUsername={setUsername}
            handleNewUser={handleNewUser}
          />
        )}
      </main>
    </div>
  );
}

interface ScrollingMessagesProps {
  username: string;
  messages: Message[];
}

const ScrollingMessages = ({ messages, username }: ScrollingMessagesProps) => {
  const endElement = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (endElement.current) {
      endElement.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const memoizedMessages = useMemo(
    () =>
      messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex gap-2 items-start",
            message.userName === username && "place-self-end shadow-sm"
          )}
        >
          <Avatar>
            <AvatarFallback
              className={message.userName === username ? "bg-green-100" : ""}
            >
              {message.userName.slice(0, 1) || "U1"}
            </AvatarFallback>
          </Avatar>
          <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-4 max-w-[75%]">
            <p className="text-sm">{message.body}</p>
          </div>
        </div>
      )),
    [messages, username]
  );

  return (
    <div className="flex flex-col overflow-scroll gap-4">
      {memoizedMessages}
      <div ref={endElement}></div>
    </div>
  );
};

interface Props {
  username: string;
  setUsername: (s: string) => void;
  handleNewUser: () => void;
}
const NewUserOnboarding = ({ username, setUsername, handleNewUser }: Props) => {
  const memoizedInput = useMemo(() => {
    return (
      <Input
        name="username"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
        className="h-full flex-1 p-4 text-lg"
        placeholder="Type a username"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleNewUser();
        }}
      />
    );
  }, [username, setUsername, handleNewUser]);

  return (
    <div className="h-full flex flex-col items-start justify-center gap-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight ml-1">
        Start by typing a unique username
      </h3>
      <div className="h-fit w-full flex items-center justify-center gap-2">
        {memoizedInput}
        <Button size="icon" onClick={handleNewUser} className="w-14 h-[50px]">
          <Send className="" />
        </Button>
      </div>
    </div>
  );
};
