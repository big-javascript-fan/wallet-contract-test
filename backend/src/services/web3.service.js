import fs from 'fs';
import Web3 from 'web3';
import moment from 'moment';
import { delegateAddress, delegatePrivKey, infuraKey } from '../settings';
import { ABI, ADDRESS, TOKEN_ADDRESS, WALLET_ABI, WALLET_ADDRESS } from '../constants/abi';

export const web3Service = () => {
    const withdrawToken = async (amount) => {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${infuraKey}`));
            web3.eth.accounts.wallet.add({
                privateKey: delegatePrivKey,
                address: delegateAddress
            });
            const contract = new web3.eth.Contract(WALLET_ABI, WALLET_ADDRESS);

            const estimatedGas = await contract.methods.sendFunds(
                TOKEN_ADDRESS,
                amount
            ).estimateGas({
                from: delegateAddress
            });
            console.log('this.estmiated gas', estimatedGas);
            const transaction = await contract.methods.sendFunds(TOKEN_ADDRESS, amount).send({
                from: delegateAddress,
                gasPrice: this.web3Service.utils.toHex(5000000000),
                gasLimit: estimatedGas
            });
            return transaction.transactionHash;
        } catch (e) {
            console.log('error on transfer 20 token to wallet - ', e);
            throw e;
        }
    }

    const syncBidEvents = async () => {
        const options = {
            // Enable auto reconnection
            reconnect: {
                auto: true,
                delay: 15000, // ms
                maxAttempts: 5,
                onTimeout: false
            },
            clientConfig: {
                maxReceivedFrameSize: 2000000, // bytes - default: 1MiB, current: 2MiB
                maxReceivedMessageSize: 10000000, // bytes - default: 8MiB, current: 10Mib
            }
        };
        const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://rinkeby.infura.io/ws/v3/${infuraKey}`, options));
        const contract = new web3.eth.Contract(WALLET_ABI, WALLET_ADDRESS);

        console.log('event sync started');
        contract.events
            .allEvents()
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            .on('data', async event => {
                console.log('detected event - ', event);
                const transactionReceiptPromise = web3.eth.getTransactionReceipt(
                    event.transactionHash
                );

                const [ transactionReceipt ] = await Promise.all([ transactionReceiptPromise ]);

                const logs = transactionReceipt.logs;
                const depositEvents = logs.map(log => {
                    if (log.topics[0] === '0xe684a55f31b79eca403df938249029212a5925ec6be8012e099b45bc1019e5d2') {
                        return {
                            user: log.topics[1],
                            amount: log.topics[2]
                        }
                    }
                });
                console.log('ETH deposit events', depositEvents)
            });
        
        const tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
        tokenContract.events
            .allEvents()
            .on('data', async event => {
                console.log('detected event - ', event);
                const transactionReceiptPromise = web3.eth.getTransactionReceipt(
                    event.transactionHash
                );

                const [ transactionReceipt ] = await Promise.all([ transactionReceiptPromise ]);

                const logs = transactionReceipt.logs;
                const depositEvents = logs.map(log => {
                    if (log.topics[0] === '0xe684a55f31b79eca403df938249029212a5925ec6be8012e099b45bc1019e5d2') {
                        return {
                            user: log.topics[1],
                            amount: log.topics[2]
                        }
                    }
                });
                depositEvents.map(async event => {
                    await withdrawToken(event.amount)
                });
            });
    }

    return { withdrawToken, syncBidEvents };
};
