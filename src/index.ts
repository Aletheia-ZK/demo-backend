import express, { Express, Request, Response } from 'express';
import cors from 'cors';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { plonk } from 'snarkjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import { poseidon } from 'circomlibjs'; // v0.0.8
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import reputationVkey from './ReputationTree_verification_key.json';
import identityVkey from './IdentityTree_verification_key.json';
import { getIdentityTreeData, getReputationTreeData } from './utils';

const app: Express = express();
app.use(cors());
app.use(express.json());

// function getContract() {
//   const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
//   const contract = new ethers.Contract(
//     ALETHEIA_CONTRACT_ADDRESS,
//     aletheiaArtifact['abi'],
//     provider
//   );
//   return contract;
// }

app.post('/login', async (req: Request, res: Response) => {
  const identityProof = req.body.identityProof;
  const identityPublicSignals = req.body.identityPublicSignals;
  const reputationProof = req.body.reputationProof;
  const reputationPublicSignals = req.body.reputationPublicSignals;

  // console.log(req.body);

  // verify reputation proof
  const resultReputation = await plonk.verify(
    reputationVkey,
    reputationPublicSignals,
    reputationProof
  );

  // verify identity proof
  const resultIdentity = await plonk.verify(
    identityVkey,
    identityPublicSignals,
    identityProof
  );

  console.log(identityPublicSignals);
  console.log(reputationPublicSignals);

  //
  const identityTreeData = await getIdentityTreeData();
  const reputationTreeData = await getReputationTreeData();

  console.log('Identity Tree Data: ', identityTreeData);
  console.log('Reputation Tree Data: ', reputationTreeData);

  console.log('proof results:', resultIdentity, resultReputation);
  console.log(identityTreeData.identityRoot, identityPublicSignals[0]);
  console.log(reputationTreeData.attestation1Root, reputationPublicSignals[0]);

  console.log(identityProof);

  if (resultIdentity === resultReputation && resultIdentity === true) {
    if (
      identityTreeData.identityRoot != identityPublicSignals[0] ||
      reputationTreeData.attestation1Root != reputationPublicSignals[0]
    ) {
      res.send(401);
      console.log('Invalid proof');
    } else {
      res.send(200);
      console.log('Verification OK');
    }
  } else {
    console.log('Invalid proof');
    res.send(401);
    // res.send(200);
  }
});

console.log('Listening on port 5000');
app.listen(5000);
