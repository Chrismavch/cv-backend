// backend/seed.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const greekNames   = ['Γιώργος','Ελένη','Νίκος','Μαρία','Κώστας','Ανδριάνα','Σοφία','Αλέξανδρος','Ιωάννα','Θανάσης'];
const surnames     = ['Παπαδόπουλος','Νικολάου','Δημητρίου','Αθανασίου','Χατζής','Κωνσταντίνου','Γεωργίου','Μαρκόπουλος'];
const experiences  = [
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
// **Greek** categories:
const ALL_CATEGORIES   = ['Εστίαση','Καφές/Barista','Διανομή','Δημιουργία Περιεχομένου','Ψηφιακό Μάρκετινγκ', 'Πληροφορική', 'Διοίκηση Επιχειρήσεων', 'Μάρκετινγκ']; // Added more categories from frontend


const outDir = path.join(__dirname, 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Clear existing data before seeding
// console.log('Clearing existing data...');
// fs.readdirSync(outDir).forEach(f => fs.unlinkSync(path.join(outDir, f)));
// console.log('Existing data cleared.');

for (let i = 0; i < 20; i++) { // Generate 20 dummy CVs
  const name     = `${greekNames[Math.floor(Math.random()*greekNames.length)]} ${surnames[Math.floor(Math.random()*surnames.length)]}`;
  const email    = `${name.toLowerCase().replace(/\s+/g,'.').replace(/[^a-z.]/g, '')}@demo.gr`; // Basic email sanitization
  const exp      = experiences[Math.floor(Math.random()*experiences.length)];
  const ts       = Date.now() + i; // Ensure unique timestamp

  // **FIX:** Assign a random ARRAY of 1 to 3 categories
  const numCategories = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 categories
  const shuffledCategories = ALL_CATEGORIES.sort(() => 0.5 - Math.random()); // Shuffle categories
  const selectedCategories = shuffledCategories.slice(0, numCategories); // Pick the first numCategories

  const safeName = name.replace(/\s+/g,'_').replace(/[^Α-Ωα-ωΆ-Ώά-ώA-Za-z0-9_.-]/g, ''); // Sanitize name for filename


  const jsonFilename = `${ts}-${safeName}.json`; // Name of the JSON file
  // **FIX:** Store filePath in the format frontend expects (including uploads/ prefix)
  const filePath = `uploads/${ts}-${safeName}.pdf`; // Dummy PDF filename format


  const cvData = {
    name,
    email,
    experience: exp,
    // **FIX:** Store categories as an array
    categories: selectedCategories, // Store the selected array of categories
    filePath: filePath // Store the filePath including the prefix
  };

  fs.writeFileSync(
    path.join(outDir, jsonFilename), // Save with the JSON filename
    JSON.stringify(cvData, null, 2),
    'utf8'
  );
}

console.log(`✅ ${20} Dummy CVs with random category arrays created in ${outDir}!`);