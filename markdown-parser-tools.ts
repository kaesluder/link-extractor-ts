import * as npmMarked from "npm:marked";
import { DocumentFragment, JSDOM } from "npm:jsdom";
import { Effect } from "npm:effect";
import { UnknownException } from "npm:effect/Cause";

/**
 * Converts a markdown file to a DOM DocumentFragment.
 * 
 * This function reads a markdown file from the given file path, converts its content to HTML using the marked library, 
 * and then parses the HTML into a DOM DocumentFragment using JSDOM.
 * 
 * @param {string} filePath - The path to the markdown file to be converted.
 * @returns {Promise<DocumentFragment>} - A promise that resolves to a DocumentFragment representing the parsed HTML.
 * 
 * @throws {Error} - Throws an error if the file cannot be read or the markdown cannot be converted.
 */
export const convertMarkdownToDom = async (
    filePath: string,
): Promise<DocumentFragment> => {
    // Read the markdown file
    const markdownContent = await Deno.readTextFile(filePath);

    // Convert markdown to HTML
    const htmlContent = await npmMarked.marked(markdownContent);

    // Create a new JSDOM instance from the HTML string
    const dom = JSDOM.fragment(htmlContent);

    // Return the DOM document
    return dom;
};

/**
 * Converts a markdown file to a DOM DocumentFragment using Effect.
 * 
 * This function reads a markdown file from the given file path, converts its content to HTML using the marked library,
 * and then parses the HTML into a DOM DocumentFragment using JSDOM. It returns an Effect that can be either a result 
 * (DocumentFragment) or an UnknownError, enabling consistent error handling and the use of Effect parallelism functions.
 * 
 * @param {string} filePath - The path to the markdown file to be converted.
 * @returns {Effect.Effect<DocumentFragment, UnknownException>} - An Effect that resolves to a DocumentFragment 
 * representing the parsed HTML or an UnknownException if an error occurs.
 * 
 */
export const convertMarkdownToDomEffect = (
    filePath: string,
): Effect.Effect<DocumentFragment, UnknownException> => {
    return Effect.tryPromise(async () => {
        return await convertMarkdownToDom(filePath);
    });
};
