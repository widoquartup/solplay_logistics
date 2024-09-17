// import fs from 'fs';
// import path from 'path';
// import { Request } from 'express';
import storageDrivers from './storages';
import StorageLocal from './StorageLocal'; // Importar la nueva clase

// interface UploadResponse {
//     url: string;
//     key: string;
// }
interface LocalStorageType {
    storagePath: string;
}
class StorageService {
    private driver: string;
    private localStorage?: StorageLocal; // Instancia de StorageLocal
    // private s3: AWS.S3;
    // private s3Bucket: string;
    // private gcs: any;
    // private gcsBucket: string;

    constructor() {
        this.driver = process.env.STORAGE_DRIVER || 'local';
        if (this.driver === 'local') {
            const localStorage: LocalStorageType = storageDrivers[this.driver];
            this.localStorage = new StorageLocal(localStorage.storagePath);
        }

        // if (config.driver === 'local') {
        //     this.localStorage = new StorageLocal(config.storagePath);
        // }
        //  else if (config.driver === 's3') {
        //     this.s3 = config.s3;
        //     this.s3Bucket = config.bucketName;
        // } else if (config.driver === 'gcs') {
        //     this.gcs = config.storage;
        //     this.gcsBucket = config.bucketName;
        // }
    }
    public async storeFile(file: Express.Multer.File) {
        if (this.localStorage) {
            return this.localStorage.storeFile(file);
        }
    }

    // public async uploadFile(req: Request): Promise<UploadResponse> {
    //     const file = req.file;

    //     if (!file) {
    //         throw new Error('No file uploaded');
    //     }

    //     if (this.driver === 'local') {
    //         return this.localStorage!.uploadFile(file);
    //     } else if (this.driver === 's3') {
    //         const params = {
    //             Bucket: this.s3Bucket,
    //             Key: file.originalname,
    //             Body: file.buffer,
    //             ContentType: file.mimetype,
    //         };

    //         const data = await this.s3.upload(params).promise();
    //         return { url: data.Location, key: data.Key };
    //     } else if (this.driver === 'gcs') {
    //         const bucket = this.gcs.bucket(this.gcsBucket);
    //         const blob = bucket.file(file.originalname);
    //         const blobStream = blob.createWriteStream({
    //             resumable: false,
    //             contentType: file.mimetype,
    //         });

    //         blobStream.end(file.buffer);
    //         return new Promise((resolve, reject) => {
    //             blobStream.on('finish', () => {
    //                 const publicUrl = `https://storage.googleapis.com/${this.gcsBucket}/${blob.name}`;
    //                 resolve({ url: publicUrl, key: blob.name });
    //             });

    //             blobStream.on('error', (err) => {
    //                 reject(err);
    //             });
    //         });
    //     } else {
    //         throw new Error('Invalid storage driver');
    //     }
    // }

    // public async getFile(key: string): Promise<Buffer | null> {
    //     if (this.driver === 'local') {
    //         return this.localStorage!.getFile(key);
    //     } else if (this.driver === 's3') {
    //         const params = {
    //             Bucket: this.s3Bucket,
    //             Key: key,
    //         };

    //         const data = await this.s3.getObject(params).promise();
    //         return data.Body as Buffer;
    //     } else if (this.driver === 'gcs') {
    //         const bucket = this.gcs.bucket(this.gcsBucket);
    //         const file = bucket.file(key);
    //         const [data] = await file.download();
    //         return data;
    //     } else {
    //         throw new Error('Invalid storage driver');
    //     }
    // }
}

export default StorageService;
