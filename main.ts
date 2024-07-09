import { convertMarkdownToDom, convertMarkdownToDomEffect } from "./markdown-parser-tools.ts";
import { Effect } from "npm:effect"

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts

// Example usage
const filePath = './test_markdown/three_links.md'; // Path to your markdown file

const foo = convertMarkdownToDomEffect(filePath);
const program1 = Effect.match(foo, {
  onFailure: (error) => `failure: ${error.message}`,
  onSuccess: (value) => `success: ${value}`
})

Effect.runPromise(program1).then(console.log)