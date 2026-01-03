const fs = require('fs');
const https = require('https');
const path = require('path');

const projectsPath = path.join(__dirname, '../src/content/projects.json');
const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

const CATEGORIES = {
    'Recent Projects': ['neural-dominion', 'tap-tap-fighters', 'network-ninja'],
    'Tools': ['mvvm-unity', 'camera-free-minimap', 'palm-unity', 'custom-editor', 'music-visualizer'],
    'My Learning Voyage': ['language-ai-assistant', 'techquest', 'tank-war', '2d-platformer', 'rubik-cube', 'ai-battle', 'space-shooter', 'fps-game']
};

const SUBCATEGORIES = {
    'AI': ['language-ai-assistant', 'techquest'],
    'Others': ['tank-war', '2d-platformer', 'rubik-cube', 'ai-battle', 'space-shooter', 'fps-game']
};

const IMAGE_MAP = {
    'neural-dominion': '/images/projects/neural-dominion.jpg',
    'tap-tap-fighters': '/images/projects/tap-tap-fighters.png',
    'network-ninja': '/images/projects/network-ninja.png',
    'mvvm-unity': '/images/projects/mvvm-unity.jpg',
    'camera-free-minimap': '/images/projects/camera-free-minimap.png',
    'palm-unity': '/images/projects/palm-unity.png',
    'language-ai-assistant': '/images/projects/language-ai-assistant.png',
    'techquest': '/images/projects/techquest.png',
    'music-visualizer': '/images/projects/music-visualizer.png',
    'tank-war': '/images/projects/tank-war.png',
    '2d-platformer': '/images/projects/2d-platformer.png',
    'rubik-cube': '/images/projects/rubik-cube.png',
    'ai-battle': '/images/projects/ai-battle.png',
    'custom-editor': '/images/projects/custom-editor.png',
    'space-shooter': '/images/projects/space-shooter.png',
    'fps-game': '/images/projects/fps-game.png'
};

function getRawUrl(githubLink) {
    if (!githubLink || githubLink === '#') return null;

    // Handle tree links: https://github.com/User/Repo/tree/Branch/SubDir
    // -> https://raw.githubusercontent.com/User/Repo/Branch/SubDir/README.md
    if (githubLink.includes('/tree/')) {
        return githubLink.replace('github.com', 'raw.githubusercontent.com').replace('/tree/', '/') + '/README.md';
    }

    // Handle root links: https://github.com/User/Repo
    // -> https://raw.githubusercontent.com/User/Repo/main/README.md (try main first)
    return githubLink.replace('github.com', 'raw.githubusercontent.com') + '/main/README.md';
}

function fetchContent(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                // Try master if main fails
                if (url.includes('/main/')) {
                    const masterUrl = url.replace('/main/', '/master/');
                    https.get(masterUrl, (res2) => {
                        if (res2.statusCode !== 200) {
                            resolve(null); // Return null if both fail
                            return;
                        }
                        let data = '';
                        res2.on('data', chunk => data += chunk);
                        res2.on('end', () => resolve(data));
                    });
                    return;
                }
                resolve(null);
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function updateProjects() {
    console.log('Starting project update...');

    for (const project of projectsData.projects) {
        console.log(`Processing ${project.title}...`);

        // Update Image
        if (IMAGE_MAP[project.id]) {
            project.image = IMAGE_MAP[project.id];
        }

        // Update Category
        for (const [cat, ids] of Object.entries(CATEGORIES)) {
            if (ids.includes(project.id)) {
                project.category = cat;
                break;
            }
        }

        // Update Subcategory
        if (project.category === 'My Learning Voyage') {
            for (const [sub, ids] of Object.entries(SUBCATEGORIES)) {
                if (ids.includes(project.id)) {
                    project.subcategory = sub;
                    break;
                }
            }
            if (!project.subcategory) project.subcategory = 'Others';
        }

        // Fetch README
        const rawUrl = getRawUrl(project.githubLink);
        if (rawUrl) {
            try {
                const content = await fetchContent(rawUrl);
                if (content) {
                    project.readmeContent = content;
                    console.log(`  Fetched README (${content.length} bytes)`);
                } else {
                    console.log(`  Failed to fetch README from ${rawUrl}`);
                    project.readmeContent = "# " + project.title + "\n\nDescription coming soon.";
                }
            } catch (e) {
                console.error(`  Error fetching ${rawUrl}: ${e.message}`);
            }
        }
    }

    fs.writeFileSync(projectsPath, JSON.stringify(projectsData, null, 4));
    console.log('Projects updated successfully!');
}

updateProjects();
