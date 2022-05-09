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
exports.getReputationTreeData = exports.getIdentityTreeData = exports.buildMerkleTree = void 0;
const incremental_merkle_tree_1 = require("@zk-kit/incremental-merkle-tree");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const circomlibjs_1 = require("circomlibjs"); // v0.0.8
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
const MERKLE_TREE_HEIGHT = parseInt(
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
process.env.MERKLE_TREE_HEIGHT);
function buildMerkleTree(leaves) {
    console.log(leaves);
    const tree = new incremental_merkle_tree_1.IncrementalMerkleTree(circomlibjs_1.poseidon, MERKLE_TREE_HEIGHT, 0, 2);
    for (const leaf of leaves) {
        tree.insert(leaf);
    }
    return tree;
}
exports.buildMerkleTree = buildMerkleTree;
function getIdentityTreeData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reponse = yield axios_1.default.get('http://localhost:4000/identitytree');
            // console.log('response: ', reponse);
            const identityLeaves = JSON.parse(reponse.data.identityLeaves);
            const identityRoot = reponse.data.identityRoot;
            return {
                identityLeaves,
                identityRoot,
            };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.getIdentityTreeData = getIdentityTreeData;
function getReputationTreeData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reponse = yield axios_1.default.get(`http://localhost:4000/attestation_${id}`);
            const attestationLeaves = JSON.parse(reponse.data[`attestation_${id}_leaves`]);
            const attestationRoot = reponse.data[`attestation_${id}_root`];
            console.log(attestationRoot);
            return {
                attestationLeaves,
                attestationRoot,
            };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.getReputationTreeData = getReputationTreeData;
