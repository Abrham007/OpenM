import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface NFT {
  'getAsset' : ActorMethod<[], Uint8Array | number[]>,
  'getName' : ActorMethod<[], string>,
  'getOwner' : ActorMethod<[], Principal>,
}
export interface _SERVICE extends NFT {}
