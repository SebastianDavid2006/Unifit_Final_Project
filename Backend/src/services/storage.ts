import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'multimedia');
const TEMP_DIR = path.join(process.cwd(), 'uploads', 'temp');

[UPLOAD_DIR, path.join(process.cwd(), 'uploads', 'temp')].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

export async function saveFile(tempPath: string, originalName: string): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${uuidv4()}${path.extname(originalName).toLowerCase()}`;
  const finalPath = path.join(process.cwd(), 'uploads', 'multimedia', filename);
  fs.renameSync(tempPath, path.join(process.cwd(), 'uploads', 'multimedia', filename));
  return `/uploads/multimedia/${filename}`;
}

export async function deleteFile(url: string): Promise<void> {
  if (!url || !url.startsWith('/uploads/')) return;
  const filename = path.basename(url);
  const filePath = path.join(process.cwd(), 'uploads', 'multimedia', filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}