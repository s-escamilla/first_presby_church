/**
 * Markdown Filter
 * Converts markdown text to HTML
 * Usage: {{ content | markdown | safe }}
 */

const markdownIt = require("markdown-it");

module.exports = function (content) {
    const md = new markdownIt({
        html: true,
        breaks: true,
        linkify: true
    });
    
    // Use render for full markdown formatting (with block elements like <p>, <ul>, <h1>, etc.)
    return md.render(content || "");
};
