# NGX-AWS-DEPLOY

☁️🚀 Deploy your Angular app to Amazon S3 directly from the Angular CLI 🚀☁️

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

![CI](https://github.com/Jefiozie/ngx-aws-deploy/workflows/Publish/badge.svg)
![npm](https://img.shields.io/npm/dw/@jefiozie/ngx-aws-deploy)
![npm (scoped)](https://img.shields.io/npm/v/@jefiozie/ngx-aws-deploy)
![GitHub issues](https://img.shields.io/github/issues/jefiozie/ngx-aws-deploy)
<a href="https://twitter.com/jefiozie">
<img src="https://img.shields.io/badge/say-thanks-ff69b4.svg"/>
</a>
<a href="https://twitter.com/jefiozie">  
 <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/jefiozie?style=social">
</a>

## Quick Start

1. Install the latest version of Angular cli

   ```sh
   yarn global add @angular/cli
   ```

2. Create a new Angular project
   ```sh
   ng new hello-world --defaults
   cd hello-world
   ```
3. Add `@jefiozie/ngx-aws-deploy` to your project

   ```sh
   ng add @jefiozie/ngx-aws-deploy
   ```

4. You will be prompted for a couple of questions:
   1. Your AWS Region
   2. The bucket you would like the files to be uploaded.
   3. The folder where the files should be uploaded (optional)
5. By default we will add the configuration for production setup.
6. After these steps your `angular.json` is updated with a new builder:
   ```json
   "deploy": {
       "builder": "@jefiozie/ngx-aws-deploy:deploy",
       "options": {}
   }
   ```
7. Run `ng deploy` to deploy your application to Amazon S3.

🚀**_Happy deploying!_** 🚀

## Security 🔑

Keep in mind that **with the default config, everybody that has access to the angular.json will have your aws secret**.
If you want more security, you can also use environment variable with `NG_DEPLOY_AWS_ACCESS_KEY_ID`, `NG_DEPLOY_AWS_SECRET_ACCESS_KEY`, `NG_DEPLOY_AWS_BUCKET` and `NG_DEPLOY_AWS_REGION`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
The builder is located in the `builder`folder.
The sample app is located in the `builder-test` folder.
Please make sure to update tests as appropriate.

## License

[MIT](./LICENSE)

## Thanks to✨

I did not create this project from scratch, but it was copied from:
