import { xdr, TransactionBuilder, Networks, BASE_FEE, SorobanRpc } from '@stellar/stellar-sdk'

export const publishTx = async (publicKey, contract_call) => {

    return new Promise(async (resolve, reject) => {
        const server = new SorobanRpc.Server(
            `${process.env.NEXT_PUBLIC_RPC_ENDPOINT}`,

        )
        try {
            const server = new SorobanRpc.Server(
                `${process.env.NEXT_PUBLIC_RPC_ENDPOINT}`,
            )

            const sourceAccount = await server.getAccount(publicKey)

            let builtTransaction = new TransactionBuilder(sourceAccount, {
                fee: BASE_FEE,
                networkPassphrase: process.env.NEXT_PUBLIC_NETWORK,
            })
                .addOperation(contract_call)
                // This transaction will be valid for the next 30 seconds
                .setTimeout(100)
                .build();

                console.log(builtTransaction)
            let preparedTransaction = await server.prepareTransaction(builtTransaction);
            console.log(preparedTransaction)

            const unsignedXdr = preparedTransaction.toXDR()
            const simpleSignerUrl = process.env.NEXT_PUBLIC_SIGNER_URL;

            async function openSignWindow(xdr) {
                const signWindow = window.open(
                    `${simpleSignerUrl}/sign/?xdr=${unsignedXdr}`,
                    'Sign_Window',
                    'width=360, height=700',
                );

                window.addEventListener('message', (e) => {
                    if (e.origin !== simpleSignerUrl) {
                        return;
                    } else if (signWindow && e.data.type === 'onReady') {
                        signWindow.postMessage(
                            { xdr },
                            simpleSignerUrl,
                        );
                    }
                });

                return signWindow;
            }

            openSignWindow(unsignedXdr)

            async function handleMessage(e) {

                if (
                    e.origin === simpleSignerUrl &&
                    e.data.type === 'onSign' &&
                    e.data.page === 'sign'
                ) {
                    const eventMessage = e.data;

                    const signedXdr = eventMessage.message.signedXDR;
                    console.log("signed xdr", signedXdr)
                    // Validate the XDR, this is just good practice.
                    if (
                        xdr.TransactionEnvelope.validateXDR(
                            signedXdr,
                            'base64',
                        )
                    ) {
                        console.log("sending tx")
                        let signed_tx = xdr.TransactionEnvelope.fromXDR(signedXdr, "base64");
                        let newsig = Buffer.from(signed_tx._value._attributes.signatures[0]._attributes.signature).toString("base64");
                        preparedTransaction.addSignature(publicKey, newsig);

                        let sendResponse = await server.sendTransaction(preparedTransaction);
                        console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);

                        if (sendResponse.status === "PENDING") {
                            let getResponse = await server.getTransaction(sendResponse.hash);
                            while (getResponse.status === "NOT_FOUND") {
                                console.log("Waiting for transaction confirmation...");
                                getResponse = await server.getTransaction(sendResponse.hash);
                                await new Promise((resolve) => setTimeout(resolve, 1000));
                            }

                            console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);

                            if (getResponse.status === "SUCCESS") {
                                if (!getResponse.resultMetaXdr) {
                                    throw "Empty resultMetaXDR in getTransaction response";
                                }
                                let transactionMeta = getResponse.resultMetaXdr;
                                let returnValue = getResponse.returnValue;
                                console.log(`Transaction result: ${returnValue.value()}`);
                                resolve("Transaction successful");
                            } else {
                                reject(`Transaction failed: ${getResponse.resultXdr}`)
                            }
                        } else {
                            reject(sendResponse.errorResultXdr)
                        }
                    } else {
                        console.log("XDR not valid, try again")
                        reject ("XDR not valid, try again")
                    }
                }
            }
            window.addEventListener('message', handleMessage);
        } catch (err) {
            console.log("Sending transaction failed");
            console.log(JSON.stringify(err));
            reject(err)
        }
    })
}


