async function testQuery(username) {
    const leetCodeUrl = 'https://leetcode.com/graphql';
    const query = `
    query getUserProfile($username: String!) {
        matchedUser(username: $username) {
            profile {
                ranking
            }
        }
        userContestRanking(username: $username) {
            globalRanking
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

testQuery('kalai_script'); 
