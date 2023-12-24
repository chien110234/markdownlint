// @ts-check

"use strict";

const { addErrorContext } = require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

const whitespaceTypes = new Set([ "linePrefix", "whitespace" ]);
const ignoreWhitespace = (tokens) => tokens.filter(
  (token) => !whitespaceTypes.has(token.type)
);
const firstOrUndefined = (items) => items[0];
const lastOrUndefined = (items) => items[items.length - 1];

module.exports = {
  "names": [ "MD055", "table-missing-border" ],
  "description": "Table is missing leading or trailing pipe character",
  "tags": [ "table" ],
  "function": function MD055(params, onError) {
    const tables = filterByTypes(params.parsers.micromark.tokens, [ "table" ]);
    for (const table of tables) {
      const rows = filterByTypes(table.children, [ "tableDelimiterRow", "tableRow" ]);
      for (const row of rows) {
        const firstCell = firstOrUndefined(row.children);
        if (firstCell) {
          const leadingToken = firstOrUndefined(ignoreWhitespace(firstCell.children));
          if (leadingToken && (leadingToken.type !== "tableCellDivider")) {
            addErrorContext(onError, firstCell.startLine, row.text.trim(), true);
          }
        }
        const lastCell = lastOrUndefined(row.children);
        if (lastCell) {
          const trailingToken = lastOrUndefined(ignoreWhitespace(lastCell.children));
          if (trailingToken && (trailingToken.type !== "tableCellDivider")) {
            addErrorContext(onError, lastCell.startLine, row.text.trim(), false, true);
          }
        }
      }
    }
  }
}
