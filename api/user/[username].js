const https = require('https');

// Vercel Serverless Function
// Handles GET /api/user/[username]
export default async function handler(req, res) {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const leetCodeUrl = 'https://leetcode.com/graphql';

    // Exact same query as local server.js
    const query = `
    query getUserProfile($username: String!) {
        matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
        }
        recentSubmissionList(username: $username, limit: 20) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
        }
    }
    `;

    const payload = JSON.stringify({
        query,
        variables: { username }
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Content-Length': Buffer.byteLength(payload) // Good practice
        }
    };

    return new Promise((resolve, reject) => {
        const proxyReq = https.request(leetCodeUrl, options, (proxyRes) => {
            let data = '';

            // Forward status code
            res.status(proxyRes.statusCode);

            proxyRes.on('data', (chunk) => {
                data += chunk;
            });

            proxyRes.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    res.json(jsonData);
                    resolve();
                } catch (e) {
                    res.status(500).json({ error: 'Failed to parse response from LeetCode' });
                    resolve();
                }
            });
        });

        proxyReq.on('error', (e) => {
            res.status(500).json({ error: e.message });
            resolve();
        });

        proxyReq.write(payload);
        proxyReq.end();
    });
}
