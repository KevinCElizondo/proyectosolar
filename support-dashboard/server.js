console.log("--- SUPPORT DASHBOARD SERVER.JS STARTING ---"); // Diagnostic log

const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 9999;

// --- Middleware ---
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- API Endpoints ---

// Get Docker service status
app.get('/api/services', (req, res) => {
    console.log("Received request for /api/services"); // Log endpoint access
    const command = 'docker ps -a --format "{{json .}}"';
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing docker ps command:');
            console.error('Message:', error.message);
            console.error('Stderr:', stderr || 'N/A');
            return res.status(500).json({
                error: 'Failed to execute Docker command.',
                details: error.message,
                stderr: stderr
            });
        }
        try {
            const containers = stdout.trim().split('\n')
                .filter(line => line.trim() !== '')
                .map(line => JSON.parse(line));
            res.json(containers);
        } catch (parseError) {
            console.error('Error parsing Docker ps output:', parseError);
            console.error('Stdout:', stdout);
            res.status(500).json({
                error: 'Failed to parse Docker output.',
                details: parseError.message,
                stdout: stdout // Include raw output for debugging
             });
        }
    });
});

// Get logs for a specific container
app.get('/api/logs/:containerIdOrName', (req, res) => {
    const container = req.params.containerIdOrName;
    console.log(`Received request for /api/logs/${container}`); // Log endpoint access
    // Validate container ID/name format slightly (basic check)
    if (!container || !/^[a-zA-Z0-9_-]+$/.test(container)) {
         return res.status(400).json({ error: 'Invalid container ID or name format.' });
    }
    const command = `docker logs --tail 50 ${container}`;
    exec(command, { maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => { // 5MB buffer
        if (error) {
            console.error(`Error getting logs for ${container}:`);
            console.error('Message:', error.message);
            console.error('Stderr:', stderr || 'N/A');
            return res.status(500).json({
                error: `Failed to get logs for container ${container}.`,
                details: error.message,
                stderr: stderr
            });
        }
        res.type('text/plain').send(stdout);
    });
});

// Get project structure (Static)
app.get('/api/project-structure', (req, res) => {
    console.log("Received request for /api/project-structure"); // Log endpoint access
    // Static representation based on initial design
    const structure = `
proyectosolar/
├── backend-api/
├── readme_notifier/
├── ai_agents/
├── src/ (Frontend)
├── docs/
├── scripts/
├── support-dashboard/ (This service)
├── docker-compose.yml
├── .env
└── ... (other files)
    `.trim();
    res.type('text/plain').send(structure);
});

// Get recent Git commits
app.get('/api/git/commits', (req, res) => {
    console.log("Received request for /api/git/commits"); // Log endpoint access
    // This endpoint will fail without the volume mount, but shouldn't cause a syntax error
    const command = 'git log --pretty=format:"%h | %an | %ar | %s" -n 15';
    const options = { cwd: '/usr/src/project' }; // Execute in the mounted project volume

    exec(command, options, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing git log command:');
            console.error('Message:', error.message);
            console.error('Stderr:', stderr || 'N/A');
            const isNotRepoError = (stderr && stderr.toLowerCase().includes("not a git repository")) ||
                                 (error.message && error.message.toLowerCase().includes("not a git repository")) ||
                                 (error.message && error.message.toLowerCase().includes("enoent")); // Also check for "No such file or directory" if cwd doesn't exist

            if (isNotRepoError) {
                return res.status(404).json({
                    error: 'Git repository not found or project directory not accessible.',
                    details: 'Ensure the project root volume is correctly mounted in docker-compose.yml and contains a .git directory.'
                });
            } else {
                return res.status(500).json({
                    error: 'Failed to execute git log command.',
                    details: error.message,
                    stderr: stderr
                });
            }
        }
        try {
            const commits = stdout.trim().split('\n')
                .filter(line => line.trim() !== '')
                .map(line => {
                    const parts = line.split(' | ');
                    const hash = parts[0] || 'N/A';
                    const author = parts[1] || 'N/A';
                    const date = parts[2] || 'N/A';
                    const subject = parts.length > 3 ? parts.slice(3).join(' | ') : (parts[3] || 'N/A');
                    return { hash, author, date, subject };
                });
            res.json(commits);
        } catch (parseError) {
            console.error('Error parsing git log output:', parseError);
            console.error('Stdout from git log:', stdout);
            res.status(500).json({
                error: 'Failed to parse git log output.',
                details: parseError.message
            });
        }
    });
});


// --- Root Route ---
// Serve index.html for the root path
app.get('/', (req, res) => {
    console.log("Received request for /"); // Log endpoint access
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
        console.error("Error sending index.html:", err);
        res.status(500).send("Error loading dashboard.");
    }
});

// --- Start Server ---
try {
    app.listen(port, () => {
        console.log(`Support Dashboard server listening at http://localhost:${port}`);
    });
} catch (err) {
    console.error("Error starting server listener:", err);
    process.exit(1); // Exit if server can't even start listening
}

console.log("--- FULL SERVER.JS LOADED ---"); // Diagnostic log
