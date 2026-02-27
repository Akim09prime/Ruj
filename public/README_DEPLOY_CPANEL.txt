CARVELLO Premium CMS - Ghid de Deploy pe cPanel (DataHost)
================================================================

Acest pachet este pregătit pentru deploy direct pe un server cPanel (Apache/PHP).
Nu necesită Node.js sau Vercel.

STRUCTURA PACHETULUI
--------------------
După build (npm run build), folderul /dist va conține:
- index.html (entry point)
- assets/ (fișiere JS/CSS compilate)
- api/contact.php (backend pentru formulare)
- .htaccess (reguli de rewrite și cache)
- robots.txt, sitemap.xml, etc.

PASUL 1: PREGĂTIRE
------------------
1. Asigurați-vă că aveți acces la cPanel -> File Manager.
2. Verificați versiunea PHP din cPanel (recomandat PHP 8.0 sau mai nou).
3. Creați o adresă de email "office@carvello.ro" (sau similar) în cPanel -> Email Accounts, dacă nu există.

PASUL 2: UPLOAD
---------------
1. Arhivați conținutul folderului /dist într-un fișier .zip (ex: site.zip).
   ATENȚIE: Arhivați CONȚINUTUL, nu folderul dist în sine.
2. În cPanel -> File Manager, navigați în public_html (sau folderul domeniului).
3. Ștergeți fișierele vechi (dacă există).
4. Încărcați site.zip și dați Extract.

PASUL 3: CONFIGURARE EMAIL
--------------------------
1. Deschideți fișierul /api/contact.php din File Manager.
2. Editați linia:
   $to = "office@carvello.ro"; 
   (Puneți adresa reală unde doriți să primiți notificările).
3. Salvați fișierul.

PASUL 4: VERIFICARE
-------------------
1. Accesați domeniul (ex: https://www.carvello.ro).
2. Verificați că site-ul se încarcă corect (fără erori 404/500).
3. Mergeți la pagina Contact și trimiteți un mesaj de test.
4. Verificați dacă ați primit emailul.

TROUBLESHOOTING
---------------
- Dacă primiți eroare 404 la refresh pe pagini interne:
  Verificați dacă fișierul .htaccess există în rădăcină. Acesta redirecționează toate cererile către index.html.

- Dacă nu se trimit emailuri:
  Verificați folderul Spam.
  Verificați dacă funcția mail() este activă pe server (contactați suport DataHost).
  Verificați logurile de eroare din cPanel -> Errors.

- Dacă aveți erori de permisiuni (403 Forbidden):
  Asigurați-vă că folderele au permisiuni 755 și fișierele 644.

BACKUP ȘI RESTAURARE
--------------------
CMS-ul folosește stocare locală în browser. Pentru siguranță:
1. Mergeți în Admin -> Setări -> Management Date.
2. Folosiți "Exportă Baza de Date" periodic pentru a salva un backup JSON pe calculator.
3. În caz de probleme sau schimbare browser/device, folosiți "Importă Baza de Date".

SUCCES!
