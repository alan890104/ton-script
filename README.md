# TON-CTF-SCRIPTS

## Description
Some useful scripts for TON CTF, including:
- create my new wallet v4
- deploy my wallet v4
- send ton from my wallet to another wallet
- fund any address from faucet
- get balance of any address

## How to use

### Generate my new wallet v4
This command will generate a new wallet v4 for you. All information will be saved in `.env` file.
```bash
yarn w:gen
```

### Deploy my wallet v4 (your wallet will be automatically funded)
This command will deploy your wallet v4 to the CTF network. (Make sure you have generated your wallet in the previous step)
```bash
yarn w:deploy
```


### Fund any address from faucet
This command will fund any address from the faucet automatically, you will need to provide the address you want to fund.

```bash
yarn fund <address you want to fund>
```


### Get TON balance of any address
This command will get the balance of any address you provide.

```bash
yarn balance <address to get balance>
```

### Transfer ton from my wallet to another wallet
This command will send ton from your wallet to another wallet.

```bash
yarn w:transfer-ton <amount of ton to transfer> <address to receive>
```

Example for transfer 1.5 ton to `EQAbVgWwvJoyS3xY4KsKK-r79Yvr3N5MacRX6CIz1E_kq1BP`:
```bash
yarn w:transfer-ton 1.5 EQAbVgWwvJoyS3xY4KsKK-r79Yvr3N5MacRX6CIz1E_kq1BP
```