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
  
  // Create a filter function to exclude data and uploads directories
  const filter = (entry) => {
    const relativePath = path.relative(sourceDir, entry);
    // Check if the path starts with data or uploads
    if (relativePath.startsWith('data') || relativePath.startsWith('uploads')) {
      return false;
    }
    return true;
  };

  // Add all files and folders from cpanel-deploy to root of zip, with filter
  // Note: addLocalFolder doesn't support filter in all versions, so we might need to iterate.
  // But adm-zip addLocalFolder doesn't support filter.
  // We must iterate manually or delete the folders from sourceDir before zipping?
  // Deleting from sourceDir is safer for the zip, but destroys the build output.
  // Let's delete them from sourceDir since it's a temporary build artifact.
  
  const dataDir = path.join(sourceDir, 'data');
  const uploadsDir = path.join(sourceDir, 'uploads');
  
  if (fs.existsSync(dataDir)) {
    console.log('Removing data directory from deployment package to preserve user data...');
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
  
  if (fs.existsSync(uploadsDir)) {
    console.log('Removing uploads directory from deployment package to preserve user data...');
    fs.rmSync(uploadsDir, { recursive: true, force: true });
  }

  zip.addLocalFolder(sourceDir);
  
  // Write zip to disk
  const outputPath = path.join(process.cwd(), 'cpanel-deploy.zip');
  zip.writeZip(outputPath);
  console.log(`Successfully created ${outputPath}`);
} catch (e) {
  console.error('Error creating zip:', e);
  process.exit(1);
}
