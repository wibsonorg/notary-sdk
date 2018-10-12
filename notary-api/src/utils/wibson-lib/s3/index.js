import getS3Client from './getS3Client';
import config from '../../../../config';

const prefix = 'notary';
const { storage } = config;
const client = getS3Client(
  storage.url,
  storage.region,
  storage.bucket,
  storage.user,
  storage.password,
);

const getS3Object = async (objectName) => {
  const obj = await client.getObject(objectName);
  const data = obj.Body.toString();
  return JSON.parse(data);
};

const getS3Objects = async (namespace, justSnippets = false) => {
  const files = await client.listObjects(namespace);
  const objectsPromises = files.map(async (file) => {
    const fileName = file.Key;
    const payload = await (justSnippets ? file : getS3Object(fileName));

    return {
      fileName,
      payload,
    };
  });

  const objects = await Promise.all(objectsPromises);
  return objects.filter(obj => obj.payload);
};

// //

const countObjects = async (orderAddress, type) => {
  const namespace = `${prefix}/${orderAddress}/${type}/`;
  const objects = await getS3Objects(namespace, true);
  return objects.length;
};

const listObjects = (orderAddress, type) => {
  const namespace = `${prefix}/${orderAddress}/${type}/`;
  return getS3Objects(namespace);
};

const getObject = (orderAddress, seller, type) => {
  const name = `${prefix}/${orderAddress}/${type}/${seller}.json`;
  return getS3Object(name);
};

const countData = orderAddress => countObjects(orderAddress, 'data');

const listData = orderAddress => listObjects(orderAddress, 'data');

const getData = (orderAddress, seller) => getObject(orderAddress, seller, 'data');

export {
  countData,
  listData,
  getData,
};
