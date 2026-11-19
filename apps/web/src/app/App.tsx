import { useEffect, useState } from "react";
import { CodeEditor, type CodeLanguage } from "../components/editor/CodeEditor";
import { processJson, type JsonOperation } from "../engines/browser/json.engine";

type Theme = "dark" | "light";
type Indentation = 2 | 4;

type OperationStatus = {
  type: "success" | "error";
  operation: JsonOperation;
  message: string;
};

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
  const [codes, setCodes] = useState<Record<CodeLanguage, string>>(initialCode);
  const [outputs, setOutputs] = useState<Record<CodeLanguage, string>>(emptyOutputs);
  const [indentation, setIndentation] = useState<Indentation>(2);
  const [statuses, setStatuses] =
    useState<Partial<Record<CodeLanguage, OperationStatus>>>({});

  const source = codes[language];
  const output = outputs[language];
  const status = statuses[language];
  const isJson = language === "json";

  const setSource = (value: string) => {
    setCodes((current) => ({ ...current, [language]: value }));
    setStatuses((current) => ({ ...current, [language]: undefined }));
    setOutputs((current) => ({ ...current, [language]: "" }));
  };

  const clearCurrentLanguage = () => {
    setCodes((current) => ({ ...current, [language]: "" }));
    setOutputs((current) => ({ ...current, [language]: "" }));
    setStatuses((current) => ({ ...current, [language]: undefined }));
  };

  const handleJsonOperation = (operation: JsonOperation) => {
    if (!isJson) return;

    const result = processJson(source, operation, indentation);

    if (result.success && operation !== "validate") {
      setOutputs((current) => ({ ...current, json: result.output }));
    }

    setStatuses((current) => ({
      ...current,
      json: {
        type: result.success ? "success" : "error",
        operation,
        message: result.message,
      },
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

  const reductionPercent =
    status?.operation === "minify" &&
    status.type === "success" &&
    sourceSize > 0
      ? Math.max(0, ((sourceSize - outputSize) / sourceSize) * 100)
      : null;

  return (
    <main className="mc-app-shell">
      <div className="mc-app-container">

        <header className="mc-header">
          <div className="flex items-center gap-3">
            <div className="mc-brand-mark">M</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">MiniCode</h1>
              <p className="text-xs mc-muted">by Zouviro</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs mc-muted sm:inline">
              Lightweight Online Code Toolkit
            </span>
            <button
              className="mc-button"
              onClick={() =>
                setTheme((current) => current === "dark" ? "light" : "dark")
              }
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
          </div>
        </header>

        <section className="mc-workspace-heading">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Code Workspace</h2>
            <p className="mt-1 text-xs mc-secondary">
              Write, optimize and validate your code in one place.
            </p>
          </div>
          <span className="mc-workspace-badge">Browser workspace</span>
        </section>

        <section className="mc-panel mc-language-bar">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[10px] font-bold tracking-wider mc-muted">
              LANGUAGE
            </span>

            {languages.map((item) => (
              <button
                key={item.id}
                onClick={() => setLanguage(item.id)}
                aria-pressed={language === item.id}
                className={`mc-language-button ${
                  language === item.id ? "active" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <span className="text-xs mc-muted">
            {source.length.toLocaleString()} characters
          </span>
        </section>

        <section className="mc-panel mc-toolbar">
          <div className="mc-toolbar-info">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Code Actions</p>
              <span className="mc-toolbar-mode">
                {isJson ? "JSON" : "Coming soon"}
              </span>
            </div>

            <p className="mt-1 text-xs mc-muted">
              {isJson
                ? "Processing runs locally in your browser."
                : "Processing engine for this language is coming soon."}
            </p>

            {status && (
              <p
                role="status"
                aria-live="polite"
                className="mt-2 text-xs font-medium"
                style={{
                  color: status.type === "success"
                    ? "var(--color-success)"
                    : "var(--color-danger)",
                }}
              >
                {status.type === "success" ? "✓ " : "⚠ "}
                {status.message}
                {reductionPercent !== null &&
                  ` · Size reduction: ${reductionPercent.toFixed(2)}%`}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isJson && (
              <label className="flex items-center gap-2 text-xs mc-secondary">
                Indent
                <select
                  value={indentation}
                  onChange={(event) =>
                    setIndentation(Number(event.target.value) as Indentation)
                  }
                  className="mc-button mc-indent-select"
                  aria-label="JSON indentation"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </label>
            )}

            <button
              className="mc-button mc-button-primary"
              disabled={!isJson}
              title={isJson ? "Minify JSON" : "Coming soon for this language"}
              onClick={() => handleJsonOperation("minify")}
            >
              ✦ Minify
            </button>

            <button
              className="mc-button"
              disabled={!isJson}
              title={isJson ? "Beautify JSON" : "Coming soon for this language"}
              onClick={() => handleJsonOperation("beautify")}
            >
              ↗ Beautify
            </button>

            <button
              className="mc-button"
              disabled={!isJson}
              title={isJson ? "Validate JSON" : "Coming soon for this language"}
              onClick={() => handleJsonOperation("validate")}
            >
              ✓ Validate
            </button>
          </div>
        </section>

        <section className="mc-workspace">

          <div className="mc-panel mc-editor-panel">
            <div className="mc-editor-header">
              <div className="flex items-center gap-2">
                <span className="mc-editor-dot input-dot" />
                <span className="text-sm font-semibold">Input</span>
                <span className="text-xs mc-muted">
                  {languages.find((item) => item.id === language)?.label}
                </span>
              </div>

              <button
                className="text-xs mc-secondary hover:text-[var(--text-primary)]"
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

            <div className="mc-editor-footer">
              <span>{lineCount} lines</span>
              <span>{formatBytes(sourceSize)}</span>
            </div>
          </div>

          <div className="mc-panel mc-editor-panel">
            <div className="mc-editor-header">
              <div className="flex items-center gap-2">
                <span className="mc-editor-dot output-dot" />
                <span className="text-sm font-semibold">Output</span>
                <span className="text-xs mc-muted">Processed code</span>
              </div>

              <span className="mc-readonly-label">READ ONLY</span>
            </div>

            <div className="mc-editor-shell mc-output-shell">
              <CodeEditor
                value={output}
                language={language}
                readOnly
                placeholder="Your processed code will appear here..."
              />

              {!output && (
                <div className="mc-output-placeholder">
                  <div className="mb-2 text-3xl opacity-30">{"{ }"}</div>
                  <p className="text-sm mc-secondary">
                    Your output will appear here
                  </p>
                  <p className="mt-1 text-xs mc-muted">
                    Process your code to see the result
                  </p>
                </div>
              )}
            </div>

            <div className="mc-editor-footer">
              <span>
                {output ? "Processing complete" : "Waiting for processing"}
              </span>
              <span>{formatBytes(outputSize)}</span>
            </div>
          </div>

        </section>

        <footer className="mc-footer">
          <span>MiniCode · A Zouviro project</span>
          <span>All processing stays in your browser until you choose otherwise.</span>
        </footer>

      </div>
    </main>
  );
}

export default App;
