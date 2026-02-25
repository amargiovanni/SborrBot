export async function getMediaFile(bucket: R2Bucket, key: string): Promise<R2ObjectBody | null> {
  return bucket.get(key);
}

export async function getMediaAsArrayBuffer(bucket: R2Bucket, key: string): Promise<ArrayBuffer | null> {
  const object = await bucket.get(key);
  if (!object) return null;
  return object.arrayBuffer();
}
