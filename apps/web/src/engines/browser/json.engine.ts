export type JsonOperation = "minify" | "beautify" | "validate";

export type JsonResult =
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
  if (error instanceof SyntaxError) {
    return error.message;
  }

  return "An unexpected JSON processing error occurred.";
}

export function processJson(
  source: string,
  operation: JsonOperation,
  indentation: 2 | 4 = 2,
): JsonResult {
  if (!source.trim()) {
    return {
      success: false,
      output: "",
      message: "Please enter JSON code first.",
    };
  }

  try {
    const parsed: unknown = JSON.parse(source);

    if (operation === "validate") {
      return {
        success: true,
        output: source,
        message: "Valid JSON. No syntax errors found.",
      };
    }

    if (operation === "minify") {
      return {
        success: true,
        output: JSON.stringify(parsed),
        message: "JSON minified successfully.",
      };
    }

    return {
      success: true,
      output: JSON.stringify(parsed, null, indentation),
      message: `JSON formatted successfully (${indentation} spaces).`,
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      message: getErrorMessage(error),
    };
  }
}
