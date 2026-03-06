DEPLOYMENT INSTRUCTIONS FOR CPANEL (DataHost)
==============================================

This package contains the full server-side CMS build for CARVELLO.

1. PREPARATION
   - Go to cPanel File Manager -> public_html
   - DELETE all existing files (backup first if needed).
   - Ensure you are showing hidden files (Settings -> Show Hidden Files) to delete old .htaccess too.

2. UPLOAD
   - Upload the contents of this folder (`cpanel-deploy`) to `public_html`.
   - You should see:
     - api/ (folder)
     - assets/ (folder)
     - data/ (folder)
     - uploads/ (folder)
     - .htaccess (file)
     - index.html (file)
     - robots.txt, sitemap.xml, etc.

3. PERMISSIONS
   - Ensure the `data` and `uploads` folders have write permissions (755 is usually fine, sometimes 777 is needed depending on server config, but try 755 first).
   - The PHP scripts in `api/` need to be able to write to these folders.

4. CONFIGURATION
   - Edit `api/config.php`:
     - Change `CONTACT_EMAIL` to your real email address.
     - Change `DEFAULT_ADMIN_PASS_HASH` if you want a different initial password.
       (Default is 'admin'. You can change it from the Admin Panel later).

5. TESTING
   - Visit https://carvello.ro
   - Go to https://carvello.ro/admin
   - Login with:
     - User: admin
     - Pass: admin
   - Go to Settings -> Change Password immediately.
   - Test uploading an image in Hero Manager.
   - Test the Contact form on the public site.

6. TROUBLESHOOTING
   - If you see a 404 on /api/..., check if the `api` folder exists and permissions are correct (644 for .php files, 755 for folders).
   - If you see "File not found" for JSON, check if `data/` folder has the seed files.
   - If you see a blank screen, check the browser console (F12) for errors.
   - If changes don't appear, clear your browser cache or try Incognito mode.

==============================================
BUILT: 2026-02-28
VERSION: 3.0 (Server-Side CMS)
