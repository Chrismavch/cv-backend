// backend/seed.js
import fs from 'fs';
import path from 'path';

const greekNames = ['Γιώργος', 'Ελένη', 'Νίκος', 'Μαρία', 'Κώστας', 'Ανδριάνα', 'Σοφία', 'Αλέξανδρος', 'Ιωάννα', 'Θανάσης'];
const surnames = ['Παπαδόπουλος', 'Νικολάου', 'Δημητρίου', 'Αθανασίου', 'Χατζής', 'Κωνσταντίνου', 'Γεωργίου', 'Μαρκόπουλος'];

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

const dummyFolder = path.join('./data');
if (!fs.existsSync(dummyFolder)) fs.mkdirSync(dummyFolder);

for (let i = 0; i < 20; i++) {
  const name = `${greekNames[Math.floor(Math.random() * greekNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
  const email = `${name.toLowerCase().replace(/\s+/g, '.')}@demo.gr`;
  const experience = experiences[Math.floor(Math.random() * experiences.length)];
  const timestamp = Date.now() + i; // Ensure unique timestamp
  const filename = `${timestamp}-${name.replace(/\s+/g, '_')}.json`;

  const cvData = {
    name,
    email,
    experience,
    filePath: `uploads/${timestamp}-${name.replace(/\s+/g, '_')}.pdf`
  };

  fs.writeFileSync(path.join(dummyFolder, filename), JSON.stringify(cvData, null, 2));
}

console.log('✅ 20 Dummy CVs with restaurant and content creator roles generated!');
