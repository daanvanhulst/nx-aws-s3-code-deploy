import { BuilderContext } from '@angular-devkit/architect';
import * as AWS from 'aws-sdk';
import {
  getAccessKeyId,
  getApplicationName,
  getBucket,
  getDeploymentGroupName,
  getRegion,
  getSecretAccessKey,
  getZip,
} from './config';
import { Schema } from './schema';

export class Deployer {
  private _context: BuilderContext;
  private _bucket: string;
  private _region: string;
  private _zip: string;
  private _applicationName: string;
  private _deploymentGroupName: string;
  private _builderConfig: Schema;
  private _codeDeploy: AWS.CodeDeploy;

  constructor(context: BuilderContext, builderConfig: Schema) {
    this._context = context;
    this._builderConfig = builderConfig;
    this._bucket = getBucket() || this._builderConfig.bucket;
    this._region = getRegion() || this._builderConfig.region;
    this._zip = getZip() || this._builderConfig.zip;
    this._deploymentGroupName =
      getDeploymentGroupName() || this._builderConfig.deploymentGroupName;
    this._applicationName =
      getApplicationName() || this._builderConfig.applicationName;

    this._codeDeploy = new AWS.CodeDeploy({
      apiVersion: 'latest',
      secretAccessKey: getSecretAccessKey(),
      accessKeyId: getAccessKeyId(),
    });
  }

  async deploy(): Promise<boolean> {
    try {
      if (
        !this._region ||
        !this._bucket ||
        !this._zip ||
        !this._applicationName
      ) {
        console.log(this._region);
        console.log(this._bucket);
        console.log(this._zip);
        console.log(this._applicationName);
        this._context.logger.error(
          `❌  Looks like you are missing some configuration`
        );
        return false;
      }

      const deployment: AWS.CodeDeploy.CreateDeploymentInput = {
        applicationName: this._applicationName,
        deploymentGroupName: this._deploymentGroupName,
        revision: {
          revisionType: 'S3',
          s3Location: {
            bucket: this._bucket,
            bundleType: 'zip',
            key: this._zip,
          },
        },
        deploymentConfigName: 'CodeDeployDefault.AllAtOnce',
        description: 'Deployment through nx-aws-deploy',
        ignoreApplicationStopFailures: true,
        autoRollbackConfiguration: { enabled: false },
        updateOutdatedInstancesOnly: false,
        fileExistsBehavior: 'OVERWRITE',
      };

      await this._codeDeploy
        .createDeployment(deployment)
        .promise()
        .then((result) => {
          console.log(result);
          this._context.logger.info(`Deployment created`);
        })
        .catch((error) => {
          console.log(error);
          this._context.logger.error(
            `❌  The following error was found during the deployment ${error}`
          );
          throw error;
        });
    } catch {
      return false;
    }
    return true;
  }
}
