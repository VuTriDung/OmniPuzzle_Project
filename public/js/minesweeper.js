const CONFIG = {
    easy: { rows: 9, cols: 9, mines: 10, points: 5 },
    medium: { rows: 16, cols: 16, mines: 40, points: 15 },
    hard: { rows: 20, cols: 20, mines: 80, points: 30 }
};

let currentDiff = 'easy';
let board = [];
let isGameOver = false;
let firstClick = true;
let score = 0;
let timeElapsed = 0;
let timerInterval = null;
let revealedCount = 0;
let flagsPlaced = 0;

const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const gridContainer = document.getElementById('grid-container');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const minesLeftEl = document.getElementById('mines-left');

function startGame(difficulty) {
    currentDiff = difficulty;
    isGameOver = false;
    firstClick = true;
    score = 0;
    timeElapsed = 0;
    revealedCount = 0;
    flagsPlaced = 0;
    board = [];

    introScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    updateUI();

    clearInterval(timerInterval);
    timerEl.innerText = "00:00";

    initBoard();
    renderBoard();
}

function resetGame() {
    clearInterval(timerInterval);
    gameScreen.classList.add('hidden');
    introScreen.classList.remove('hidden');
}

function initBoard() {
    const { rows, cols } = CONFIG[currentDiff];
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            row.push({ r: r, c: c, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 });
        }
        board.push(row);
    }
}

function renderBoard() {
    const { rows, cols } = CONFIG[currentDiff];
    gridContainer.innerHTML = '';
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gridContainer.style.gap = '2px';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellEl = document.createElement('div');
            cellEl.classList.add('w-full', 'h-full', 'bg-sakura-100', 'hover:bg-sakura-200', 'rounded-sm', 'cursor-pointer', 'flex', 'items-center', 'justify-center', 'font-bold', 'text-sm');
            cellEl.dataset.r = r;
            cellEl.dataset.c = c;
            
            cellEl.addEventListener('click', () => handleCellClick(r, c));
            cellEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(r, c);
            });

            gridContainer.appendChild(cellEl);
        }
    }
}

function placeMines(firstR, firstC) {
    const { rows, cols, mines } = CONFIG[currentDiff];
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!board[r][c].isMine && (r !== firstR || c !== firstC)) {
            board[r][c].isMine = true;
            minesPlaced++;
        }
    }
    calculateNeighbors();
}

function calculateNeighbors() {
    const { rows, cols } = CONFIG[currentDiff];
    const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].isMine) continue;
            let count = 0;
            directions.forEach(([dr, dc]) => {
                let nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) count++;
            });
            board[r][c].neighborMines = count;
        }
    }
}

function handleCellClick(r, c) {
    if (isGameOver || board[r][c].isRevealed || board[r][c].isFlagged) return;

    if (firstClick) {
        firstClick = false;
        placeMines(r, c);
        timerInterval = setInterval(() => {
            timeElapsed++;
            let m = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
            let s = String(timeElapsed % 60).padStart(2, '0');
            timerEl.innerText = `${m}:${s}`;
        }, 1000);
    }

    if (board[r][c].isMine) {
        gameOver(false); 
    } else {
        revealCell(r, c);
        checkWinCondition();
    }
}

function handleRightClick(r, c) {
    if (isGameOver || board[r][c].isRevealed) return;
    board[r][c].isFlagged = !board[r][c].isFlagged;
    flagsPlaced += board[r][c].isFlagged ? 1 : -1;
    updateVisuals();
    updateUI();
}

function revealCell(r, c) {
    const { rows, cols, points } = CONFIG[currentDiff];
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c].isRevealed || board[r][c].isFlagged) return;

    board[r][c].isRevealed = true;
    revealedCount++;
    score += points; 
    updateVisuals();
    updateUI();

    if (board[r][c].neighborMines === 0) {
        const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
        directions.forEach(([dr, dc]) => revealCell(r + dr, c + dc));
    }
}

function updateVisuals() {
    const { rows, cols } = CONFIG[currentDiff];
    const cells = gridContainer.children;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const index = r * cols + c;
            const cellEl = cells[index];
            const cellData = board[r][c];

            if (cellData.isRevealed) {
                cellEl.classList.remove('bg-sakura-100', 'hover:bg-sakura-200', 'cursor-pointer');
                cellEl.classList.add('bg-white', 'cursor-default');
                if (cellData.isMine) {
                    cellEl.classList.add('bg-red-500');
                    cellEl.innerText = '💣';
                } else if (cellData.neighborMines > 0) {
                    cellEl.innerText = cellData.neighborMines;
                    const colors = ['','text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500', 'text-yellow-600', 'text-cyan-500', 'text-black', 'text-gray-500'];
                    cellEl.classList.add(colors[cellData.neighborMines]);
                }
            } else if (cellData.isFlagged) {
                cellEl.innerText = '🚩';
            } else {
                cellEl.innerText = '';
            }
        }
    }
}

function updateUI() {
    scoreEl.innerText = score;
    minesLeftEl.innerText = CONFIG[currentDiff].mines - flagsPlaced;
}

function checkWinCondition() {
    const { rows, cols, mines } = CONFIG[currentDiff];
    if (revealedCount === (rows * cols - mines)) gameOver(true);
}

function gameOver(isWin) {
    isGameOver = true;
    clearInterval(timerInterval);

    if (!isWin) {
        score = 0; 
        updateUI();
        const { rows, cols } = CONFIG[currentDiff];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].isMine) board[r][c].isRevealed = true;
            }
        }
        updateVisuals();
        setTimeout(() => alert('BÙM! Bạn đã đạp phải mìn. Điểm của bạn về 0.'), 100);
    } else {
        setTimeout(() => alert(`Chúc mừng! Bạn đã gỡ sạch mìn trong ${timerEl.innerText}.\nĐiểm số: ${score}`), 100);
    }
    submitScoreToPHP(isWin);
}

function submitScoreToPHP(isWin) {
    fetch('/game/submitScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            game: 'minesweeper', difficulty: currentDiff, score: score, time: timeElapsed * 1000, isWin: isWin
        })
    }).then(res => res.json()).then(data => console.log('Server response:', data)).catch(err => console.error('Lỗi:', err));
}