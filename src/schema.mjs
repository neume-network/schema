//@format
import mimetypes from "./mimetypes.mjs";

export const retry = {
  type: "object",
  properties: {
    retries: {
      type: "number",
    },
  },
  additionalProperties: false,
  required: ["retries"],
};

export const https = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["https"],
    },
    commissioner: {
      type: "string",
    },
    version: {
      type: "string",
    },
    options: {
      type: "object",
      properties: {
        timeout: {
          $comment: "temporal unit is milliseconds",
          type: "integer",
        },
        url: {
          type: "string",
          format: "uri",
          pattern: "^https?://",
        },
        method: { type: "string" },
        body: { type: "string" },
        headers: { type: "object" },
        retry,
      },
      required: ["url", "method"],
    },
    results: {
      type: "object",
    },
    error: {
      type: "string",
    },
  },
  required: ["type", "commissioner", "version", "options"],
};

export const graphql = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["graphql"],
    },
    commissioner: {
      type: "string",
    },
    version: {
      type: "string",
    },
    options: {
      type: "object",
      properties: {
        url: {
          type: "string",
          format: "uri",
          pattern: "^https://",
        },
        body: { type: "string" },
        headers: { type: "object" },
        retry,
      },
      required: ["url", "body"],
    },
    results: {
      type: "object",
    },
    error: {
      type: "string",
    },
  },
  required: ["type", "commissioner", "version", "options"],
};

export const jsonrpc = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["json-rpc"],
    },
    commissioner: {
      type: "string",
    },
    version: {
      type: "string",
    },
    options: {
      type: "object",
      properties: {
        timeout: {
          $comment: "temporal unit is milliseconds",
          type: "integer",
        },
        url: {
          type: "string",
          format: "uri",
          pattern: "^https://",
        },
        retry,
      },
      required: ["url"],
    },
    method: {
      type: "string",
    },
    params: {
      type: "array",
    },
    results: {
      type: "object",
    },
    error: {
      type: "string",
    },
  },
  required: ["type", "commissioner", "method", "params", "version", "options"],
};

export const ipfs = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["ipfs"],
    },
    commissioner: {
      type: "string",
    },
    version: {
      type: "string",
    },
    options: {
      type: "object",
      properties: {
        timeout: {
          $comment: "temporal unit is milliseconds",
          type: "integer",
        },
        uri: {
          type: "string",
          format: "uri",
        },
        gateway: {
          type: "string",
          format: "uri",
          pattern: "^https?://[^/]+/(ip[fn]s)/",
          $comment:
            "Must equate to a regular IPFS path gateway. We had initially considered supporting subdomain gateways too, but a lack of expressing their URIs generically lead us ignore their support.",
        },
        headers: { type: "object" },
        retry,
      },
      required: ["uri", "gateway"],
    },
    results: {
      type: "object",
    },
    error: {
      type: "string",
    },
  },
  required: ["type", "commissioner", "version", "options"],
};

export const arweave = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["arweave"],
    },
    commissioner: {
      type: "string",
    },
    version: {
      type: "string",
    },
    options: {
      type: "object",
      properties: {
        timeout: {
          $comment: "temporal unit is milliseconds",
          type: "integer",
        },
        uri: {
          type: "string",
          format: "uri",
          pattern: "ar://[a-zA-Z0-9-_]{43}.*",
        },
        gateway: {
          type: "string",
          format: "uri",
          pattern: "^https://",
        },
        headers: { type: "object" },
        retry,
      },
      required: ["uri", "gateway"],
    },
    results: {
      type: "object",
    },
    error: {
      type: "string",
    },
  },
  required: ["type", "commissioner", "version", "options"],
};

export const exit = {
  type: "object",
  required: ["type", "version"],
  properties: {
    type: {
      type: "string",
      enum: ["exit"],
    },
    version: {
      type: "string",
    },
  },
};

export const workerMessage = {
  oneOf: [https, graphql, jsonrpc, ipfs, arweave, exit],
};

export const config = {
  type: "object",
  required: ["queue"],
  properties: {
    queue: {
      type: "object",
      required: ["options"],
      properties: {
        options: {
          type: "object",
          required: ["concurrent"],
          properties: {
            concurrent: { type: "integer" },
          },
        },
      },
    },
    endpoints: {
      type: "object",
      propertyNames: {
        format: "uri",
      },
      patternProperties: {
        "^.*$": {
          type: "object",
          properties: {
            requestsPerUnit: {
              type: "number",
            },
            unit: {
              enum: ["second", "minute", "hour", "day"],
            },
            timeout: {
              type: "number",
            },
          },
          dependencies: {
            requestsPerUnit: ["unit"],
            unit: ["requestsPerUnit"],
          },
          additionalProperties: false,
        },
      },
    },
  },
};

export const version = {
  type: "string",
  // Source: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
  pattern:
    "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$",
};

// Source: https://eips.ethereum.org/EIPS/eip-721
export const ERC721Metadata = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    image: {
      type: "string",
      format: "uri",
    },
  },
  required: ["name", "description", "image"],
};

export const transaction = {
  type: "object",
  $comment: "History of EIP 721 transfer events",
  properties: {
    from: {
      type: "string",
      pattern: "0x[a-fA-F0-9]{40}",
    },
    to: {
      type: "string",
      pattern: "0x[a-fA-F0-9]{40}",
    },
    blockNumber: {
      type: "integer",
      minimum: 0,
    },
    transactionHash: {
      type: "string",
      pattern: "0x[a-fA-F0-9]{64}",
    },
  },
  required: ["from", "to", "blockNumber", "transactionHash"],
};

export const ERC721 = {
  type: "object",
  properties: {
    version: { ...version },
    createdAt: {
      $comment: "Referring to Ethereum block numbers",
      type: "integer",
      minimum: 0,
    },
    transaction: {
      ...transaction,
    },
    address: {
      type: "string",
      pattern: "0x[a-fA-F0-9]{40}",
    },
    tokenId: {
      type: "string",
    },
    tokenURI: {
      type: "string",
      format: "uri",
    },
    metadata: {
      ...ERC721Metadata,
    },
  },
  required: [
    "version",
    "createdAt",
    "address",
    "tokenId",
    "tokenURI",
    "metadata",
    "transaction",
  ],
};

export const artist = {
  type: "object",
  properties: {
    version: { ...version },
    name: {
      type: "string",
    },
    address: {
      type: "string",
      pattern: "0x[a-fA-F0-9]{40}",
    },
  },
  required: ["version", "name"],
};

export const platform = {
  type: "object",
  properties: {
    version: { ...version },
    name: {
      type: "string",
    },
    uri: {
      type: "string",
      format: "uri",
    },
  },
  required: ["version", "name", "uri"],
};

export const manifestation = {
  type: "object",
  properties: {
    version: { ...version },
    uri: {
      type: "string",
      format: "uri",
    },
    mimetype: {
      type: "string",
      pattern: mimetypes,
    },
  },
  required: ["version", "uri", "mimetype"],
};

export const manifestations = {
  type: "array",
  items: manifestation,
  contains: {
    type: "object",
    properties: {
      mimetype: {
        type: "string",
        pattern: "audio",
      },
    },
  },
};

export const track = {
  type: "object",
  properties: {
    version: { ...version },
    title: {
      type: "string",
    },
    duration: {
      // Source for ABNF: https://datatracker.ietf.org/doc/html/rfc3339#appendix-A
      type: "string",
      format: "duration",
    },
    artist: {
      ...artist,
    },
    platform: {
      ...platform,
    },
    erc721: {
      ...ERC721,
    },
    manifestations: {
      ...manifestations,
    },
  },
  required: [
    "manifestations",
    "version",
    "title",
    "artist",
    "platform",
    "erc721",
  ],
};

export const crawlPath = {
  type: "array",
  minItems: 1,
  items: {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: { type: "string" },
        extractor: {
          type: "object",
          additionalProperties: true,
        },
        transformer: {
          type: "object",
          additionalProperties: true,
        },
      },
      required: ["name"],
    },
  },
};

// Required to generate types
export const all = {
  oneOf: [
    { $ref: "#/definitions/https" },
    { $ref: "#/definitions/graphql" },
    { $ref: "#/definitions/jsonrpc" },
    { $ref: "#/definitions/ipfs" },
    { $ref: "#/definitions/arweave" },
    { $ref: "#/definitions/exit" },
    { $ref: "#/definitions/workerMessage" },
    { $ref: "#/definitions/config" },
    { $ref: "#/definitions/version" },
    { $ref: "#/definitions/ERC721Metadata" },
    { $ref: "#/definitions/ERC721" },
    { $ref: "#/definitions/artist" },
    { $ref: "#/definitions/platform" },
    { $ref: "#/definitions/manifestation" },
    { $ref: "#/definitions/track" },
    { $ref: "#/definitions/crawlPath" },
    { $ref: "#/definitions/transaction" },
  ],
  definitions: {
    https,
    graphql,
    jsonrpc,
    ipfs,
    arweave,
    exit,
    workerMessage,
    config,
    version,
    ERC721Metadata,
    ERC721,
    artist,
    platform,
    manifestation,
    track,
    crawlPath,
    transaction,
  },
};
