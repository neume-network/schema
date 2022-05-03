//@format
import mimetypes from "./mimetypes.mjs";

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

export const ERC721 = {
  type: "object",
  properties: {
    version: { ...version },
    address: {
      type: "string",
      pattern: "0x[a-fA-F0-9]{40}",
    },
    tokenId: {
      type: "string",
    },
    metadata: {
      ...ERC721Metadata,
    },
  },
  required: ["version", "address", "tokenId", "metadata"],
};

export const artist = {
  type: "object",
  properties: {
    version: { ...version },
    name: {
      type: "string",
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
