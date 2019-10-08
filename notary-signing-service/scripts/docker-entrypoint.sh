#!/bin/sh

npm i
npm run build

## wait deps
echo "Waiting DEPS..."
while ! nc -z "$DEP_HOST" "$DEP_PORT"; do sleep 5; done
echo "DEPS OK"

set -a
[ -f /contracts/contracts.env ] && . /contracts/contracts.env
set +a

echo "DATA EXCHANGE -> $DATA_EXCHANGE_ADDRESS"
echo "WIBCOIN -> $WIBCOIN_ADDRESS"
echo "BATPAY -> $BATPAY_ADDRESS"

npm run start
