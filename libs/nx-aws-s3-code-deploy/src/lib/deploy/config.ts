export const getZip = (): string => {
  return process.env.NX_DEPLOY_AWS_S3_ZIP;
};

export const getAccessKeyId = (): string => {
  return process.env.NX_DEPLOY_AWS_S3_ACCESS_KEY_ID;
};

export const getSecretAccessKey = (): string => {
  return process.env.NX_DEPLOY_AWS_S3_SECRET_ACCESS_KEY;
};

export const getBucket = (): string => {
  return process.env.NX_DEPLOY_AWS_S3_BUCKET;
};

export const getRegion = (): string => {
  return process.env.NX_DEPLOY_AWS_S3_REGION;
};

export const getApplicationName = (): string => {
  return process.env.NX_DEPLOY_AWS_S3_APPLICATION_NAME;
};

export const getDeploymentGroupName = (): string => {
  return process.env.NX_DEPLOY_AWS_S3_DEPLOYMENT_GROUP_NAME;
};
