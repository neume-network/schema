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
  manifestation,
  manifestations,
  config,
  crawlPath,
  ipfs,
  arweave,
  transaction,
} from "../src/schema.mjs";

const ajv = new Ajv();
addFormats(ajv);

test("validating a manifestation", (t) => {
  const check = ajv.compile(manifestation);
  const version = "0.0.1";
  const example = {
    version,
    uri: "https://example.com/song",
    mimetype: "audio/mp3",
  };
  const valid = check(example);
  t.true(valid);
});

test.skip("validating a manifestation with a non-registered mimetype", (t) => {
  const check = ajv.compile(manifestation);
  const version = "0.0.1";
  const example = {
    version,
    uri: "https://example.com/song",
    mimetype: "audio/non-existent",
  };
  const valid = check(example);
  t.truthy(check.errors);
  t.false(valid);
});

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
  ajv.compile(manifestation);
  ajv.compile(manifestations);
  ajv.compile(config);
  ajv.compile(crawlPath);
  ajv.compile(transaction);
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
      address: "0x0000000000000000000000000000000000000000",
    },
    platform: {
      version,
      name: "Sound",
      uri: "https://sound.xyz",
    },
    erc721: {
      version,
      createdAt: 123,
      address: "0x0000000000000000000000000000000000000000",
      tokenId: "0",
      metadata: {
        name: "CULTURE",
        description: "song description",
        image: "https://example.com/image.jpg",
      },
    },
    manifestations: [],
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
      address: "0x0000000000000000000000000000000000000000",
    },
    platform: {
      version,
      name: "Sound",
      uri: "false formatting",
    },
    erc721: {
      version,
      createdAt: 123,
      address: "0x0000000000000000000000000000000000000000",
      tokenId: "0",
      metadata: {
        name: "CULTURE",
        description: "song description",
        image: "https://example.com/image.jpg",
      },
    },
    manifestations: [],
  };
  const valid = check(example);
  t.is(check.errors[0].params.format, "uri");
});

test("should fail when no manifestation with audio related mimetype is present", (t) => {
  const check = ajv.compile(track);
  const version = "0.0.1";
  const example = {
    version,
    title: "CULTURE",
    duration: "PT2M1S",
    artist: {
      version,
      name: "latasha",
      address: "0x0000000000000000000000000000000000000000",
    },
    platform: {
      version,
      name: "Sound",
      uri: "https://www.sound.xyz",
    },
    erc721: {
      version,
      createdAt: 123,
      address: "0x0000000000000000000000000000000000000000",
      transaction: {
        from: "0x0000000000000000000000000000000000000000",
        to: "0x0000000000000000000000000000000000000000",
        transactionHash:
          "0x28b5107ef960dc9c9199f4adf8ff4142b9d53f2cbcab9552b1e492593a3aeadb",
        blockNumber: 0,
      },
      tokenId: "0",
      tokenURI: "https://example.com/metadata.json",
      metadata: {
        name: "CULTURE",
        description: "song description",
        image: "https://example.com/image.jpg",
      },
    },
    manifestations: [
      {
        version,
        uri: "https://example.com/video",
        mimetype: "video/mp4",
      },
    ],
  };
  const valid = check(example);
  t.is(check.errors[0].keyword, "contains");
  t.false(valid);
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
      address: "0x0000000000000000000000000000000000001234",
    },
    platform: {
      version,
      name: "Sound",
      uri: "https://www.sound.xyz",
    },
    erc721: {
      version,
      createdAt: 123,
      address: "0x0000000000000000000000000000000000000000",
      transaction: {
        from: "0x0000000000000000000000000000000000000000",
        to: "0x0000000000000000000000000000000000000000",
        transactionHash:
          "0x28b5107ef960dc9c9199f4adf8ff4142b9d53f2cbcab9552b1e492593a3aeadb",
        blockNumber: 0,
      },
      tokenId: "0",
      tokenURI: "https://example.com/metadata.json",
      metadata: {
        name: "CULTURE",
        description: "song description",
        image: "https://example.com/image.jpg",
      },
    },
    manifestations: [
      {
        version,
        uri: "https://example.com/audio",
        mimetype: "audio/mp3",
      },
      {
        version,
        uri: "https://example.com/video",
        mimetype: "video/mp4",
      },
    ],
  };
  const valid = check(example);
  t.true(valid);
});

test("should be a valid config", (t) => {
  const check = ajv.compile(config);
  const example = {
    queue: {
      options: {
        concurrent: 10,
      },
    },
    endpoints: {
      "https://eth-mainnet.alchemyapi.io": {
        timeout: 3000,
        requestsPerUnit: 100,
        unit: "second",
      },
    },
  };

  const valid = check(example);
  t.true(valid);
});

test("should be an invalid config", (t) => {
  const check = ajv.compile(config);
  const example = {
    queue: {
      options: {
        // concurrent options is required but missing here
      },
    },
    endpoints: {
      "https://eth-mainnet.alchemyapi.io": {
        timeout: 3000,
        requestsPerUnit: 100,
        unit: "second",
      },
    },
  };

  const valid = check(example);
  t.false(valid);
});

test("should be a valid crawlPath", (t) => {
  const check = ajv.compile(crawlPath);
  const example = [
    [
      {
        name: "web3subgraph",
        extractor: {},
        transformer: {},
      },
    ],
    [
      {
        name: "soundxyz-call-tokenuri",
        extractor: {
          args: ["web3subgraph-transformation"],
        },
        transformer: {},
      },
      {
        name: "zora-call-tokenuri",
        extractor: {
          args: ["web3subgraph-transformation"],
        },
      },
      {
        name: "zora-call-tokenmetadatauri",
        transformer: {
          args: ["path/to/file", "arg1"],
        },
      },
    ],
  ];

  const valid = check(example);
  t.true(valid);
});

test.skip("if crawl path validator throws if transformer.args[0] isn't a string", (t) => {
  // NOTE: We implicitly encode the first argument as the path to a file that
  // the transformer processes so it has to be a string.
  const check = ajv.compile(crawlPath);
  const notAString = 1234;
  const example = [
    [
      {
        name: "web3subgraph",
        transformer: {
          args: [notAString, notAString],
        },
      },
    ],
  ];

  const valid = check(example);
  t.false(valid);
  t.true(check.errors[0].instancePath.includes("transformer/args/0"));
  t.is(check.errors[0].message, "must be string");
});

test("should be a valid ipfs message", async (t) => {
  const check = ajv.compile(ipfs);
  const message = {
    options: {
      uri: "ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
      gateway: `https://ipfs.io/ipfs/`,
      retry: {
        retries: 5,
      },
    },
    version: "1.0.0",
    type: "ipfs",
    commissioner: "test",
  };

  const valid = check(message);
  t.true(valid);
});

test("ipfs gateway is a https url", async (t) => {
  const check = ajv.compile(ipfs);
  const message = {
    options: {
      uri: "ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
      gateway: `bitcoin://abc`,
    },
    version: "1.0.0",
    type: "ipfs",
    commissioner: "test",
  };

  const valid = check(message);
  t.false(valid);
  t.true(check.errors[0].instancePath.includes("/options/gateway"));
});

test("ipfs message url should end with ipfs/", async (t) => {
  const check = ajv.compile(ipfs);
  const message = {
    options: {
      uri: "ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
      gateway: `https://ipfs.io/`,
    },
    version: "1.0.0",
    type: "ipfs",
    commissioner: "test",
  };

  const valid = check(message);
  t.false(valid);
  t.true(check.errors[0].instancePath.includes("/options/gateway"));
});

test("should be a valid arweave message", async (t) => {
  const check = ajv.compile(arweave);
  const message = {
    options: {
      uri: "ar://ltmVC0dpe7_KxFHj0-S7mdvXSfmcJOec4_OfjwSzLRk/1",
      gateway: "https://arweave.net/",
    },
    version: "1.0.0",
    type: "arweave",
    commissioner: "test",
  };

  const valid = check(message);
  t.true(valid);
});

test("arweave gateway should be a https url", async (t) => {
  const check = ajv.compile(arweave);
  const message = {
    options: {
      uri: "ar://ltmVC0dpe7_KxFHj0-S7mdvXSfmcJOec4_OfjwSzLRk/1",
      gateway: "arweave.net/",
    },
    version: "1.0.0",
    type: "arweave",
    commissioner: "test",
  };

  const invalid = check(message);
  t.falsy(invalid);
});
