const addBtn = document.getElementById('addBtn');
const usernameInput = document.getElementById('usernameInput');
const userGrid = document.getElementById('userGrid');
const loadingState = document.getElementById('loadingState');
const lastUpdatedEl = document.getElementById('lastUpdated');

// State
let usersData = [];

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

// Event Listeners
addBtn.addEventListener('click', handleAddUser);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddUser();
});

async function handleAddUser() {
    const username = usernameInput.value.trim();
    if (!username) return;

    if (usersData.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert('User already added!');
        return;
    }

    loadingState.style.display = 'block';
    addBtn.disabled = true;

    try {
        const data = await fetchUserData(username);
        if (data.error) throw new Error(data.error);

        usersData.push(processUserData(username, data));
        saveUsers();
        renderLeaderboard();
        usernameInput.value = '';
    } catch (err) {
        alert('Failed to add user: ' + err.message);
    } finally {
        loadingState.style.display = 'none';
        addBtn.disabled = false;
    }
}

async function fetchUserData(username) {
    const response = await fetch(`/api/user/${username}`);
    return await response.json();
}

function processUserData(username, data) {
    const stats = data.submitStats.acSubmissionNum;
    const total = stats.find(s => s.difficulty === 'All').count;
    const easy = stats.find(s => s.difficulty === 'Easy').count;
    const medium = stats.find(s => s.difficulty === 'Medium').count;
    const hard = stats.find(s => s.difficulty === 'Hard').count;

    // Calculate total solves for breakdown bar calculation
    // const totalForBar = easy + medium + hard; // usually equal to total

    return {
        username,
        totalSolved: total,
        easy,
        medium,
        hard,
        globalRank: data.profile.ranking,
        attendedContests: data.userContestRanking ? data.userContestRanking.attendedContestsCount : 0,
        solvedToday: calculateSolvedToday(data.recentSubmissionList), // Placeholder logic needed
        lastSolved: data.recentSubmissionList.length > 0 ? new Date(data.recentSubmissionList[0].timestamp * 1000) : null,
        activeNow: true // Mock for design match
    };
}

function calculateSolvedToday(submissions) {
    if (!submissions || submissions.length === 0) return 0;
    const today = new Date().setHours(0, 0, 0, 0);
    return submissions.filter(sub => {
        const subDate = new Date(sub.timestamp * 1000).setHours(0, 0, 0, 0);
        return subDate === today;
    }).length;
}

function saveUsers() {
    localStorage.setItem('leetcode-users', JSON.stringify(usersData.map(u => u.username)));
}

async function loadUsers() {
    const saved = JSON.parse(localStorage.getItem('leetcode-users') || '[]');
    if (saved.length === 0) return;

    loadingState.style.display = 'block';
    usersData = [];

    // Parallel fetch for speed
    const promises = saved.map(username => fetchUserData(username)
        .then(data => {
            if (!data.error) {
                return processUserData(username, data);
            }
            return null;
        })
        .catch(e => null)
    );

    const results = await Promise.all(promises);
    usersData = results.filter(u => u !== null);

    renderLeaderboard();
    loadingState.style.display = 'none';
    lastUpdatedEl.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
}

function renderLeaderboard() {
    // Sort by Total Solved (desc)
    usersData.sort((a, b) => b.totalSolved - a.totalSolved);

    userGrid.innerHTML = '';

    usersData.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.className = 'user-row';

        // Add specific classes to cells for Mobile targeting
        tr.innerHTML = `
            <td class="rank-cell">
                <div class="rank-badge rank-${index + 1}">${index + 1}</div>
            </td>
            <td class="user-cell">
                <div class="user-info">
                    <div class="avatar">${user.username[0].toUpperCase()}</div>
                    <div>
                        <a href="https://leetcode.com/${user.username}" target="_blank" class="username">${user.username}</a>
                        <div class="status-indicator mobile-only">
                            <span class="status-dot"></span> Active Now
                        </div>
                    </div>
                </div>
            </td>
            <td class="today-cell">
                <span style="color: #2da44e; font-weight: bold;">
                    ${user.solvedToday} <i class="fa-solid fa-fire"></i>
                </span>
            </td>
            <td class="total-cell">
                <strong>${user.totalSolved}</strong>
            </td>
            <td class="global-rank-cell">
                #${parseInt(user.globalRank).toLocaleString()}
            </td>
            <td class="contests-cell">${user.attendedContests}</td>
            <td class="diff-cell">
                <div class="diff-bar">
                    <div class="diff-easy" style="width: ${(user.easy / user.totalSolved) * 100}%"></div>
                    <div class="diff-medium" style="width: ${(user.medium / user.totalSolved) * 100}%"></div>
                    <div class="diff-hard" style="width: ${(user.hard / user.totalSolved) * 100}%"></div>
                </div>
                <div class="sub-text">E: ${user.easy} M: ${user.medium} H: ${user.hard}</div>
            </td>
            <td class="last-cell">
                ${user.lastSolved ? timeAgo(user.lastSolved) : 'Never'}
            </td>
            <td class="actions-cell">
                <button class="delete-btn" onclick="removeUser('${user.username}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        userGrid.appendChild(tr);
    });
}

function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

window.removeUser = function (username) {
    if (confirm('Remove ' + username + '?')) {
        usersData = usersData.filter(u => u.username !== username);
        saveUsers();
        renderLeaderboard();
    }
}

// Export functions (basic stubs)
document.getElementById('downloadCsv').addEventListener('click', () => alert('CSV Export not implemented'));
document.getElementById('downloadExcel').addEventListener('click', () => alert('Excel Export not implemented'));
document.getElementById('downloadPdf').addEventListener('click', () => alert('PDF Export not implemented'));
