// backend/index.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for file uploads with Greek character support
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
  const timestamp = Date.now();

  // Convert filename using UTF-8 bytes (preserve Greek chars)
  const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    .replace(/\s+/g, '_') // spaces to underscores
    .replace(/[^Α-Ωα-ωάέίήύόώϊϋΰΐA-Za-z0-9_.-]/g, ''); // allow Greek + safe characters

  cb(null, `${timestamp}-${originalName}`);
  }
});

const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  res.send('CV Platform Backend API is running');
});

app.post('/api/upload', upload.single('cv'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Save basic info
  const userData = {
    name: req.body.name,
    email: req.body.email,
    experience: req.body.experience,
    filePath: req.file.path,
  };

  // Save to a temporary JSON file for now (can be replaced with DB)
  const savePath = path.join(__dirname, 'data');
  if (!fs.existsSync(savePath)) fs.mkdirSync(savePath);
  fs.writeFileSync(
    path.join(savePath, `${Date.now()}-${req.file.originalname}.json`),
    JSON.stringify(userData, null, 2)
  );

  res.json({ message: 'CV uploaded successfully' });
});


app.get('/api/cvs', (req, res) => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) return res.json([]);

  const files = fs.readdirSync(dataDir);
  const cvs = files
    .filter(f => f.endsWith('.json'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(dataDir, filename), 'utf8');
      const json = JSON.parse(raw);
      return { ...json, filename };
    });

  res.json(cvs);
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// Endpoint to retrieve filtered CVs by category
app.get('/api/cvs', (req, res) => {
  const category = req.query.category;
  const dataPath = path.join(__dirname, 'data');

  if (!fs.existsSync(dataPath)) {
    return res.json([]);
  }

  const files = fs.readdirSync(dataPath);
  const result = [];

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(path.join(dataPath, file), 'utf-8');
      const parsed = JSON.parse(content);

      // If category is provided, match it
      if (!category || (parsed.category && parsed.category === category)) {
        result.push(parsed);
      }
    }
  });

  res.json(result);
});
