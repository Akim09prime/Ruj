# CARVELLO - Deployment Instructions for cPanel

This guide explains how to deploy the Carvello website to a cPanel hosting environment.

## Prerequisites

1.  **cPanel Access**: You need access to the File Manager and Database (optional, as this uses JSON files).
2.  **Domain**: The domain (e.g., carvello.ro) should be pointing to your hosting.
3.  **Email Account**: Ensure `office@carvello.ro` (or your chosen contact email) exists or forwards to you.

## Step 1: Build the Application

Before uploading, you need to generate the production files.

1.  Open your terminal in the project folder.
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  This will create a `cpanel-deploy` folder containing all the files needed for the website.

## Step 2: Prepare for Upload

1.  Locate the `cpanel-deploy` folder created in the previous step.
2.  Select **all files and folders** inside `cpanel-deploy` (e.g., `assets`, `api`, `index.html`, etc.).
3.  Create a **ZIP archive** of these contents. Name it `cpanel-deploy.zip`. (Or simply run `npm run zip` to do this automatically).

## Step 3: Upload to cPanel

1.  Log in to your cPanel.
2.  Open **File Manager**.
3.  Navigate to `public_html` (or the folder for your subdomain).
4.  **Backup**: If you have an existing site, create a backup (zip the current contents) and download it.
5.  **Clean Up**: Delete existing files **EXCEPT** `data` and `uploads` folders if you want to keep existing content/images.
    *   *Initial Deploy*: You can delete everything.
6.  **Upload**: Click "Upload" and select your `deploy.zip` file.
7.  **Extract**: Right-click `deploy.zip` and select "Extract". Extract to `public_html`.
8.  **Delete Zip**: Delete `deploy.zip` after extraction.

## Step 4: Configure Permissions (Crucial)

For the CMS and Contact Form to work, the server needs permission to write to certain folders.

1.  In File Manager, locate the `data` folder.
2.  Right-click `data` -> **Change Permissions**.
3.  Set permissions to **755** (User: Read/Write/Execute, Group: Read/Execute, World: Read/Execute).
    *   *Note*: On some strict servers, you might need **777**, but try 755 first for security.
4.  Repeat for the `uploads` folder.
5.  Repeat for the `sessions` folder (if it exists, or create it).

## Step 5: Email Configuration

1.  Open `api/config.php` (in File Manager).
2.  Verify/Edit the email settings:
    ```php
    define('CONTACT_EMAIL', 'office@carvello.ro'); // Where you receive emails
    define('SENDER_EMAIL', 'noreply@carvello.ro'); // The "From" address
    ```
3.  Ensure `noreply@carvello.ro` is a valid email or at least valid for your domain to prevent spam filtering.

## Step 6: Admin Panel Setup

1.  Access the admin panel at: `https://carvello.ro/admin`
2.  **Default Login**:
    *   Username: `admin`
    *   Password: `carvello2024` (or `admin` if using the old fallback)
3.  **Security Action**:
    *   Go to **Settings** immediately.
    *   Change the Admin Password.

## Troubleshooting

*   **Contact Form Errors**:
    *   Check `data` folder permissions (Step 4).
    *   Check if your hosting allows PHP `mail()` function.
*   **Admin Changes Not Saving**:
    *   Check `data` folder permissions.
    *   Ensure `api/content.php` exists and is accessible.
*   **Images Not Uploading**:
    *   Check `uploads` folder permissions.
    *   Check file size limits in PHP configuration (`upload_max_filesize`).

## File Structure on Server

Your `public_html` should look like this:

```
public_html/
├── api/
│   ├── auth.php
│   ├── contact.php
│   ├── config.php
│   └── ...
├── assets/
│   ├── index-....js
│   └── ...
├── data/           <-- Must be Writable (755/777)
│   ├── settings.json
│   ├── leads.json
│   └── ...
├── uploads/        <-- Must be Writable (755/777)
├── index.html
├── .htaccess
└── ...
```
