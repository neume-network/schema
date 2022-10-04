//@format
import mimetypes from "./mimetypes.mjs";

export const https = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["https"]
    },
    commissioner: {
      type: "string"
    },
    version: {
      type: "string"
    },
    options: {
      type: "object",
      properties: {
        timeout: {
          $comment: "temporal unit is milliseconds",
          type: "integer"
        },
        url: { type: "string" },
        method: { type: "string" },
        body: { type: "string" },
        headers: { type: "object" }
      },
      required: ["url", "method"]
    },
    results: {
      type: "object",
      nullable: true
    },
    error: {
      type: "string",
      nullable: true
    }
  },
  required: ["type", "commissioner", "version", "error", "results", "options"]
};

export const graphql = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["graphql"]
    },
    commissioner: {
      type: "string"
    },
    version: {
      type: "string"
    },
    options: {
      type: "object",
      properties: {
        url: { type: "string" },
        body: { type: "string" },
        headers: { type: "object" }
      },
      required: ["url", "body"]
    },
    results: {
      type: "object",
      nullable: true
    },
    error: {
      type: "string",
      nullable: true
    }
  },
  required: ["type", "commissioner", "version", "options", "results", "error"]
};

export const jsonrpc = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["json-rpc"]
    },
    commissioner: {
      type: "string"
    },
    version: {
      type: "string"
    },
    options: {
      type: "object",
      properties: {
        timeout: {
          $comment: "temporal unit is milliseconds",
          type: "integer"
        },
        url: { type: "string" }
      },
      required: ["url"]
    },
    method: {
      type: "string"
    },
    params: {
      type: "array"
    },
    results: {
      type: "object",
      nullable: true
    },
    error: {
      type: "string",
      nullable: true
    }
  },
  // TODO: Require `error`
  required: [
    "type",
    "commissioner",
    "method",
    "params",
    "results",
    "version",
    "options"
  ]
};

export const ipfs = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["ipfs"]
    },
    commissioner: {
      type: "string"
    },
    version: {
      type: "string"
    },
    options: {
      type: "object",
      properties: {
        timeout: {
          $comment: "temporal unit is milliseconds",
          type: "integer"
        },
        uri: { type: "string" },
        gateway: {
          type: "string",
          pattern: "^https?:\/\/[^/]+\/(ip[fn]s)\/",
          $comment:
            "Must equate to a regular IPFS path gateway. We had initially considered supporting subdomain gateways too, but a lack of expressing their URIs generically lead us ignore their support."
        }
      },
      required: ["uri", "gateway"]
    },
    results: {
      type: "object",
      nullable: true
    },
    error: {
      type: "string",
      nullable: true
    }
  },
  required: ["type", "commissioner", "version", "error", "results", "options"]
};

export const exit = {
  type: "object",
  required: ["type", "version"],
  properties: {
    type: {
      type: "string",
      enum: ["exit"]
    },
    version: {
      type: "string"
    }
  }
};

export const workerMessage = {
  oneOf: [https, graphql, jsonrpc, ipfs, exit]
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
            concurrent: { type: "integer" }
          }
        }
      }
    },
    endpoints: {
      type: "object",
      propertyNames: {
        format: "uri"
      },
      patternProperties: {
        "^.*$": {
          type: "object",
          properties: {
            requestsPerUnit: {
              type: "number"
            },
            unit: {
              enum: ["second", "minute", "hour", "day"]
            },
            timeout: {
              type: "number"
            }
          },
          dependencies: {
            requestsPerUnit: ["unit"],
            unit: ["requestsPerUnit"]
          },
          additionalProperties: false
        }
      }
    }
  }
};

export const version = {
  type: "string",
  // Source: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
  pattern:
    "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$"
};

// Source: https://eips.ethereum.org/EIPS/eip-721
export const ERC721Metadata = {
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    description: {
      type: "string"
    },
    image: {
      type: "string",
      format: "uri"
    }
  },
  required: ["name", "description", "image"]
};

export const ERC721 = {
  type: "object",
  properties: {
    version: { ...version },
    createdAt: {
      oneOf: [
        {
          $comment: "Referring to Ethereum block numbers",
          type: "integer",
          minimum: 0
        }
      ]
    },
    owner: {
      type: "string",
      pattern: "0x[a-fA-F0-9]{40}",
      $comment: "EIP-173 or EIP-5313 owner of the collection's contract."
    },
    address: {
      type: "string",
      pattern: "0x[a-fA-F0-9]{40}"
    },
    tokenId: {
      type: "string"
    },
    tokenURI: {
      type: "string",
      format: "uri"
    },
    metadata: {
      ...ERC721Metadata
    }
  },
  required: [
    "version",
    "createdAt",
    "address",
    "tokenId",
    "tokenURI",
    "metadata",
    "owner"
  ]
};

export const artist = {
  type: "object",
  properties: {
    version: { ...version },
    name: {
      type: "string"
    }
  },
  required: ["version", "name"]
};

export const platform = {
  type: "object",
  properties: {
    version: { ...version },
    name: {
      type: "string"
    },
    uri: {
      type: "string",
      format: "uri"
    }
  },
  required: ["version", "name", "uri"]
};

export const manifestation = {
  type: "object",
  properties: {
    version: { ...version },
    uri: {
      type: "string",
      format: "uri"
    },
    mimetype: {
      type: "string",
      pattern: mimetypes
    }
  },
  required: ["version", "uri", "mimetype"]
};

export const manifestations = {
  type: "array",
  items: manifestation,
  contains: {
    type: "object",
    properties: {
      mimetype: {
        pattern: "audio"
      }
    }
  }
};

export const track = {
  type: "object",
  properties: {
    version: { ...version },
    title: {
      type: "string"
    },
    duration: {
      // Source for ABNF: https://datatracker.ietf.org/doc/html/rfc3339#appendix-A
      type: "string",
      format: "duration"
    },
    artist: {
      ...artist
    },
    platform: {
      ...platform
    },
    erc721: {
      ...ERC721
    },
    manifestations: {
      ...manifestations
    }
  },
  required: [
    "manifestations",
    "version",
    "title",
    "artist",
    "platform",
    "erc721"
  ]
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
          properties: {
            args: { type: "array" }
          }
        },
        transformer: {
          type: "object",
          properties: {
            args: {
              type: "array",
              minItems: 1,
              items: [{ type: "string" }],
              additionalItems: true
            }
          }
        }
      },
      required: ["name"]
    }
  }
};
