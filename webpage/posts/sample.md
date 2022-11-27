---
title: 'Next.js page options and how they work'
metaTitle: 'Next.js page options and how they work'
metaDesc: 'How to use pages in Next.js exploring the options'
image: /images/22-09-2021.jpg
date: '2021-09-22'
tags:
  - nextjs
socialImage: 'mug.jpeg'
---

# The main content

# 솔라나 raw transaction - hsm 매핑

## 장광수 책임님과 대화를 통해 내린 결론

- 서명을 위한 API 연동이 잘 되기 위해서는 Input, Output 에 대한 구조체에 대한 합의가 필요하다.
- 우리는 JSON 안에 서명을 하기 위한 data 와 서명값인 signature 를 모두 Hexa 구조를 사용하기로 했다.
  - `transactionBuffer.toString('hex')`: Buffer -> hex String
  - `"01000103ccbd07795e4409fceedad5c95f51e5a822f28e4950c76048e6f9aa8878c8c98f62d8e462f994a1be0f6b1086517eed2c5c12f279303e37539757363c8d175df9000000000000000000000000000000000000000000000000000000000000000009ac8b253acceb5bcd60f2b084dc8fa56fd582d52e21d469de13e2ac86d1a93801020200010c02000000e803000000000000"`
  - `Buffer.from(signature).toString('hex')`: Uint8Array(64) -> hex String(128)
  - `"3a5002bf8798a1c9981116a48f80da10d4cf2bbab9855a09708849d06791e508436f09af09ea44b11bc9ba7c672689a343b87f3e92962101db19492452cfa508"`


## 인터페이스 분석
### 1. Public key generation
request
```
{}
```
response
```
{
  "keyLabel": "myKeyLabel1",
  "publicKey": "EnDME6ta7FpM2P4J8o2E861GQYPCFFc2swQjyh4eRjti"
}
```

### 2. Sign raw transaction
request
```
{
  "keyLabel1": "myKeyLabel1",
  "data": "01000103ccbd07795e4409fceedad5c95f51e5a822f28e4950c76048e6f9aa8878c8c98f62d8e462f994a1be0f6b1086517eed2c5c12f279303e37539757363c8d175df9000000000000000000000000000000000000000000000000000000000000000009ac8b253acceb5bcd60f2b084dc8fa56fd582d52e21d469de13e2ac86d1a93801020200010c02000000e803000000000000"
}
```
response
```
{
  "signature": "3a5002bf8798a1c9981116a48f80da10d4cf2bbab9855a09708849d06791e508436f09af09ea44b11bc9ba7c672689a343b87f3e92962101db19492452cfa508"
}
```

## Issue 1

- 트랜잭션을 생성할 때 recentBlockHash 값을 블록체인 네트워크에서 읽어야 한다.
- recentBlockHash 의 기능은 중복되는 트랜잭션에 대한 방지와 최신 트랜잭션만 수용하도록 하는 것이다.
- 대략 2분 내에 생성된 recentBlockHash 값을 트랜잭션에 포함시켜야하는데 만약 HSM 으로부터 서명을 받아오는 시간이 2분이 넘으면 조치가 필요하다.
- 공식 문서에는 이런 경우(ex. 오프라인 네트워크 참여자)를 위한 보안 기능 Durable Transaction Nonce 를 제공한다.
- https://docs.solana.com/implemented-proposals/durable-tx-nonces

## 처리 시간
1. `new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');`: 0.947ms
2. `await connection.requestAirdrop();`: 1.187s
3. `await connection.confirmTransaction(airdropSignature);`: 1.271s
4. `await connection.getRecentBlockhash();`: 264.977ms
5. `await web3.sendAndConfirmRawTransaction(connection, rawTransaction);`: 2.017s

## 소스코드

```js
const web3 = require('@solana/web3.js');
const nacl = require('tweetnacl');

const areEqual = (first, second) =>
    first.length === second.length && first.every((value, index) => value === second[index]);

const main = async () => {

    // Airdrop SOL for paying transactions
    let payer = web3.Keypair.generate();
    console.log("payer.publicKey", payer.publicKey.toString());
    console.log("payer.secretKey", Buffer.from(payer.secretKey).toString('hex'));

    console.time("connection");
    let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    console.timeEnd("connection");

    console.time("airdrop request");
    let airdropSignature = await connection.requestAirdrop(
        payer.publicKey,
        web3.LAMPORTS_PER_SOL,
    );
    console.timeEnd("airdrop request");

    console.time("airdrop confirm");
    await connection.confirmTransaction(airdropSignature);
    console.timeEnd("airdrop confirm");

    let toAccount = web3.Keypair.generate();

    // manually construct the transaction
    console.time("recentBlockhash");
    let recentBlockhash = await connection.getRecentBlockhash();
    console.timeEnd("recentBlockhash");
    console.log("recentBlockhash", recentBlockhash);

    console.time("OTHERS");
    let manualTransaction = new web3.Transaction({
        recentBlockhash: recentBlockhash.blockhash,
        feePayer: payer.publicKey
    });
    manualTransaction.add(web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: 1000,
    }));

    let transactionBuffer = manualTransaction.serializeMessage();
    console.log("transactionBuffer", transactionBuffer);
    // let transactionBufferHexString = transactionBuffer.toString('hex');
    // console.log(transactionBufferHexString);
    // let transactionBufferRecovered = Buffer.from(transactionBufferHexString, 'hex');
    // console.log("Buffer compare", Buffer.compare(transactionBufferRecovered, transactionBuffer));
    let signature = nacl.sign.detached(transactionBuffer, payer.secretKey);
    console.log("signature", signature);

    // let signatureHexString = Buffer.from(signature).toString('hex');
    // let signatureRecovered = Uint8Array.from(Buffer.from(signatureHexString, 'hex'));
    // console.log(areEqual("signature comapre", signature, signatureRecovered));

    manualTransaction.addSignature(payer.publicKey, signature);

    let isVerifiedSignature = manualTransaction.verifySignatures();
    console.log(`The signatures were verifed: ${isVerifiedSignature}`)

    // The signatures were verified: true

    let rawTransaction = manualTransaction.serialize();
    console.log("rawTransaction", rawTransaction);
    console.timeEnd("OTHERS");

    console.time("sendAndConfirmRawTransaction");
    await web3.sendAndConfirmRawTransaction(connection, rawTransaction);
    console.timeEnd("sendAndConfirmRawTransaction");

}

main()
```

```
payer.publicKey EnDME6ta7FpM2P4J8o2E861GQYPCFFc2swQjyh4eRjti
payer.secretKey 3f588a0cdc8f8d51435bfe3fec622fdf2073555fee9e1ea4128695856d612f9eccbd07795e4409fceedad5c95f51e5a822f28e4950c76048e6f9aa8878c8c98f
connection: 0.947ms
airdrop request: 1.187s
airdrop confirm: 1.271s
recentBlockhash: 264.977ms
recentBlockhash {
  blockhash: 'emGXQPV8HBABFaXRnDg4bLKRuGEbHHRJ5empBfo8ers',
  feeCalculator: { lamportsPerSignature: 5000 }
}
transactionBuffer <Buffer 01 00 01 03 cc bd 07 79 5e 44 09 fc ee da d5 c9 5f 51 e5 a8 22 f2 8e 49 50 c7 60 48 e6 f9 aa 88 78 c8 c9 8f 62 d8 e4 62 f9 94 a1 be 0f 6b 10 86 51 7e ... 100 more bytes>
transactionBuffer toString 01000103ccbd07795e4409fceedad5c95f51e5a822f28e4950c76048e6f9aa8878c8c98f62d8e462f994a1be0f6b1086517eed2c5c12f279303e37539757363c8d175df9000000000000000000000000000000000000000000000000000000000000000009ac8b253acceb5bcd60f2b084dc8fa56fd582d52e21d469de13e2ac86d1a93801020200010c02000000e803000000000000
signature Uint8Array(64) [
   58,  80,   2, 191, 135, 152, 161, 201, 152,  17,  22,
  164, 143, 128, 218,  16, 212, 207,  43, 186, 185, 133,
   90,   9, 112, 136,  73, 208, 103, 145, 229,   8,  67,
  111,   9, 175,   9, 234,  68, 177,  27, 201, 186, 124,
  103,  38, 137, 163,  67, 184, 127,  62, 146, 150,  33,
    1, 219,  25,  73,  36,  82, 207, 165,   8
]
signature json 3a5002bf8798a1c9981116a48f80da10d4cf2bbab9855a09708849d06791e508436f09af09ea44b11bc9ba7c672689a343b87f3e92962101db19492452cfa508
The signatures were verifed: true
rawTransaction <Buffer 01 3a 50 02 bf 87 98 a1 c9 98 11 16 a4 8f 80 da 10 d4 cf 2b ba b9 85 5a 09 70 88 49 d0 67 91 e5 08 43 6f 09 af 09 ea 44 b1 1b c9 ba 7c 67 26 89 a3 43 ... 165 more bytes>
OTHERS: 35.652ms
sendAndConfirmRawTransaction: 2.017s
```