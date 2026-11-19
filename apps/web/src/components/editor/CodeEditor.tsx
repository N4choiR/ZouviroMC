import { useEffect, useRef } from "react";
import {
  EditorState,
  type Extension,
} from "@codemirror/state";
import {
  EditorView,
  lineNumbers,
  highlightActiveLine,
} from "@codemirror/view";
import { basicSetup } from "codemirror";

import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";

export type CodeLanguage = "html" | "css" | "javascript" | "json" | "xml";

interface CodeEditorProps {
  value: string;
  language: CodeLanguage;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

function getLanguageExtension(language: CodeLanguage): Extension {
  switch (language) {
    case "html":
      return html();

    case "css":
      return css();

    case "javascript":
      return javascript();

    case "json":
      return json();

    case "xml":
      return xml();

    default:
      return [];
  }
}

const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "var(--bg-panel)",
    color: "var(--text-primary)",
    fontSize: "13px",
  },

  ".cm-content": {
    fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
    padding: "16px 0",
    caretColor: "var(--color-accent)",
  },

  ".cm-line": {
    padding: "0 16px",
  },

  ".cm-gutters": {
    backgroundColor: "var(--bg-panel)",
    color: "var(--text-muted)",
    border: "none",
    borderRight: "1px solid var(--border-subtle)",
  },

  ".cm-activeLine": {
    backgroundColor: "var(--color-accent-soft)",
  },

  ".cm-activeLineGutter": {
    backgroundColor: "var(--color-accent-soft)",
    color: "var(--text-primary)",
  },

  ".cm-cursor": {
    borderLeftColor: "var(--color-accent)",
  },

  ".cm-selectionBackground": {
    backgroundColor: "rgba(120, 103, 255, 0.25) !important",
  },

  "&.cm-focused": {
    outline: "none",
  },

  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "inherit",
  },

  ".cm-placeholder": {
    color: "var(--text-muted)",
  },
});

export function CodeEditor({
  value,
  language,
  onChange,
  readOnly = false,
  placeholder = "Start writing your code...",
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        lineNumbers(),
        highlightActiveLine(),
        getLanguageExtension(language),
        editorTheme,
        EditorView.editable.of(!readOnly),
        EditorState.readOnly.of(readOnly),
        EditorView.contentAttributes.of({
          "aria-label": `${language} code editor`,
          spellcheck: "false",
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current?.(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          ".cm-placeholder": {
            color: "var(--text-muted)",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [language, readOnly]);

  useEffect(() => {
    const view = viewRef.current;

    if (!view || view.state.doc.toString() === value) return;

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value,
      },
    });
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="mc-code-editor h-full min-h-[280px] overflow-hidden"
    >
      {!value && (
        <span className="sr-only">{placeholder}</span>
      )}
    </div>
  );
}
