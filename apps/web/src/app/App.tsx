import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("minicode-theme");
    return savedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("minicode-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <main className="min-h-screen px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b pb-6"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold text-white"
              style={{ background: "var(--color-accent)" }}
            >
              M
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">MiniCode</h1>
              <p className="text-xs mc-muted">by Zouviro</p>
            </div>
          </div>

          <button className="mc-button" onClick={toggleTheme}>
            <span>{theme === "dark" ? "☀" : "☾"}</span>
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        </header>

        <section className="py-16 text-center sm:py-20">
          <div
            className="mx-auto mb-5 inline-flex rounded-full px-4 py-2 text-xs font-semibold"
            style={{
              background: "var(--color-accent-soft)",
              color: "var(--color-accent)",
            }}
          >
            Lightweight Online Code Toolkit
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your code.
            <br />
            <span style={{ color: "var(--color-accent)" }}>
              Cleaner and faster.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            A modern toolkit to minify, format and validate your code.
            Simple, fast and designed for developers.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {["HTML", "CSS", "JavaScript", "JSON", "XML"].map((language) => (
              <span
                key={language}
                className="rounded-lg border px-3 py-2 text-xs font-medium"
                style={{
                  borderColor: "var(--border-subtle)",
                  background: "var(--bg-panel)",
                  color: "var(--text-secondary)",
                }}
              >
                {language}
              </span>
            ))}
          </div>
        </section>

        <section className="mc-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Design System</h3>
              <p className="mt-1 text-sm mc-secondary">
                The visual foundation of MiniCode.
              </p>
            </div>

            <span
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                background: "var(--color-accent-soft)",
                color: "var(--color-accent)",
              }}
            >
              Version 1.0
            </span>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider mc-muted">
              Color palette
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { name: "App Background", color: "var(--bg-app)" },
                { name: "Panel", color: "var(--bg-panel)" },
                { name: "Accent", color: "var(--color-accent)" },
                { name: "Elevated", color: "var(--bg-elevated)" },
              ].map((item) => (
                <div key={item.name}>
                  <div
                    className="h-16 rounded-xl border"
                    style={{
                      background: item.color,
                      borderColor: "var(--border-subtle)",
                    }}
                  />
                  <p className="mt-2 text-xs mc-secondary">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider mc-muted">
              Components
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button className="mc-button mc-button-primary">
                Primary Button
              </button>

              <button className="mc-button">
                Secondary Button
              </button>

              <span
                className="rounded-lg px-3 py-2 text-xs font-semibold"
                style={{
                  background: "rgba(53, 201, 138, 0.12)",
                  color: "var(--color-success)",
                }}
              >
                Success
              </span>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-xs mc-muted">
          MiniCode · A Zouviro project
        </footer>
      </div>
    </main>
  );
}

export default App;
