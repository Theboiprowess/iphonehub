import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-2 sm:gap-3",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {role === "assistant" && (
        <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-[#CDB586] to-[#B8A06E] rounded-lg flex items-center justify-center shadow-md ring-2 ring-[#CDB586]/20">
          <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0E161B]" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-md",
          role === "user"
            ? "bg-gradient-to-br from-[#CDB586] to-[#B8A06E] text-[#0E161B] ring-2 ring-[#CDB586]/30"
            : "bg-gradient-to-br from-[#CDB586]/10 to-[#CDB586]/5 text-[#EBE2C5] border border-[#CDB586]/30"
        )}
      >
        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
      {role === "user" && (
        <div className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-[#0E161B] to-[#0F1A20] rounded-lg flex items-center justify-center shadow-md ring-2 ring-[#CDB586]/20">
          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#CDB586]" />
        </div>
      )}
    </div>
  );
}
