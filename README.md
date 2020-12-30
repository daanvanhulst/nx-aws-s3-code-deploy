# NGX-AWS-DEPLOY

☁️🚀 Deploy a node/express/nest (anything really) app to EC2 using CodeDeploy and Amazon S3 directly from the Angular CLI 🚀☁️

_Note: I created this for myself, so you will most likely need to put some time/effort in it yourself. Feel free to create a feature request/bug. Or even better create a pull request_

I created this because I wanted to deploy a nest application within Narwhals NX to a amazon EC2 instance. I have solved this by zipping and uploading the nest.js application including package.json and install scripts and appspec.yml to S3.

Creating a deployment using CodeDeploy which will be triggered after the upload to S3 was succesful.

There might be an easier way to do this with CodeDeploy directly, but using S3 you can always have a (versioned) artifact. I really like the way the Angular cli has separate steps for test, build, deploy, etc.

## Prerequisites

You need to create a EC2 instance and have CodeDeploy setup correctly. I followed this tutorial made by Paul Zhao:
https://medium.com/paul-zhao-projects/continuous-deployment-pipeline-with-bitbucket-pipelines-to-aws-ec2-using-aws-code-deploy-684ddcc1717f

## Quick Start

1. Install the latest version of Angular cli
   yarn global add @angular/cli

2. Create a new Angular project
   ng new hello-world --defaults
   cd hello-world

3. Add @ascentio/nx-aws-s3-code-deploy to your project
   ng add @ascentio/nx-aws-s3-code-deploy

4. create a .env file and add the following variables:
   NX_DEPLOY_AWS_S3_ACCESS_KEY_ID=
   NX_DEPLOY_AWS_S3_SECRET_ACCESS_KEY=
   NX_DEPLOY_AWS_S3_BUCKET=
   NX_DEPLOY_AWS_S3_REGION=(eu-central-1)
   NX_DEPLOY_AWS_S3_ZIP=(application.zip)
   NX_DEPLOY_AWS_S3_APPLICATION_NAME=directcodedeploy
   NX_DEPLOY_AWS_S3_DEPLOYMENT_GROUP_NAME=CDDeploymentGroup

5. Use nx to create a deployment
   nx deploy hello-world

## Special thanks

I used this repository as a base https://github.com/Jefiozie/ngx-aws-deploy made by Jeffrey Bosch.

I followed this tutorial made by Paul Zhao:
https://medium.com/paul-zhao-projects/continuous-deployment-pipeline-with-bitbucket-pipelines-to-aws-ec2-using-aws-code-deploy-684ddcc1717f

## License

[MIT](./LICENSE)
