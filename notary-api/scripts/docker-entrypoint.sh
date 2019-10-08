#!/bin/sh

npm i
npm run build
npm install --no-save websocket

## wait deps
echo "Waiting DEPS..."
while ! nc -z "$DEP_HOST" "$DEP_PORT"; do sleep 5; done
echo "DEPS OK"

set -a
[ -f /contracts/contracts.env ] && . /contracts/contracts.env
[ -f /contracts/batpayIds.env ] && . /contracts/batpayIds.env
set +a

echo "DATA EXCHANGE -> $DATA_EXCHANGE_ADDRESS"
echo "WIBCOIN -> $WIBCOIN_ADDRESS"
echo "BATPAY -> $BATPAY_ADDRESS"

export BATPAY_ID=$NOTARY_BATPAY_ID
echo "BATPAY ID -> $BATPAY_ID"

npm run start

