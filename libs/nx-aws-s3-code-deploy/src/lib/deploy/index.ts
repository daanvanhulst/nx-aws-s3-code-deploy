import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  targetFromTargetString,
} from '@angular-devkit/architect';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { getAccessKeyId, getSecretAccessKey, getZip } from './config';
import { Deployer } from './deployer';
import { Schema } from './schema';
import { Uploader } from './uploader';
import { Zipper } from './zipper';

const getFiles = (filesPath: string) => {
  return glob.sync(`**`, {
    ignore: ['.git'],
    cwd: filesPath,
    nodir: true,
    // Directory and file names may contain `.` at the beginning,
    // e.g. `.well-known/apple-app-site-association`.
    dot: true,
  });
};

export default createBuilder(
  async (
    builderConfig: Schema,
    context: BuilderContext
  ): Promise<BuilderOutput> => {
    context.reportStatus('Executing deployment');
    if (!context.target) {
      throw new Error('Cannot deploy the application without a target');
    }
    const buildTarget = {
      name:
        builderConfig.buildTarget ||
        `${context.target.project}:build:production`,
    };

    let targetString = `${context.target.project}:deploy`;
    // Providing `region` and `bucket` through configuration is actually deprecated.
    // By default `ng add` command doesn't generate any additional configuration inside
    // the builder configuration thus `context.target.configuration` defaults to an empty string.
    if (context.target.configuration) {
      targetString += `:${context.target.configuration}`;
    }

    const {
      bucket,
      region,
      zip,
      deploymentGroupName,
      applicationName,
    } = await context.getTargetOptions(targetFromTargetString(targetString));

    const deployConfig = {
      bucket,
      region,
      zip,
      deploymentGroupName,
      applicationName,
    } as Pick<
      Schema,
      'bucket' | 'region' | 'zip' | 'deploymentGroupName' | 'applicationName'
    >;

    let buildResult: BuilderOutput;
    if (builderConfig.noBuild) {
      context.logger.info(`📦 Skipping build`);

      const { outputPath } = await context.getTargetOptions(
        targetFromTargetString(buildTarget.name)
      );

      buildResult = {
        outputPath,
        success: true,
      };
    } else {
      const overrides = {
        // this is an example how to override the workspace set of options
        ...(builderConfig.baseHref && { baseHref: builderConfig.baseHref }),
      };

      const build = await context.scheduleTarget(
        targetFromTargetString(buildTarget.name),
        {
          ...overrides,
        }
      );

      buildResult = await build.result;
      context.logger.info(`✔ Build Completed`);
    }
    if (buildResult.success) {
      const filesPath = (buildResult.webpackStats as any).outputPath;
      const files = getFiles(filesPath);

      if (files.length === 0) {
        throw new Error(
          'Target did not produce any files, or the path is incorrect.'
        );
      }
      if (getAccessKeyId() || getSecretAccessKey()) {
        const fileName = getZip() || deployConfig.zip;
        if (!fileName) {
          return {
            error: `❌  zip was not set. Please make sure you add this in your angular.json or .env`,
            success: false,
          };
        }

        context.logger.info('Start zipping files...');
        const zipper = new Zipper();
        const result = await zipper.zip(filesPath, fileName);
        if (result.status) {
          context.logger.info('✔ Finished zipping files...');
          context.logger.info('Start uploading files...');

          const uploader = new Uploader(context, deployConfig);
          const success = await uploader.upload(
            [result.fileName],
            result.filePath
          );
          if (success) {
            context.logger.info('✔ Finished uploading files...');

            try {
              context.logger.info('Removing zip file from dist folder...');
              fs.unlinkSync(path.join(result.filePath, result.fileName));
            } catch (err) {
              context.logger.warn(
                '❌ Error removing zip file from dist folder'
              );
            }

            context.logger.info('Calling CodeDeploy to deploy application...');
            const deployer = new Deployer(context, deployConfig);
            const deployed = await deployer.deploy();

            if (deployed) {
              return { success: true };
            } else {
              return {
                error: `❌  Error during creation of deployment`,
                success: false,
              };
            }
          } else {
            return {
              error: `❌  Error during files upload`,
              success: false,
            };
          }
        }
      } else {
        return {
          error: `❌  Missing authentication settings for AWS`,
          success: false,
        };
      }
    } else {
      return {
        error: `❌ Application build failed`,
        success: false,
      };
    }
  }
);
