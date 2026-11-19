import postcss from "postcss";
import type { Container } from "postcss";

export type CssOperation = "minify" | "beautify" | "validate";

export type CssResult =
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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected CSS processing error occurred.";
}

function minifyCss(root: postcss.Root): string {
  // Remove ordinary comments but preserve important /*! */ comments.
  root.walkComments((comment) => {
    if (!comment.text.startsWith("!")) {
      comment.remove();
    }
  });

  root.walk((node) => {
    node.raws.before = "";

    if (node.type === "decl") {
      node.raws.between = ":";
    }

    if (node.type === "rule") {
      node.raws.between = "";
    }

    if (node.type === "atrule") {
      node.raws.between = node.params ? " " : "";
    }

    if ("nodes" in node && node.nodes) {
      node.raws.after = "";
    }
  });

  root.raws.after = "";

  return root.toString().trim();
}

function formatContainer(
  container: Container,
  depth: number,
  indentation: string,
): void {
  const children = container.nodes ?? [];

  children.forEach((node) => {
    node.raws.before = `\n${indentation.repeat(depth + 1)}`;

    if (node.type === "decl") {
      node.raws.between = ": ";

      if (node.important) {
        node.raws.important = " !important";
      }
    }

    if (node.type === "rule") {
      node.raws.between = " ";
      formatContainer(node, depth + 1, indentation);
    }

    if (node.type === "atrule" && node.nodes) {
      node.raws.between = node.params ? " " : "";
      formatContainer(node, depth + 1, indentation);
    }
  });

  container.raws.after = children.length
    ? `\n${indentation.repeat(depth)}`
    : "";

  container.raws.semicolon = true;
}

function beautifyCss(
  root: postcss.Root,
  indentation: 2 | 4,
): string {
  const indent = " ".repeat(indentation);

  formatContainer(root, 0, indent);

  return root.toString().trim();
}

export function processCss(
  source: string,
  operation: CssOperation,
  indentation: 2 | 4 = 2,
): CssResult {
  if (!source.trim()) {
    return {
      success: false,
      output: "",
      message: "Please enter CSS code first.",
    };
  }

  try {
    const root = postcss.parse(source, { from: undefined });

    if (operation === "validate") {
      return {
        success: true,
        output: source,
        message: "Valid CSS. No syntax errors found.",
      };
    }

    if (operation === "minify") {
      return {
        success: true,
        output: minifyCss(root),
        message: "CSS minified successfully.",
      };
    }

    return {
      success: true,
      output: beautifyCss(root, indentation),
      message: `CSS formatted successfully (${indentation} spaces).`,
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      message: getErrorMessage(error),
    };
  }
}

