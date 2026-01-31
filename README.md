# LeetCode Tracker

A realtime dashboard to track and compare LeetCode progress with friends. Monitor daily streaks, problem-solving stats, and global rankings in a unified interface.

## Features

- **friend Tracking**: Add unlimited LeetCode users to your personal leaderboard.
- **Real-Time Data**: Live stats fetched directly from LeetCode's GraphQL API.
- **Comprehensive Stats**:
  - Global Ranking
  - Total Questions Solved (Easy/Medium/Hard breakdown)
  - Contest Rating & Attendance
  - Daily/Total Active Days
- **Export functionality**: Download leaderboard data in CSV, Excel (XLSX), or PDF formats.
- **Modern UI**: Dark mode aesthetic with glassmorphism effects and animated backgrounds.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)

## Installation

1.  **Clone the repository** (or download the files):
    ```bash
    git clone <repository_url>
    cd leetcode-tracker
    ```

2.  **No external dependencies required**:
    This project uses standard Node.js modules (`http`, `https`, `fs`, `path`). You do not need to run `npm install` unless you are adding new packages.

## Usage

1.  **Start the server**:
    ```bash
    node server.js
    ```

2.  **Access the Dashboard**:
    Open your browser and navigate to:
    [http://localhost:3000](http://localhost:3000)

3.  **Add Users**:
    - Enter a valid LeetCode username in the input field.
    - Click "Add User" to fetch their stats.
    - Profiles are saved locally for your convenience.

## Project Structure

- **`server.js`**: A lightweight Node.js server that acts as a proxy for the LeetCode API to handle CORS and serves static files.
- **`index.html`**: The main dashboard structure.
- **`style.css`**: Custom styling, animations, and responsive layout.
- **`script.js`**: Frontend logic for API integration, data visualization, and export features.

## Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js
- **Libraries (via CDN)**:
  - [SheetJS](https://sheetjs.com/) (Excel Export)
  - [jsPDF](https://github.com/parallax/jsPDF) (PDF Export)
  - [FontAwesome](https://fontawesome.com/) (Icons)

## License

This project is open-source and available under the MIT License.
