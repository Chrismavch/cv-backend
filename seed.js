// backend/seed.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Ορισμός __dirname σε ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dummy δεδομένα
const greekNames = ['Γιώργος', 'Ελένη', 'Νίκος', 'Μαρία', 'Κώστας', 'Ανδριάνα', 'Σοφία', 'Αλέξανδρος', 'Ιωάννα', 'Θανάσης'];
const surnames   = ['Παπαδόπουλος', 'Νικολάου', 'Δημητρίου', 'Αθανασίου', 'Χατζής', 'Κωνσταντίνου', 'Γεωργίου', 'Μαρκόπουλος'];

const experiences = [
  'Ψήστης με εμπειρία σε κάρβουνο & γκριλ',
  'Σερβιτόρος σε εστιατόριο 5 αστέρων',
  'Barista με γνώσεις latte art',
  'Βοηθός μάγειρα σε μοντέρνο bistrot',
  'Διανομέας φαγητού με δίπλωμα μηχανής',
  'Διαχείριση καναλιού YouTube (μοντάζ, thumbnails)',
  'Δημιουργός περιεχομένου TikTok με 20K followers',
  'Social media manager για Instagram επαγγελματιών',
  'Μοντέρ περιεχομένου για short-form videos',
  'Παρουσιαστής εκπαιδευτικών βίντεο στο YouTube'
];

// Φάκελος αποθήκευσης
const dummyFolder = path.join(__dirname, 'data');
if (!fs.existsSync(dummyFolder)) fs.mkdirSync(dummyFolder, { recursive: true });

// Δημιουργία 20 τυχαίων CV
for (let i = 0; i < 20; i++) {
  const name       = `${greekNames[Math.floor(Math.random() * greekNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
  const email      = `${name.toLowerCase().replace(/\s+/g, '.')}@demo.gr`;
  const experience = experiences[Math.floor(Math.random() * experiences.length)];
  const timestamp  = Date.now() + i;
  const safeName   = name.replace(/\s+/g, '_');
  const filename   = `${timestamp}-${safeName}.json`;

  const cvData = {
    name,
    email,
    experience,
    // φανταστική διαδρομή σε PDF (δεν δημιουργούμε πραγματικό PDF)
    filePath: `uploads/${timestamp}-${safeName}.pdf`
  };

  fs.writeFileSync(
    path.join(dummyFolder, filename),
    JSON.stringify(cvData, null, 2),
    'utf8'
  );
}

console.log('✅ 20 Dummy CVs with restaurant and content creator roles generated!');
