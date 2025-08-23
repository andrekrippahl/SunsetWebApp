// src/lib/stream.js
export async function streamRows({ url, onJson, onDone, onError, signal }) {
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "text/event-stream, application/x-ndjson, application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  const isSse = contentType.includes("text/event-stream");

  const flushSseBlock = (block) => {
    // Parse one SSE block. It can contain multiple data: lines.
    let event = "message";
    const dataLines = [];
    for (const ln of block.split("\n")) {
      if (ln.startsWith("event:")) event = ln.slice(6).trim();
      else if (ln.startsWith("data:")) dataLines.push(ln.slice(5).trim());
    }
    const payload = dataLines.join("\n");
    if (!payload) return;

    try {
      const obj = JSON.parse(payload);

      // Ignore non-record events
      if (event === "done" || obj?.done === true) {
        onDone?.();
        return;
      }
      if (event === "record" || event === "message") {
        onJson?.(obj);
      }
      // any other event names are ignored
    } catch {
      /* ignore non-JSON events like keep-alives */
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      if (isSse) {
        // SSE blocks separated by blank line
        let idx;
        while ((idx = buffer.indexOf("\n\n")) >= 0) {
          const block = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          if (block.trim()) flushSseBlock(block);
        }
      } else {
        // NDJSON (one JSON object per line)
        let idx;
        while ((idx = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);
          if (!line) continue;
          try {
            const obj = JSON.parse(line);
            if (obj?.done === true) { onDone?.(); continue; } // ignore "done"
            onJson?.(obj);
          } catch {
            // partial chunk; put it back and wait for more
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    }

    // Flush any trailing SSE block
    if (isSse && buffer.trim()) flushSseBlock(buffer.trim());

    onDone?.();
  } catch (e) {
    if (signal?.aborted) return;
    onError?.(e);
  } finally {
    reader.releaseLock?.();
  }
}
