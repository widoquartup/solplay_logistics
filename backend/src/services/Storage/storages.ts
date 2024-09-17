// import dotenv from 'dotenv';
// import { Storage } from '@google-cloud/storage';
// import AWS from 'aws-sdk';

// dotenv.config();

const storageDrivers = {
    local: {
        storagePath: process.env.LOCAL_STORAGE_PATH || 'storage',
    },
    // s3: {
    //     driver: 's3',
    //     bucketName: process.env.S3_BUCKET_NAME,
    //     s3: new AWS.S3({
    //         accessKeyId: process.env.S3_ACCESS_KEY,
    //         secretAccessKey: process.env.S3_SECRET_KEY,
    //         region: process.env.S3_REGION,
    //     }),
    // },
    // gcs: {
    //     driver: 'gcs',
    //     bucketName: process.env.GCS_BUCKET_NAME,
    //     storage: new Storage({
    //         projectId: process.env.GCS_PROJECT_ID,
    //         keyFilename: process.env.GCS_KEYFILE_PATH,
    //     }),
    // },
};

export default storageDrivers;
