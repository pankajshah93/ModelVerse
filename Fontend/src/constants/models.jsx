// Single source of truth for the model picker — was previously duplicated
// (once on the landing page, once on the logged-in chat page).
export const MODEL_OPTIONS = ["qwen/qwen3.7-max-20260520", "google/gemini-3.5-flash-20260519", "deepseek/deepseek-v4-flash-0731"];

export const DEFAULT_MODEL = MODEL_OPTIONS[1];
