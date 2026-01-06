/**
 * Markdown Filter
 * Converts markdown text to HTML with path prefix support for images
 * Usage: {{ content | markdown | safe }}
 */

const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
    return function (content) {
        const md = new markdownIt({
            html: true,
            breaks: true,
            linkify: true
        });
        
        // Use render for full markdown formatting (with block elements like <p>, <ul>, <h1>, etc.)
        let html = md.render(content || "");
        
        // Apply path prefix to image URLs that start with /
        // This ensures images work correctly on GitHub Pages with path prefix
        const pathPrefix = eleventyConfig.pathPrefix || "";
        if (pathPrefix) {
            // Remove trailing slash from pathPrefix to avoid double slashes
            const prefix = pathPrefix.replace(/\/$/, "");
            html = html.replace(/(<img[^>]+src=["'])\/([^"']+)(["'])/g, `$1${prefix}/$2$3`);
        }
        
        return html;
    };
};
