import multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DOC_DIR = path.join(process.cwd(), 'uploads', 'documents')
if (!fs.existsSync(DOC_DIR)) fs.mkdirSync(DOC_DIR, { recursive: true })

export const uploadDocumento = multer({
  storage: multer.diskStorage({
    destination: DOC_DIR,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.pdf'
      cb(null, `${uuidv4()}${ext}`)
    },
  }),
  fileFilter: (req, file, cb) => {
    cb(null, true)
  },
  limits: { fileSize: 10 * 1024 * 1024 },
})