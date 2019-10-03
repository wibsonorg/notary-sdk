# <img src="logo.png" alt="Wibson" width="400px">

[Wibson](https://wibson.org/) is a blockchain-based, decentralized data marketplace that provides individuals a way to securely and anonymously sell validated private information in a trusted environment.

**notary-sdk** is the implementation of the official SDK to play as a Notary in Wibson Protocol.

This repository contains two applications

- Notary API: Service consumed by the Buyers API.
- Notary Signing Service: Service used to sign messages, consumed by the Notary API.

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

## Reporting Security Vulnerabilities

If you think that you have found a security issue in Wibson, please **DO NOT** post it as a Github issue and don't publish it publicly. Instead, all security issues must be sent to developers@wibson.org.
Although we are working on setting up a bug bounty program to improve this, we appreciate your discretion and will give the corresponding credit to the reporter(s).

## Contribute

Thank you for thinking about contributing to Wibson Notary SDK. There are many ways you can participate and help build high quality software. Check out the [contribution guide]!

## License

Wibson Notary SDK is released under the [LGPL-3.0](LICENSE).

[contribution guide]: CONTRIBUTING.md
