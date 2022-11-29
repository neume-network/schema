// @format
import { compile } from "json-schema-to-typescript";
import { all } from "../src/schema.mjs";
compile(all).then(console.log);
