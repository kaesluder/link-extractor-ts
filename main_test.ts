import {
  assert,
  assertEquals,
  assertIsError,
  assertMatch,
} from "jsr:@std/assert";
import { add } from "./main.ts";
import {
  convertMarkdownToDom,
  convertMarkdownToDomEffect,
} from "./markdown-parser-tools.ts";
import { Effect } from "npm:effect";
import { Element } from "jsr:@b-fuze/deno-dom";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});

Deno.test("convertMarkdownToDom should be able to read three_links.md", async () => {
  const filename = "./test_markdown/three_links.md";

  const urlreg = new RegExp("example.com");

  const dom = await convertMarkdownToDom(filename);

  const links = dom.querySelectorAll("A");
  const firstLink = links.item(0) as Element;

  assertEquals(firstLink.textContent, "three links: a");

  const href = firstLink.getAttribute("href");
  if (href === null) {
    throw new Error("The href attribute is null");
  }
  assertMatch(href, urlreg);
});

Deno.test("convertMarkdownToDom should set meta filePath attribute correctly", async () => {
  const filePath = "./test_markdown/three_links.md";

  // Call the function to convert markdown to DOM
  const dom = await convertMarkdownToDom(filePath);

  // Get the meta element
  const meta = dom.querySelector('meta[name="filePath"]');

  // Assert that the meta element exists
  if (!meta) {
    throw new Error("Meta element with name 'filePath' not found");
  }

  // Assert that the meta element's content attribute is set to the filePath
  assertEquals(meta.getAttribute("content"), filePath);
});

Deno.test("convertMarkdownToDomEffect success returns Effect.success", () => {
  const filePath = "./test_markdown/three_links.md";

  const foo = convertMarkdownToDomEffect(filePath);

  Effect.runPromise(Effect.match(foo, {
    onFailure: (error) => {
      assert(false, `Test error: ${error.message}`);
    },
    onSuccess: () => {
      assert(true);
    },
  })).then(() => assert(true));

});

Deno.test("convertMarkdownToDomEffect with bad filename returns Effect.failure", () => {
  const badFilePath = "./test_markdown/nonexistent_file";

  const foo = convertMarkdownToDomEffect(badFilePath);

  Effect.runPromise(Effect.match(foo, {
    onFailure: (error) => {
      assertIsError(error);
    },
    onSuccess: (value) => {
      throw Error(`Function returned ${value}`);
    },
  })).then(() => assert(true));
});
