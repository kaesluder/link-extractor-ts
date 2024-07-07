import { assertEquals, assertMatch } from "jsr:@std/assert";
import { add } from "./main.ts";
import { convertMarkdownToDom } from "./markdown-parser-tools.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});

Deno.test(async function canParse() {
  const filename = './test_markdown/three_links.md';

  const urlreg = new RegExp('example.com');

  const dom = await convertMarkdownToDom(filename);

  const links = dom.querySelectorAll('A');

  assertEquals(links[0].text, 'three links: a')

  assertMatch(links[0].href, urlreg);

});