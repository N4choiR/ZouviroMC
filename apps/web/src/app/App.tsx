import { useEffect, useState } from "react";
import {
  CodeEditor,
  type CodeLanguage,
} from "../components/editor/CodeEditor";

type Theme = "dark" | "light";

const languages: { id: CodeLanguage; label: string }[] = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "javascript", label: "JavaScript" },
  { id: "json", label: "JSON" },
  { id: "xml", label: "XML" },
];

const initialCode: Record<CodeLanguage, string> = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MiniCode</title>
</head>
<body>
  <main>
    <h1>Hello, MiniCode!</h1>
    <p>Your code workspace is ready.</p>
  </main>
</body>
</html>`,

  css: `/* MiniCode CSS Example */

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0c0d12;
}

.title {
  color: #7867ff;
  font-size: 32px;
  font-weight: bold;
}`,

  javascript: `// MiniCode JavaScript Example

const app = {
  name: "MiniCode",
  version: "1.0.0",
};

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet(app.name));`,

  json: `{
  "name": "MiniCode",
  "version": "1.0.0",
  "description": "Lightweight Online Code Toolkit",
  "languages": [
    "HTML",
    "CSS",
    "JavaScript",
    "JSON",
    "XML"
  ]
}`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<project>
  <name>MiniCode</name>
  <version>1.0.0</version>
  <description>
    Lightweight Online Code Toolkit
  </description>
  <languages>
    <language>HTML</language>
    <language>CSS</language>
    <language>JavaScript</language>
    <language>JSON</language>
    <language>XML</language>
  </languages>
</project>`,
};

const emptyOutputs: Record<CodeLanguage, string> = {
  html: "",
  css: "",
  javascript: "",
  json: "",
  xml: "",
};

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("minicode-theme");
    return saved === "light" ? "light" : "dark";
  });

  const [language, setLanguage] = useState<CodeLanguage>("html");

  // Independent source code for every language.
  const [codes, setCodes] =
    useState<Record<CodeLanguage, string>>(initialCode);

  // Independent output for every language.
  const [outputs, setOutputs] =
    useState<Record<CodeLanguage, string>>(emptyOutputs);

  const source = codes[language];
  const output = outputs[language];

  const setSource = (value: string) => {
    setCodes((current) => ({
      ...current,
      [language]: value,
    }));
  };

  // Clear only the selected language.
  const clearCurrentLanguage = () => {
    setCodes((current) => ({
      ...current,
      [language]: "",
    }));

    setOutputs((current) => ({
      ...current,
      [language]: "",
    }));
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("minicode-theme", theme);
  }, [theme]);

  const lineCount = source ? source.split("\n").length : 0;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const sourceSize = new Blob([source]).size;
  const outputSize = new Blob([output]).size;

  return (
    <main className="min-h-screen px-4 py-5 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1600px]">

        {/* Header */}
        <header
          className="flex flex-wrap items-center justify-between gap-4 border-b pb-5"
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
              <h1 className="text-lg font-bold tracking-tight">
                MiniCode
              </h1>
              <p className="text-xs mc-muted">by Zouviro</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs mc-muted sm:inline">
              Lightweight Online Code Toolkit
            </span>

            <button
              className="mc-button"
              onClick={() =>
                setTheme((current) =>
                  current === "dark" ? "light" : "dark"
                )
              }
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
          </div>
        </header>

        {/* Workspace Heading */}
        <section className="py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Code Workspace
              </h2>

              <p className="mt-2 text-sm mc-secondary">
                Write, optimize and validate your code in one place.
              </p>
            </div>

            <span
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                background: "var(--color-accent-soft)",
                color: "var(--color-accent)",
              }}
            >
              Browser workspace
            </span>
          </div>
        </section>

        {/* Language Selector */}
        <section className="mc-panel mb-4 flex flex-wrap items-center justify-between gap-3 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs font-semibold mc-muted">
              LANGUAGE
            </span>

            {languages.map((item) => (
              <button
                key={item.id}
                onClick={() => setLanguage(item.id)}
                aria-pressed={language === item.id}
                className="rounded-lg border px-3 py-2 text-xs font-semibold transition-colors"
                style={{
                  background:
                    language === item.id
                      ? "var(--color-accent-soft)"
                      : "transparent",
                  borderColor:
                    language === item.id
                      ? "var(--color-accent)"
                      : "var(--border-subtle)",
                  color:
                    language === item.id
                      ? "var(--color-accent)"
                      : "var(--text-secondary)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <span className="text-xs mc-muted">
            {source.length.toLocaleString()} characters
          </span>
        </section>

        {/* Editors */}
        <section className="mc-workspace">

          {/* Input */}
          <div className="mc-panel overflow-hidden">
            <div
              className="flex h-12 items-center justify-between border-b px-4"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "var(--color-accent)" }}
                />

                <span className="text-sm font-semibold">Input</span>

                <span className="text-xs mc-muted">
                  {languages.find((item) => item.id === language)?.label}
                </span>
              </div>

              <button
                className="text-xs mc-secondary transition-colors hover:text-[var(--text-primary)]"
                onClick={clearCurrentLanguage}
              >
                Clear
              </button>
            </div>

            <div className="mc-editor-shell">
              <CodeEditor
                value={source}
                language={language}
                onChange={setSource}
                placeholder="Start writing your code..."
              />
            </div>

            <div
              className="flex h-10 items-center justify-between border-t px-4 text-xs"
              style={{
                borderColor: "var(--border-subtle)",
                color: "var(--text-muted)",
              }}
            >
              <span>{lineCount} lines</span>
              <span>{formatBytes(sourceSize)}</span>
            </div>
          </div>

          {/* Output */}
          <div className="mc-panel overflow-hidden">
            <div
              className="flex h-12 items-center justify-between border-b px-4"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "var(--color-success)" }}
                />

                <span className="text-sm font-semibold">Output</span>

                <span className="text-xs mc-muted">
                  Processed code
                </span>
              </div>

              <span
                className="rounded-md px-2 py-1 text-[10px] font-semibold"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-muted)",
                }}
              >
                READ ONLY
              </span>
            </div>

            <div className="mc-editor-shell relative">
              <CodeEditor
                value={output}
                language={language}
                readOnly
                placeholder="Your processed code will appear here..."
              />

              {!output && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
                  <div>
                    <div className="mb-3 text-3xl opacity-30">
                      {"{ }"}
                    </div>

                    <p className="text-sm mc-secondary">
                      Your output will appear here
                    </p>

                    <p className="mt-2 text-xs mc-muted">
                      Process your code to see the result
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div
              className="flex h-10 items-center justify-between border-t px-4 text-xs"
              style={{
                borderColor: "var(--border-subtle)",
                color: "var(--text-muted)",
              }}
            >
              <span>
                {output ? "Processing complete" : "Waiting for processing"}
              </span>

              <span>{formatBytes(outputSize)}</span>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="mc-panel mt-4 flex flex-wrap items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-semibold">Code Actions</p>

            <p className="mt-1 text-xs mc-muted">
              Processing engines will be connected in the next stage.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="mc-button mc-button-primary"
              disabled
              title="Coming in the next stage"
            >
              ✦ Minify
            </button>

            <button
              className="mc-button"
              disabled
              title="Coming in the next stage"
            >
              ↗ Beautify
            </button>

            <button
              className="mc-button"
              disabled
              title="Coming in the next stage"
            >
              ✓ Validate
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 py-6 text-xs mc-muted">
          <span>MiniCode · A Zouviro project</span>

          <span>
            All processing stays in your browser until you choose otherwise.
          </span>
        </footer>

      </div>
    </main>
  );
}

export default App;
