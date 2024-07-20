import {ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS} from '@solana/actions'
import { PublicKey, SystemProgram, Transaction, Connection, clusterApiUrl } from '@solana/web3.js';
export async function GET(request: Request){
    try{
        const payload: ActionGetResponse = {
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLT7i1KaPG3JWvgdPnWK9h3h3IxUxumVQsEA&s",
            description: "''Palimos'' is a Filipino term that refers to begging or the act of asking for alms or charity, typically on the streets or in public places. It often involves individuals or groups asking passersby for money or food to meet their immediate needs. Palimos is a common sight in many urban areas in the Philippines, where poverty and economic hardships may drive people to seek assistance from others.",
            title: "Online Limos for Solana Breakpoint 2024",
            label:'Donate'
        }
        return Response.json(payload, {headers: ACTIONS_CORS_HEADERS,});
    }catch(err) {
        console.log(err);
        let message = "An unknown error occurred";
        if (typeof err == "string") message = err;
        return new Response(message, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
};

export async function POST(request: Request){
    try{

        const connection = new Connection(clusterApiUrl('mainnet-beta'));
        const requestBody: ActionPostRequest = await request.json()
        const userPubkey = requestBody.account;
        console.log(userPubkey)

        const tx = new Transaction();
        const bh =(await connection.getLatestBlockhash({commitment: "finalized"})).blockhash;
        console.log("using blockhash "+bh)
        tx.feePayer = new PublicKey(userPubkey);
        tx.recentBlockhash = bh;
        const serialTX = tx.serialize({requireAllSignatures: false, verifySignatures: false}).toString("base64");

        const response: ActionPostResponse = {
            transaction: serialTX,
            message:"hello "+userPubkey,
        }

        


        return Response.json(response, {headers: ACTIONS_CORS_HEADERS,});
    }catch (err) {
        console.log(err);
        let message = "An unknown error occurred";
        if (typeof err == "string") message = err;
        return new Response(message, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS,
        });
    }
};


export async function OPTION(request: Request){
    return Response.json(null, {headers: ACTIONS_CORS_HEADERS,});
}