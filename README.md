# notary-sdk
Wibson Notary Official SDK

This repository contains two applications

* Notary API: Service consumed by the Buyer APIs
* Notary Signing Service: Service used to sign messages, consumed by Notary API

## Getting Started
TODO

## Secrets Management

### Encrypting .env file
```
gpg -e -a .env
```

### Editing .env file securely
```
mv .vimrc.example ~/.vimrc
vi .env.asc
```

### Exporting GnuPG private key
```
gpg --export-secret-keys -a -o private-key.asc <key-id>
```

### Running app with encrypted .env
```
GPG_KEY_PATH="private-key.asc" ENV_PATH=".env.asc" npm run start
```