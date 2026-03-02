import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

try {
  const zip = new AdmZip();
  const sourceDir = path.join(process.cwd(), 'cpanel-deploy');
  
  if (!fs.existsSync(sourceDir)) {
    console.error('Error: cpanel-deploy folder not found. Run "npm run build" first.');
    process.exit(1);
  }

  console.log('Zipping contents of cpanel-deploy folder...');
  // Add all files and folders from cpanel-deploy to root of zip
  zip.addLocalFolder(sourceDir);
  
  // Write zip to disk
  const outputPath = path.join(process.cwd(), 'cpanel-deploy.zip');
  zip.writeZip(outputPath);
  console.log(`Successfully created ${outputPath}`);
} catch (e) {
  console.error('Error creating zip:', e);
  process.exit(1);
}
