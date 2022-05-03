// @format
//
// Purpose of this script:
//
// Artists are virtually free for producing any possible type of artistic
// manifestation of their work and often their output is hence not limited to
// e.g. only the standard types such as audio/mp3 etc.
//
// For that reason, we believe that any sharable file on the web that has been
// registered with the IANA shall be a submittable manifestation.
//
// To generate a pattern regular expression matching all mimetypes, we're
// downloading them from "mime-db", filtering out for all common media blob
// types and then concatting them to a giant Regex usable by the schema file.
import assert from "assert";

import db from "mime-db";

// Overview: https://www.iana.org/assignments/media-types/media-types.xhtml
const types = ["audio", "font", "image", "text", "video"];

const mimetypes = Object.keys(db).filter((elem) =>
  types.includes(elem.split("/")[0])
);
let expr = mimetypes.join("|");
expr = expr.replace(/\//g, "\\/");

const pExpr = new RegExp(expr);
assert(pExpr.test("audio/mp3"));
assert(!pExpr.test("audio/non-existent"));
console.log(expr);
