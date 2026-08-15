"use server";

export async function hasLocalApiKey() {
  return !!process.env.OPENROUTER_API_KEY;
}
