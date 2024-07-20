import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS } from '@solana/actions';
import { PublicKey, SystemProgram, Transaction, Connection, clusterApiUrl } from '@solana/web3.js';

export async function GET(request: Request) {
    try {
        const payload: ActionGetResponse = {
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLT7i1KaPG3JWvgdPnWK9h3h3IxUxumVQsEA&s",
            description: "''Palimos'' is a Filipino term that refers to begging or the act of asking for alms or charity, typically on the streets or in public places. It often involves individuals or groups asking passersby for money or food to meet their immediate needs. Palimos is a common sight in many urban areas in the Philippines, where poverty and economic hardships may drive people to seek assistance from others.",
            title: "Online Limos for Solana Breakpoint 2024",
            label: 'Donate'
        };
        return new Response(JSON.stringify(payload), { headers: ACTIONS_CORS_HEADERS });
    } catch (err) {
        console.error(err);
        const message = typeof err === "string" ? err : "An unknown error occurred";
        return new Response(message, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
};

export async function POST(request: Request) {
    try {
        const connection = new Connection(clusterApiUrl('devnet'));
        const requestBody: ActionPostRequest = await request.json();
        const userPubkey = new PublicKey(requestBody.account);
        console.log(userPubkey.toString());

        const tx = new Transaction();
        const ix = SystemProgram.transfer({
            fromPubkey: userPubkey,
            toPubkey: new PublicKey("41ywsxNiW27shHcaHJ5fLc2KbMaoqMoSWkDNnzS9Fgzm"),
            lamports: 1000000
        });
        tx.add(ix);

        const { blockhash } = await connection.getLatestBlockhash({ commitment: "finalized" });
        console.log("using blockhash " + blockhash);

        tx.feePayer = userPubkey;
        tx.recentBlockhash = blockhash;

        const serialTX = tx.serialize({ requireAllSignatures: false, verifySignatures: false }).toString("base64");

        const response: ActionPostResponse = {
            transaction: serialTX,
            message: `hello ${userPubkey.toString()}. This will help Me-Aw so much. Thank you very much.🤙🏿🤙🏿🤙🏿`,
        };

        return new Response(JSON.stringify(response), { headers: ACTIONS_CORS_HEADERS });
    } catch (err) {
        console.error(err);
        const message = typeof err === "string" ? err : "An unknown error occurred";
        return new Response(message, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
};

// export async function OPTION(request: Request){
//     return new Response(null, {headers: ACTIONS_CORS_HEADERS,});
// }
