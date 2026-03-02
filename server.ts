import express from 'express';
import session from 'express-session';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'carvello-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Helper to read JSON file
const readJsonFile = (filename: string) => {
    const filePath = path.join(process.cwd(), 'public', 'data', filename);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

// Helper to write JSON file
const writeJsonFile = (filename: string, data: any) => {
    const filePath = path.join(process.cwd(), 'public', 'data', filename);
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// API Routes (Mimicking PHP behavior)

// Auth API
app.all('/api/auth.php', (req, res) => {
    const action = req.query.action as string;

    // Login
    if (req.method === 'POST' && !action) {
        const { username, password } = req.body;
        // Hardcoded credentials for demo
        if (username === 'admin' && password === 'carvello2024') {
            (req.session as any).admin_logged_in = true;
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
        return;
    }

    // Logout
    if ((req.method === 'GET' || req.method === 'POST') && action === 'logout') {
        req.session.destroy(() => {
            res.json({ success: true, message: 'Logged out' });
        });
        return;
    }

    // Session Check
    if (req.method === 'GET' && action === 'session') {
        const authenticated = (req.session as any).admin_logged_in === true;
        res.json({ authenticated });
        return;
    }

    res.status(404).json({ error: 'Action not found' });
});

// Content API
app.all('/api/content.php', (req, res) => {
    // Read Content
    if (req.method === 'GET') {
        const file = req.query.file as string;
        if (!file) {
            res.status(400).json({ error: 'File parameter missing' });
            return;
        }
        const data = readJsonFile(file);
        if (data) {
            res.json(data);
        } else {
            // Return empty array or object if file doesn't exist yet
            res.json(file === 'leads.json' ? [] : {});
        }
        return;
    }

    // Write Content
    if (req.method === 'POST') {
        // Check auth
        if (!(req.session as any).admin_logged_in) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { file, data } = req.body;
        if (!file || !data) {
            res.status(400).json({ error: 'Missing file or data' });
            return;
        }

        writeJsonFile(file, data);
        res.json({ success: true, message: 'Data saved successfully' });
        return;
    }

    res.status(405).json({ error: 'Method not allowed' });
});

// Upload API
app.post('/api/upload.php', upload.single('image'), (req, res) => {
    // Check auth
    if (!(req.session as any).admin_logged_in) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
});

// Leads API
app.post('/api/leads.php', (req, res) => {
    const lead = req.body;
    
    // Validate required fields
    if (!lead.name || !lead.email || !lead.phone) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const leads = readJsonFile('leads.json') || [];
    
    const newLead = {
        id: Date.now(),
        ...lead,
        status: 'new',
        created_at: new Date().toISOString()
    };
    
    leads.push(newLead);
    writeJsonFile('leads.json', leads);
    
    res.json({ success: true, message: 'Lead submitted successfully' });
});

// Contact API (Mocking PHP)
app.post('/api/contact.php', upload.single('file'), (req, res) => {
    const body = req.body;
    const file = req.file;

    console.log('--- SIMULATING CONTACT FORM SUBMISSION ---');
    console.log('Data:', body);
    if (file) console.log('File:', file.filename);

    // Save to leads.json
    const leadsPath = 'leads.json';
    let leads = [];
    try {
        const existing = readJsonFile(leadsPath);
        if (Array.isArray(existing)) leads = existing;
    } catch (e) { console.error('Error reading leads', e); }

    const newLead = {
        id: Date.now().toString(), // PHP uses uniqid()
        type: 'general',
        name: body.name,
        email: body.email,
        phone: body.phone,
        city: body.city,
        projectType: body.projectType,
        category: body.category,
        budget: body.budget,
        timeline: body.timeline,
        message: body.message,
        filePath: file ? `/uploads/${file.filename}` : '',
        status: 'new',
        source: body.source || 'website',
        userAgent: body.userAgent || '',
        createdAt: body.createdAt || new Date().toISOString()
    };

    leads.unshift(newLead);
    writeJsonFile(leadsPath, leads);

    console.log('Lead saved to leads.json');
    console.log('Email would be sent to office@carvello.ro');
    console.log('------------------------------------------');

    res.json({ ok: true, message: 'Solicitarea a fost trimisă cu succes (Simulated).' });
});

// Send Offer API
app.post('/api/send_offer.php', (req, res) => {
    // Check auth
    if (!(req.session as any).admin_logged_in) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { to, subject, message, images, link } = req.body;

    if (!to || !subject || !message) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    console.log('--- SIMULATING EMAIL SEND ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log(`Link: ${link}`);
    console.log(`Images: ${images?.length || 0} attached`);
    console.log('-----------------------------');

    // In a real PHP environment, this would use mail() or PHPMailer
    
    res.json({ success: true, message: 'Offer sent successfully' });
});

// Vite Middleware
async function startServer() {
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
    });

    app.use(vite.middlewares);

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
