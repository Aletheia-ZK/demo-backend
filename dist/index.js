"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const snarkjs_1 = require("snarkjs");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import { poseidon } from 'circomlibjs'; // v0.0.8
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const ReputationTree_verification_key_json_1 = __importDefault(require("./ReputationTree_verification_key.json"));
const IdentityTree_verification_key_json_1 = __importDefault(require("./IdentityTree_verification_key.json"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identityProof = req.body.identityProof;
    const identityPublicSignals = req.body.identityPublicSignals;
    const reputationProof = req.body.reputationProof;
    const reputationPublicSignals = req.body.reputationPublicSignals;
    const reputationId = req.body.reputationId;
    // console.log(req.body);
    // verify reputation proof
    const resultReputation = yield snarkjs_1.plonk.verify(ReputationTree_verification_key_json_1.default, reputationPublicSignals, reputationProof);
    // verify identity proof
    const resultIdentity = yield snarkjs_1.plonk.verify(IdentityTree_verification_key_json_1.default, identityPublicSignals, identityProof);
    console.log(identityPublicSignals);
    console.log(reputationPublicSignals);
    //
    const identityTreeData = yield (0, utils_1.getIdentityTreeData)();
    const reputationTreeData = yield (0, utils_1.getReputationTreeData)(reputationId);
    console.log('Identity Tree Data: ', identityTreeData);
    console.log('Reputation Tree Data: ', reputationTreeData);
    console.log('proof results:', resultIdentity, resultReputation);
    console.log(identityTreeData.identityRoot, identityPublicSignals[0]);
    console.log(reputationTreeData.attestationRoot, reputationPublicSignals[0]);
    if (resultIdentity === resultReputation && resultIdentity === true) {
        if (identityTreeData.identityRoot != identityPublicSignals[0] ||
            reputationTreeData.attestationRoot != reputationPublicSignals[0]) {
            res.status(401).json({ error: 'Invalid proof' });
            console.log('Invalid proof');
        }
        else {
            res.status(200).json({
                reputationId: reputationId,
                authToken: reputationPublicSignals[1],
            });
            console.log('Verification OK');
        }
    }
    else {
        res.status(401).json({ error: 'Invalid proof' });
    }
}));
app.get('/alive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('alive request');
    res.send('alive');
}));
console.log('Listening on port 5000');
app.listen(5000);
