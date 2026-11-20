"use client";

/** Last-resort boundary when the root layout itself fails. Must render its own <html>. */
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f3efe7", color: "#16140f", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <main style={{ maxWidth: 420, padding: 24 }}>
          <h1 style={{ fontSize: 32, margin: 0 }}>Something went wrong</h1>
          <p>The store could not load. Please try again in a moment.</p>
          <button type="button" onClick={() => reset()} style={{ padding: "12px 20px", borderRadius: 999, border: 0, background: "#16140f", color: "#fbf9f5", cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
