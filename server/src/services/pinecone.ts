import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
// import type { MovieMetadata } from '../../types';

dotenv.config();

const apiKey = process.env.PINECONE_API_KEY as string;
const index = process.env.PINECONE_INDEX as string;

if (!apiKey || !index) {
  throw new Error(
    'Missing PINECONE_API_KEY or PINECONE_INDEX_NAME in environment variables.'
  );
}

/*
 * Initialize Pinecone client.
 * The Pinecone client is used to interact with the Pinecone index.
 */
const pineconeClient = new Pinecone({ apiKey });
console.log(`Attempting to connect to index: "${index}"`);

const pineconeIndex = pineconeClient.index(index);

export default pineconeIndex;
