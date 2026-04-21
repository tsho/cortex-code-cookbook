import express from "express";
import { query } from "@snowflake/cortex-code-agent-sdk";

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body as { prompt?: string };
  if (!prompt) {
    res.status(400).json({ error: "prompt required" });
    return;
  }

  res.setHeader("Content-Type", "application/x-ndjson");
  res.setHeader("Cache-Control", "no-cache");

  const write = (event: unknown) => {
    res.write(JSON.stringify(event) + "\n");
  };

  const abort = new AbortController();
  req.on("close", () => abort.abort());

  const q = query({
    prompt,
    options: {
      cwd: process.cwd(),
      connection: process.env.SNOWFLAKE_CONNECTION,
      model: process.env.CORTEX_MODEL,
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      abortController: abort,
      extraArgs: { "no-auto-update": null },
    },
  });

  try {
    for await (const event of q) {
      if (event.type !== "assistant") continue;
      for (const block of event.content) {
        if (block.type === "text" && block.text) {
          write({ type: "text-delta", text: block.text });
        }
      }
    }
  } catch (err) {
    write({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
    });
  } finally {
    res.end();
  }
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
});
