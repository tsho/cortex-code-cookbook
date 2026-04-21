import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ThreadMessage,
} from "@assistant-ui/react";
import { Thread } from "./thread";
import snowflakeMark from "./assets/snowflake.svg";

function lastUserText(messages: readonly ThreadMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    return m.content
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("");
  }
  return "";
}

const CortexAgentAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    const prompt = lastUserText(messages);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: abortSignal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`chat request failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line) continue;
        const event = JSON.parse(line) as
          | { type: "text-delta"; text: string }
          | { type: "error"; message: string };

        if (event.type === "text-delta") {
          text += (text ? "\n\n" : "") + event.text;
          yield { content: [{ type: "text", text }] };
        } else if (event.type === "error") {
          throw new Error(event.message);
        }
      }
    }
  },
};

export function App() {
  const runtime = useLocalRuntime(CortexAgentAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0.75rem 1.25rem",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
          }}
        >
          <img src={snowflakeMark} alt="" width={22} height={22} />
          <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
            Cortex Agent
          </span>
          <span
            style={{
              color: "var(--fg-muted)",
              fontSize: "0.8125rem",
              marginLeft: "auto",
            }}
          >
            powered by assistant-ui
          </span>
        </header>
        <main style={{ flex: 1, minHeight: 0 }}>
          <Thread />
        </main>
      </div>
    </AssistantRuntimeProvider>
  );
}
