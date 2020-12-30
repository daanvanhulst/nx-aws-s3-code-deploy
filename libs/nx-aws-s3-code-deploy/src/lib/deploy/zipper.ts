import * as archiver from 'archiver';
import { createWriteStream } from 'fs';
import * as path from 'path';
var archive = archiver('zip');

export class Zipper {
  constructor() {}

  public async zip(
    filesPath: string,
    fileName: string
  ): Promise<{ status: boolean; fileName?: string; filePath?: string }> {
    var output = createWriteStream(path.join(filesPath, fileName));

    return new Promise((resolve, reject) => {
      try {
        output.on('close', function () {
          console.log(
            'zip file created with' + archive.pointer() + ' total bytes'
          );
          resolve({ status: true, fileName, filePath: filesPath });
        });

        archive.on('error', function (err) {
          throw err;
        });

        archive.pipe(output);

        archive.directory(filesPath, false);

        archive.finalize();
      } catch (error) {
        reject({ status: false });
      }
    });
  }
}
