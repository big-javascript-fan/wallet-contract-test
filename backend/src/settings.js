import dotenv from 'dotenv';

dotenv.config();

export const delegateAddress = process.env.DELEGATE_ADDRESS;
export const delegatePrivKey = process.env.DELEGATE_PRIV_KEY;

export const infuraKey = process.env.INFURA_KEY;