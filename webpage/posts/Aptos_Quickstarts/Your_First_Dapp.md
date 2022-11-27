

# Your First Transaction
This tutorial describes, in the following step-by-step approach, how to generate, submit, and verify transactions submitted to the Aptos Blockchain:

1. Create a representation of an account.
Each Aptos account has a unique account address. The owner of that account holds the public, private key-pair that maps to the Aptos account address and, in turn, the authentication key stored in that account.

> NOTE
> See more about Aptos accounts in Accounts.

2. Prepare a wrapper around the REST interfaces.
Aptos provides a REST API for interacting with the blockchain. This step prepares wrappers around this API, for retrieving account information, and for constructing a transaction, signing it and submitting the transaction. Alternatively, Typescript SDK can be used to interreact with the blockchain. In this tutorial, we use Typescript SDK for the Typescript example and custom wrappers for Python and Rust.

> NOTE
> Aptos SDK is preferred when available.

3. Prepare a wrapper around the Faucet interface.
Using the Faucet interface at the Aptos devnet, this tutorial code automatically creates an account with the account address 0x1 and funds the account.

4. Combine the above wrappers into an application, execute and verify.
