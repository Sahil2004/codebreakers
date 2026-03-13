"use client";

import { useState } from "react";

export function ChatbotFloating() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/travel-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data?.answer) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.answer as string },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I had trouble answering. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((x) => !x)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-black text-white dark:bg-white dark:text-black px-5 py-3 text-sm font-medium shadow-lg shadow-black/20 flex items-center gap-2"
      >
        <span>Ask NorthQuest AI</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[320px] max-w-[calc(100vw-3rem)] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 shadow-xl flex flex-col overflow-hidden backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">NorthQuest Assistant</span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Ask about seasons, budgets, routes
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Close
            </button>
          </div>

          <div className="flex-1 px-3 py-3 space-y-2 max-h-72 overflow-y-auto text-sm">
            {messages.length === 0 && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Try asking: &quot;Best time to visit Rishikesh?&quot; or
                &quot;3-day budget trip to Himachal from Delhi&quot;.
              </p>
            )}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-3 py-2 max-w-[85%] whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-black text-white dark:bg-white dark:text-black text-xs"
                      : "bg-zinc-100 dark:bg-zinc-900 text-xs text-left"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3 py-2 bg-zinc-100 dark:bg-zinc-900 text-[11px] text-zinc-500 dark:text-zinc-400">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-zinc-200/80 dark:border-zinc-800/80 px-3 py-2 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about North India travel..."
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-xs font-medium text-black dark:text-white disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

