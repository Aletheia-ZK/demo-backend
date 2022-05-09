import { IncrementalMerkleTree } from '@zk-kit/incremental-merkle-tree';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { poseidon } from 'circomlibjs'; // v0.0.8
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const MERKLE_TREE_HEIGHT = parseInt(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  process.env.MERKLE_TREE_HEIGHT!
);

export function buildMerkleTree(leaves: string[]) {
  console.log(leaves);
  const tree = new IncrementalMerkleTree(poseidon, MERKLE_TREE_HEIGHT, 0, 2);

  for (const leaf of leaves) {
    tree.insert(leaf);
  }

  return tree;
}

export async function getIdentityTreeData() {
  try {
    const reponse = await axios.get('http://localhost:4000/identitytree');
    // console.log('response: ', reponse);

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

export async function getReputationTreeData(id: number) {
  try {
    const reponse = await axios.get(`http://localhost:4000/attestation_${id}`);
    const attestationLeaves = JSON.parse(
      reponse.data[`attestation_${id}_leaves`]
    );
    const attestationRoot = reponse.data[`attestation_${id}_root`];
    console.log(attestationRoot);

    return {
      attestationLeaves,
      attestationRoot,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
