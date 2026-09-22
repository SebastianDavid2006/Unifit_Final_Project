import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const TEMP_DIR = path.join(process.cwd(), 'uploads', 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

export const uploadMultimedia = (entity: 'exercise' | 'machine') => multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'uploads', 'temp'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB temporal
});