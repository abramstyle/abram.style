const path = require('path');
const { S3Uploader } = require('@abramstyle/deploy-tools');

const buildPath = path.resolve(__dirname, '../dist');

const uploadConfig = {
  bucket: 'abram-style-assets',
  keyPrefix: 'assets',
};

async function startJob() {
  const uploader = new S3Uploader(uploadConfig);

  uploader.on('success', ({ count, finished, filename }) => {
    console.log(`progress: ${finished}/${count}. file ${filename} upload success.`);
  });
  uploader.on('done', () => {
    console.log('uploading finished.');
  });

  await uploader.uploadDir(buildPath);
}

console.log('initializing...');

startJob().then(() => {
  console.log('start upload...');
}).catch((error) => {
  console.error('file upload failed.', error);
});
