import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";

export const Thread: FC = () => (
  <ThreadPrimitive.Root
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      maxWidth: "44rem",
      margin: "0 auto",
      padding: "1rem 1.25rem",
      boxSizing: "border-box",
    }}
  >
    <ThreadPrimitive.Viewport
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "1rem",
      }}
    >
      <ThreadPrimitive.Empty>
        <div
          style={{
            textAlign: "center",
            color: "var(--fg-muted)",
            marginTop: "4rem",
            fontSize: "0.9375rem",
          }}
        >
          Ask Cortex Code anything.
        </div>
      </ThreadPrimitive.Empty>

      <ThreadPrimitive.Messages
        components={{
          UserMessage,
          AssistantMessage,
        }}
      />
    </ThreadPrimitive.Viewport>

    <Composer />
  </ThreadPrimitive.Root>
);

const UserMessage: FC = () => (
  <MessagePrimitive.Root
    style={{
      alignSelf: "flex-end",
      background: "var(--bg-user)",
      color: "var(--fg-on-brand)",
      padding: "0.625rem 0.875rem",
      borderRadius: "var(--radius-lg)",
      margin: "0.375rem 0",
      maxWidth: "80%",
      whiteSpace: "pre-wrap",
      fontSize: "0.9375rem",
    }}
  >
    <MessagePrimitive.Parts />
  </MessagePrimitive.Root>
);

const AssistantMessage: FC = () => (
  <MessagePrimitive.Root
    style={{
      alignSelf: "flex-start",
      background: "var(--bg-assistant)",
      color: "var(--fg-default)",
      padding: "0.625rem 0.875rem",
      borderRadius: "var(--radius-lg)",
      margin: "0.375rem 0",
      maxWidth: "80%",
      whiteSpace: "pre-wrap",
      fontSize: "0.9375rem",
      border: "1px solid var(--border-subtle)",
    }}
  >
    <MessagePrimitive.Parts />
  </MessagePrimitive.Root>
);

const composerButton: React.CSSProperties = {
  border: "none",
  borderRadius: "var(--radius-sm)",
  padding: "0 0.875rem",
  height: "2rem",
  alignSelf: "flex-end",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.875rem",
  transition: "background 120ms ease",
};

const Composer: FC = () => (
  <ComposerPrimitive.Root
    style={{
      display: "flex",
      gap: "0.5rem",
      alignItems: "flex-end",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: "0.5rem",
      background: "var(--bg-surface)",
      boxShadow: "var(--shadow-sm)",
    }}
  >
    <ComposerPrimitive.Input
      placeholder="Send a message to Cortex Code..."
      rows={1}
      autoFocus
      style={{
        flex: 1,
        border: "none",
        outline: "none",
        resize: "none",
        fontSize: "0.9375rem",
        background: "transparent",
        color: "var(--fg-default)",
        padding: "0.25rem 0.375rem",
      }}
    />
    <ThreadPrimitive.If running={false}>
      <ComposerPrimitive.Send
        style={{
          ...composerButton,
          background: "var(--bg-user)",
          color: "var(--fg-on-brand)",
        }}
      >
        Send
      </ComposerPrimitive.Send>
    </ThreadPrimitive.If>
    <ThreadPrimitive.If running>
      <ComposerPrimitive.Cancel
        style={{
          ...composerButton,
          background: "var(--sf-red-50)",
          color: "var(--fg-on-brand)",
        }}
      >
        Stop
      </ComposerPrimitive.Cancel>
    </ThreadPrimitive.If>
  </ComposerPrimitive.Root>
);
