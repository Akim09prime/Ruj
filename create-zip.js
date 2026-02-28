import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

try {
  const zip = new AdmZip();
  const sourceDir = path.join(process.cwd(), 'cpanel-deploy');
  
  // Add all files and folders from cpanel-deploy to root of zip
  zip.addLocalFolder(sourceDir);
  
  // Write zip to disk
  zip.writeZip(path.join(process.cwd(), 'cpanel-deploy.zip'));
  console.log('cpanel-deploy.zip created successfully');
} catch (e) {
  console.error('Error creating zip:', e);
}
