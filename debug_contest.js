// No require needed for Node 18+
async function testQuery(username) {
    const leetCodeUrl = 'https://leetcode.com/graphql';
    const query = `
    query getUserProfile($username: String!) {
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
        }
        userContestRankingHistory(username: $username) {
            attended
            rating
            contest {
                title
            }
        }
    }
    `;

    try {
        const response = await fetch(leetCodeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': `https://leetcode.com/u/${username}/`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                query,
                variables: { username }
            })
        });

        const data = await response.json();
        console.log(`Query Result for ${username}:`, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

// Test with users from the screenshot
testQuery('kalai_script');
testQuery('_NITHEESH');
