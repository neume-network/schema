# Changelog

## 0.6.1

- Add IPFS message schema type

## 0.6.0

- In track schema, require at least one manifestation to be present where
  `mimetype` contains the keyword `audio` to ensure that any track always has
  an audio file included.

## 0.5.1

- The `crawlPath`'s `transformer` property now allows passing a list of
  arguments.

## 0.5.0

- (breaking): `config` schema now requires mandatory property
  `queue.options.concurrent` of type `integer`.

## 0.4.0

- (breaking): `erc721.owner` must be a Ethereum-compatible address
- Package exports `crawlPath` schema, thx @il3ven

## 0.3.1

- Adds `config` object that allows to define `endpoints` for timeout and
  rate-limiting control.

## 0.3.0

- (breaking) Require `track.erc721.createdAt` as e.g. the Ethereum block number
  a song was registered on-chain.

## 0.2.0

- Re-release under `@neume-network/schema`

## 0.1.0

- Add mandatory field: `track.erc721.tokenURI`

## 0.0.1

- Initial release
