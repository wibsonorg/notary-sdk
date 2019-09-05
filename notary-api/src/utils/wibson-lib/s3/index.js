import getS3Client from './getS3Client';
import config from '../../../../config';

const prefix = 'notary';
const client = getS3Client(config.storage);

const putS3Object = async (objectName, data) =>
  client.putObject(objectName, JSON.stringify(data));
const getS3Object = async (objectName) => {
  const obj = await client.getObject(objectName);
  return JSON.parse(obj.Body.toString());
};

export const putData = (order, seller, data) =>
  putS3Object(`${prefix}/${order}/data/${seller}.json`, data);
export const getData = (order, seller) =>
  getS3Object(`${prefix}/${order}/data/${seller}.json`);
