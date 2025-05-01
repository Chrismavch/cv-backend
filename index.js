// backend/index.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app        = express();
const PORT       = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Multer storage with Greek‐char filename support
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const timestamp    = Date.now();
    const originalName = Buffer
      .from(file.originalname, 'latin1')
      .toString('utf8')
      .replace(/\s+/g, '_')
      .replace(/[^Α-Ωα-ωάέίήύόώϊϋΰΐA-Za-z0-9_.-]/g, '');

    cb(null, `${timestamp}-${originalName}`);
  }
});
const upload = multer({ storage });

// Healthcheck
app.get('/', (_req, res) => {
  res.send('CV Platform Backend API is running');
});

// Upload endpoint
app.post('/api/upload', upload.single('cv'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { name, email, experience } = req.body;
  let { categories }                = req.body;

  // Normalize categories into array
  if (!categories) categories = [];
  else if (typeof categories === 'string') categories = [categories];
  // else if array already, leave as-is

  const userData = {
    name,
    email,
    experience,
    categories,
    filePath: req.file.path
  };

  // Ensure data folder exists
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  // Write JSON file
  const outPath = path.join(dataDir, `${Date.now()}-${req.file.originalname}.json`);
  fs.writeFileSync(outPath, JSON.stringify(userData, null, 2));

  res.json({ message: 'CV uploaded successfully' });
});

// List (and filter) CVs
app.get('/api/cvs', (req, res) => {
  const { category } = req.query;
  const dataDir      = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) return res.json([]);

  const allFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  const cvs = allFiles.map(filename => {
    const raw = fs.readFileSync(path.join(dataDir, filename), 'utf8');
    return JSON.parse(raw);
  });

  // If category filter provided, only include those whose categories array contains it
  const result = category
    ? cvs.filter(cv => Array.isArray(cv.categories) && cv.categories.includes(category))
    : cvs;

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
