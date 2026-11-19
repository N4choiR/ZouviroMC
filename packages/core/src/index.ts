export type SupportedLanguage =
  | "html"
  | "css"
  | "javascript"
  | "json"
  | "xml";

export type ProcessingMode = "browser" | "server";

export type OperationType = "minify" | "beautify";

export interface ProcessRequest {
  language: SupportedLanguage;
  operation: OperationType;
  code: string;
  mode: ProcessingMode;
}

export interface ProcessResult {
  code: string;
  originalSize: number;
  outputSize: number;
  savedBytes: number;
  savedPercent: number;
}
