import fs from 'fs';
import path from 'path';

class StorageLocal {
    private localPath: string;

    constructor(localPath: string) {
        this.localPath = localPath;
    }

    public storeFile(file: Express.Multer.File): { url: string, key: string } {
        const filePath = path.join(this.localPath, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        return { url: `/files/${file.originalname}`, key: file.originalname };
    }

    public getFile(key: string): Buffer | null {
        const filePath = path.join(this.localPath, key);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath);
        } else {
            return null;
        }
    }
}

export default StorageLocal;
