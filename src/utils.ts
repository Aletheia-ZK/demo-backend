import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { poseidon } from 'circomlibjs'; // v0.0.8
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const ATTESTATION_MERKLE_TREE_HEIGHT = parseInt(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.ATTESTATION_MERKLE_TREE_HEIGHT!
);

export function buildMerkleTree(leaves: string[]) {
  console.log(leaves);
  const tree = new IncrementalMerkleTree(
    poseidon,
    ATTESTATION_MERKLE_TREE_HEIGHT,
    0,
    2
  );

  for (const leaf of leaves) {
    tree.insert(leaf);
  }

  return tree;
}

export async function getIdentityTreeData() {
  try {
    const reponse = await axios.get('http://localhost:4000/identitytree');
    console.log('response: ', reponse);

    const identityLeaves = JSON.parse(reponse.data.identityLeaves);
    const identityRoot = reponse.data.identityRoot;

    return {
      identityLeaves,
      identityRoot,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getReputationTreeData() {
  try {
    const reponse = await axios.get('http://localhost:4000/attestation_1');
    console.log('response: ', reponse);
    const attestation1Leaves = JSON.parse(reponse.data.attestation1Leaves);
    const attestation1Root = reponse.data['attestation_1_root'];

    return {
      attestation1Leaves,
      attestation1Root,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}