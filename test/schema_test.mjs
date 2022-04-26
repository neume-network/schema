//@format
import { readFileSync } from "fs";

import test from "ava";
import Ajv from "ajv";
import addFormats from "ajv-formats";

import {
  version,
  ERC721Metadata,
  ERC721,
  artist,
  platform,
  track,
} from "../src/schema.mjs";

const ajv = new Ajv();
addFormats(ajv);

test("generated json schema", (t) => {
  const schema = JSON.parse(readFileSync("schema.json").toString());
  t.truthy(schema);
});

test("compile schema", (t) => {
  ajv.compile(version);
  ajv.compile(ERC721Metadata);
  ajv.compile(ERC721);
  ajv.compile(artist);
  ajv.compile(platform);
  ajv.compile(track);
  t.pass();
});

test("platform schema", (t) => {
  const check = ajv.compile(platform);
  const version = "0.0.1";
  const example = {
    version,
    name: "Sound",
    uri: "https://example.com",
  };
  const valid = check(example);
  t.true(valid);
});

test("failing to define proper duration format", (t) => {
  const check = ajv.compile(track);
  const version = "0.0.1";
  const example = {
    version,
    title: "CULTURE",
    duration: "invalid duration",
    artist: {
      version,
      name: "latasha",
    },
    platform: {
      version,
      name: "Sound",
      uri: "https://sound.xyz",
    },
    erc721: {
      version,
      address: "0x0000000000000000000000000000000000000000",
      tokenId: "0",
      metadata: {
        name: "CULTURE",
        description: "song description",
        image: "https://example.com/image.jpg",
      },
    },
  };
  const valid = check(example);
  t.is(check.errors[0].params.format, "duration");
});

test("failing to define proper uri format", (t) => {
  const check = ajv.compile(track);
  const version = "0.0.1";
  const example = {
    version,
    title: "CULTURE",
    duration: "PT3M",
    artist: {
      version,
      name: "latasha",
    },
    platform: {
      version,
      name: "Sound",
      uri: "false formatting",
    },
    erc721: {
      version,
      address: "0x0000000000000000000000000000000000000000",
      tokenId: "0",
      metadata: {
        name: "CULTURE",
        description: "song description",
        image: "https://example.com/image.jpg",
      },
    },
  };
  const valid = check(example);
  t.is(check.errors[0].params.format, "uri");
});

test("validate value", (t) => {
  const check = ajv.compile(track);
  const version = "0.0.1";
  const example = {
    version,
    title: "CULTURE",
    duration: "PT2M1S",
    artist: {
      version,
      name: "latasha",
    },
    platform: {
      version,
      name: "Sound",
      uri: "https://www.sound.xyz",
    },
    erc721: {
      version,
      address: "0x0000000000000000000000000000000000000000",
      tokenId: "0",
      metadata: {
        name: "CULTURE",
        description: "song description",
        image: "https://example.com/image.jpg",
      },
    },
  };
  const valid = check(example);
  t.true(valid);
});
