document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const logServiceSelect = document.getElementById('log-service-select');
    const fetchLogsBtn = document.getElementById('fetch-logs-btn');
    const logOutput = document.getElementById('log-output');

    // --- Navigation ---
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const activeSection = document.getElementById(sectionId);
        const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);

        if (activeSection) {
            activeSection.classList.add('active');
        }
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Load data for the section when it becomes active
        loadSectionData(sectionId);
    }

    // Navigate based on hash or default to dashboard
    const initialSection = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
    showSection(initialSection);

    // Add click listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = link.getAttribute('data-section');
            window.location.hash = sectionId; // Update hash for bookmarking/linking
            showSection(sectionId);
        });
    });

    // Function to allow navigating via buttons etc.
    window.navigateTo = (sectionId) => {
         window.location.hash = sectionId;
         showSection(sectionId);
    }

    // --- Data Loading ---
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`HTTP error! status: ${response.status}`, errorData);
                throw new Error(`Failed to fetch ${url}: ${errorData.error || response.statusText}`);
            }
            // Check content type before parsing
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return await response.json();
            } else {
                return await response.text(); // Handle plain text like logs or structure
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Display error to the user in the relevant section?
            return null; // Or handle error appropriately
        }
    }

    function loadSectionData(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                loadDashboardSummary();
                break;
            case 'service-status':
                loadServiceStatus();
                break;
            case 'log-viewer':
                populateLogServiceSelector(); // Populate dropdown when section loads
                break;
            case 'project-structure':
                loadProjectStructure();
                break;
            // Add cases for other sections like 'environment' when implemented
            case 'git-activity':
                loadGitCommits();
                break;

        }
    }

    // --- Specific Section Loaders ---

    async function loadDashboardSummary() {
        const summaryDiv = document.getElementById('dashboard-summary');
        summaryDiv.innerHTML = 'Loading summary...';
        const services = await fetchData('/api/services');
        if (services && Array.isArray(services)) {
            const totalServices = services.length;
            const runningServices = services.filter(s => s.State === 'running').length;
            const stoppedServices = totalServices - runningServices; // Simplified count

            summaryDiv.innerHTML = `
                <p><strong>Total Services Defined:</strong> ${totalServices}</p>
                <p><strong>Services Running:</strong> <span class="status status-running">${runningServices}</span></p>
                <p><strong>Services Stopped/Exited:</strong> <span class="status status-exited">${stoppedServices}</span></p>
            `;
        } else {
            summaryDiv.innerHTML = '<p>Error loading summary data.</p>';
        }
    }

    async function loadServiceStatus() {
        const tableBody = document.querySelector('#service-status-table tbody');
        tableBody.innerHTML = '<tr><td colspan="5">Loading service status...</td></tr>';
        const services = await fetchData('/api/services');

        if (services && Array.isArray(services)) {
            tableBody.innerHTML = ''; // Clear loading message
            if (services.length === 0) {
                 tableBody.innerHTML = '<tr><td colspan="5">No services found. Is Docker running and the socket mounted?</td></tr>';
                 return;
            }
            services.forEach(service => {
                const row = tableBody.insertRow();
                const status = service.State || 'unknown';
                const statusClass = getStatusClass(status);

                row.innerHTML = `
                    <td>${service.Names || 'N/A'}</td>
                    <td>${service.ID.substring(0, 12)}</td>
                    <td><span class="status ${statusClass}">${status}</span></td>
                    <td>${service.Ports || 'N/A'}</td>
                    <td>
                        <button onclick="navigateToLogViewer('${service.ID}')">View Logs</button>
                        <button disabled>Restart (TBD)</button>
                    </td>
                `;
            });
            // Also populate log viewer dropdown after fetching services
            populateLogServiceSelector(services);
        } else {
            tableBody.innerHTML = '<tr><td colspan="5">Error loading service status. Check server logs.</td></tr>';
        }
    }

     // Helper function to navigate and pre-select log viewer
     window.navigateToLogViewer = (containerId) => {
        navigateTo('log-viewer');
        // Small delay to ensure the section is visible and dropdown populated
        setTimeout(() => {
            const select = document.getElementById('log-service-select');
            if (select) {
                select.value = containerId;
                 // Optionally trigger log fetch immediately
                 // fetchLogs();
            }
        }, 100);
    }


    async function populateLogServiceSelector(services = null) {
        if (!services) {
            services = await fetchData('/api/services');
        }

        logServiceSelect.innerHTML = '<option value="">-- Select a Service --</option>'; // Reset

        if (services && Array.isArray(services)) {
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.ID; // Use Container ID for fetching logs
                option.textContent = `${service.Names || 'Unnamed Service'} (${service.ID.substring(0, 6)})`;
                logServiceSelect.appendChild(option);
            });
        } else {
             console.error("Could not populate log service selector: Failed to fetch services.");
        }
    }

    async function fetchLogs() {
        const selectedContainerId = logServiceSelect.value;
        if (!selectedContainerId) {
            logOutput.textContent = 'Please select a service first.';
            return;
        }
        logOutput.textContent = `Fetching logs for ${selectedContainerId.substring(0, 12)}...`;
        const logs = await fetchData(`/api/logs/${selectedContainerId}`);
        if (logs !== null) {
            logOutput.textContent = logs || '(No logs found or empty log output)';
        } else {
            logOutput.textContent = `Error fetching logs for ${selectedContainerId.substring(0, 12)}. Check server logs.`;
        }
    }

    fetchLogsBtn.addEventListener('click', fetchLogs);
    // TODO: Implement log tailing (WebSocket or polling)

    async function loadProjectStructure() {
        const outputElement = document.getElementById('project-structure-output');
        outputElement.textContent = 'Loading project structure...';
        const structure = await fetchData('/api/project-structure');
        if (structure !== null) {
            outputElement.textContent = structure;
        } else {
            outputElement.textContent = 'Error loading project structure.';
        }
    }

    function getStatusClass(status) {
        status = status.toLowerCase();
        if (status.includes('running') || status.includes('up')) return 'status-running';
        if (status.includes('exited') || status.includes('stopped')) return 'status-exited';
        if (status.includes('starting') || status.includes('restarting')) return 'status-starting';
        if (status.includes('paused')) return 'status-paused';
        return 'status-unknown';
    }


    async function loadGitCommits() {
        const commitList = document.getElementById('commit-list');
        commitList.innerHTML = '<li>Loading recent commits...</li>';
        const commits = await fetchData('/api/git/commits');

        if (commits && Array.isArray(commits)) {
            commitList.innerHTML = ''; // Clear loading message
            if (commits.length === 0) {
                commitList.innerHTML = '<li>No commits found or unable to read Git history.</li>';
                return;
            }
            commits.forEach(commit => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${commit.subject}</strong> <span class="commit-hash">(${commit.hash})</span><br>
                    <small>by ${commit.author}, ${commit.date}</small>
                `;
                commitList.appendChild(li);
            });
        } else if (commits && commits.error) {
             commitList.innerHTML = `<li>Error loading commits: ${commits.error} ${commits.details ? '('+commits.details+')' : ''}</li>`;
        } else {
            commitList.innerHTML = '<li>Error loading commit data. Check server logs.</li>';
        }
    }

});