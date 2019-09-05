import abi from 'ethereumjs-abi';
/**
 * Builds payData for BatPay.registerPayment
 * [1, 3, 5, 7] -> '0xff04...'
 * first byte should be ff, second is element length in bytes
 * the rest are the id deltas in hex format
 * @param {{sellerId: number}[]} sellers list of sellers to send as payData
 */
export const packPayData = sellers =>
  `0xff04${sellers
    .sort((a, b) => a - b)
    .map((id, i, l) => id - (l[i - 1] || 0))
    .map(d => d % (256 ** 4))
    .map(d => d.toString(16).padStart(8, '0'))
    .join('')}`;

/**
 * Retrives ids from payData
 * '0xff04...' -> [1, 3, 5, 7]
 * @param {Buffer} payData pack of seller ids
 */
export const unpackPayData = bytes =>
  ((bytes.startsWith('0x') ? bytes.slice(2) : bytes)
    .slice(4)
    .match(/.{8}/img) || [])
    .map(hex => parseInt(hex, 16))
    .reduce((arr, d) => [...arr, d + Number(arr.slice(-1))], []);

/**
 * Creates solidity-shaped keccak256(abi.encodePacked) key
 * @param  {number} unlocker BatPay ID of unlocker
 * @param  {string} key      master key to use on unlock
 * @return {string}          solidity-shaped keccak256(abi.encodePacked) key
 */
export const hashLock = (unlocker, key) =>
  `0x${abi.soliditySHA3(['uint32', 'bytes'], [unlocker, Buffer.from(key, 'utf8')]).toString('hex')}`;
