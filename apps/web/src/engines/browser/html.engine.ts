import { parse, serialize } from "parse5";

export type HtmlOperation = "minify" | "beautify" | "validate";

export type HtmlResult =
  | {
      success: true;
      output: string;
      message: string;
    }
  | {
      success: false;
      output: "";
      message: string;
    };

type HtmlNode = {
  nodeName: string;
  tagName?: string;
  value?: string;
  data?: string;
  name?: string;
  publicId?: string;
  systemId?: string;
  attrs?: { name: string; value: string }[];
  childNodes?: HtmlNode[];
};

const voidTags = new Set([
  "area", "base", "br", "col", "embed", "hr", "img",
  "input", "link", "meta", "param", "source", "track", "wbr",
]);

const blockTags = new Set([
  "address", "article", "aside", "blockquote", "body",
  "caption", "dd", "details", "dialog", "div", "dl",
  "dt", "fieldset", "figcaption", "figure", "footer",
  "form", "h1", "h2", "h3", "h4", "h5", "h6",
  "head", "header", "hr", "html", "li", "main",
  "nav", "ol", "p", "section", "summary", "table",
  "tbody", "td", "tfoot", "th", "thead", "tr", "ul",
]);

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

function formatAttributes(node: HtmlNode): string {
  return (node.attrs ?? [])
    .map((attr) => ` ${attr.name}="${escapeAttribute(attr.value)}"`)
    .join("");
}

function isBlockElement(node: HtmlNode): boolean {
  return !!node.tagName && blockTags.has(node.tagName);
}

function isWhitespaceText(node: HtmlNode): boolean {
  return node.nodeName === "#text" && !(node.value ?? "").trim();
}

function formatNode(node: HtmlNode, depth = 0): string {
  const indentation = "  ".repeat(depth);

  if (node.nodeName === "#text") {
    return node.value ?? "";
  }

  if (node.nodeName === "#comment") {
    return `<!--${node.data ?? ""}-->`;
  }

  if (node.nodeName === "#documentType") {
    return `<!DOCTYPE ${node.name || "html"}>`;
  }

  if (!node.tagName) {
    return formatChildren(node.childNodes ?? [], depth);
  }

  const tag = node.tagName;
  const opening = `<${tag}${formatAttributes(node)}>`;

  if (voidTags.has(tag)) {
    return opening;
  }

  const closing = `</${tag}>`;
  const children = node.childNodes ?? [];

  // Keep inline content and whitespace-sensitive elements unchanged.
  if (
    !children.some(isBlockElement) ||
    ["pre", "textarea", "script", "style"].includes(tag)
  ) {
    return opening + children.map((child) => formatNode(child, depth)).join("") + closing;
  }

  const content = children
    .filter((child) => !isWhitespaceText(child))
    .map((child) => {
      if (isBlockElement(child)) {
        return `\n${"  ".repeat(depth + 1)}${formatNode(child, depth + 1)}`;
      }

      return formatNode(child, depth + 1);
    })
    .join("");

  return `${opening}${content}\n${indentation}${closing}`;
}

function formatChildren(children: HtmlNode[], depth: number): string {
  return children
    .filter((child) => !isWhitespaceText(child))
    .map((child) => formatNode(child, depth))
    .join("\n");
}

function removeWhitespaceNodes(node: HtmlNode, preserve = false): void {
  const tag = node.tagName?.toLowerCase();

  const shouldPreserve =
    preserve ||
    ["pre", "textarea", "script", "style"].includes(tag ?? "");

  const children = node.childNodes;

  if (!children) return;

  for (const child of children) {
    removeWhitespaceNodes(child, shouldPreserve);
  }

  if (!shouldPreserve) {
    node.childNodes = children.filter((child, index) => {
      if (!isWhitespaceText(child)) return true;

      const previous = children
        .slice(0, index)
        .reverse()
        .find((item) => !isWhitespaceText(item));

      const next = children
        .slice(index + 1)
        .find((item) => !isWhitespaceText(item));

      // Preserve spacing between inline elements and text nodes.
      if (previous && next) {
        const previousIsInline = !isBlockElement(previous);
        const nextIsInline = !isBlockElement(next);

        if (previousIsInline && nextIsInline) {
          child.value = " ";
          return true;
        }
      }

      return false;
    });
  }
}

export function processHtml(source: string, operation: HtmlOperation): HtmlResult {
  if (!source.trim()) {
    return {
      success: false,
      output: "",
      message: "Please enter HTML code first.",
    };
  }

  try {
    const parseErrors: string[] = [];

    const document = parse(source, {
      onParseError(error) {
        parseErrors.push(error.code);
      },
    });

    if (operation === "validate") {
      if (parseErrors.length > 0) {
        const uniqueErrors = [...new Set(parseErrors)];

        return {
          success: false,
          output: "",
          message: `HTML parsing found ${parseErrors.length} issue(s): ${uniqueErrors.slice(0, 4).join(", ")}.`,
        };
      }

      return {
        success: true,
        output: source,
        message: "HTML parsed successfully. No parser errors found.",
      };
    }

    if (operation === "minify") {
      removeWhitespaceNodes(document as unknown as HtmlNode);

      return {
        success: true,
        output: serialize(document),
        message: "HTML minified successfully.",
      };
    }

    const formatted = formatNode(document as unknown as HtmlNode);

    return {
      success: true,
      output: formatted.trim(),
      message: "HTML formatted successfully (2 spaces).",
    };
  } catch {
    return {
      success: false,
      output: "",
      message: "An unexpected HTML processing error occurred.",
    };
  }
}

