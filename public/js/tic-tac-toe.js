// public/js/tic-tac-toe.js

const BOARD_SIZE = 15;
const CONFIG = {
    easy: { win: 50, lose: -50 },
    medium: { win: 100, lose: -100 },
    hard: { win: 200, lose: -200 }
};

// Trọng số cho thuật toán Heuristic (Phòng thủ được ưu tiên cao hơn một chút để AI khó chịu hơn)
const attackScores = [0, 3, 24, 243, 2197, 19773]; 
const defenseScores = [0, 4, 27, 256, 3125, 27000];

let currentDiff = 'easy';
let board = []; // 0: trống, 1: Người (X), 2: Máy (O)
let isGameOver = false;
let isPlayerTurn = true;
let timeElapsed = 0;
let timerInterval = null;

const boardEl = document.getElementById('caro-board');
const timerEl = document.getElementById('timer');
const turnEl = document.getElementById('turn-indicator');
const scoreDisplay = document.getElementById('score-display');

function startGame(difficulty) {
    currentDiff = difficulty;
    isGameOver = false;
    isPlayerTurn = true;
    timeElapsed = 0;
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));

    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    scoreDisplay.innerText = CONFIG[currentDiff].win;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeElapsed++;
        let m = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
        let s = String(timeElapsed % 60).padStart(2, '0');
        timerEl.innerText = `${m}:${s}`;
    }, 1000);

    renderBoard();
    updateTurnUI();
}

function resetGame() {
    clearInterval(timerInterval);
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('intro-screen').classList.remove('hidden');
}

function renderBoard() {
    boardEl.innerHTML = '';
    boardEl.style.display = 'grid';
    boardEl.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 35px)`;
    boardEl.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 35px)`;

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'caro-cell flex items-center justify-center';
            cell.dataset.r = r;
            cell.dataset.c = c;
            cell.addEventListener('click', () => playerMove(r, c));
            boardEl.appendChild(cell);
        }
    }
}

function updateTurnUI() {
    turnEl.innerText = isPlayerTurn ? "Bạn (X)" : "Máy đang nghĩ... (O)";
    turnEl.className = isPlayerTurn ? "text-sakura-600" : "text-blue-500";
}

// ================= LƯỢT CỦA NGƯỜI CHƠI =================
function playerMove(r, c) {
    if (isGameOver || !isPlayerTurn || board[r][c] !== 0) return;

    // Đánh X
    board[r][c] = 1;
    drawMove(r, c, 1);

    if (checkWin(r, c, 1)) {
        endGame(true);
    } else {
        isPlayerTurn = false;
        updateTurnUI();
        // Trì hoãn một chút cho giống máy đang suy nghĩ
        setTimeout(aiMove, 300); 
    }
}

function drawMove(r, c, player) {
    const index = r * BOARD_SIZE + c;
    const cell = boardEl.children[index];
    if (player === 1) {
        cell.innerText = 'X';
        cell.classList.add('caro-x');
    } else {
        cell.innerText = 'O';
        cell.classList.add('caro-o');
    }
}

// ================= BỘ NÃO CỦA AI (HEURISTIC) =================
function aiMove() {
    if (isGameOver) return;

    let bestMove = { r: -1, c: -1 };
    
    // Mức độ Dễ: 40% đánh ngẫu nhiên ô trống xung quanh
    if (currentDiff === 'easy' && Math.random() < 0.4) {
        bestMove = getRandomMove();
    } else {
        bestMove = getBestHeuristicMove();
    }

    // Nếu không tìm được (bàn cờ trống hoàn toàn), đánh ngẫu nhiên giữa bàn
    if (bestMove.r === -1) {
        bestMove = { r: Math.floor(BOARD_SIZE/2), c: Math.floor(BOARD_SIZE/2) };
    }

    // Đánh O
    board[bestMove.r][bestMove.c] = 2;
    drawMove(bestMove.r, bestMove.c, 2);

    if (checkWin(bestMove.r, bestMove.c, 2)) {
        endGame(false);
    } else {
        isPlayerTurn = true;
        updateTurnUI();
    }
}

function getRandomMove() {
    let emptyCells = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 0) emptyCells.push({r, c});
        }
    }
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : {r: -1, c: -1};
}

// Thuật toán quét và chấm điểm toàn bàn cờ
function getBestHeuristicMove() {
    let maxScore = -Infinity;
    let bestMoves = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== 0) continue; // Chỉ quét ô trống

            let attackPoint = evaluatePosition(r, c, 2); // Điểm tấn công của máy
            let defensePoint = evaluatePosition(r, c, 1); // Điểm phòng thủ (phá người chơi)

            // Mức Trung Bình: Máy tính toán nông hơn, giảm điểm phòng thủ
            if (currentDiff === 'medium') defensePoint *= 0.8; 

            let totalScore = attackPoint + defensePoint;

            if (totalScore > maxScore) {
                maxScore = totalScore;
                bestMoves = [{ r, c }];
            } else if (totalScore === maxScore) {
                bestMoves.push({ r, c }); // Lưu các nước đi có điểm bằng nhau để random
            }
        }
    }
    // Lấy ngẫu nhiên trong số các nước đi tốt nhất để tránh AI đi rập khuôn
    return bestMoves.length > 0 ? bestMoves[Math.floor(Math.random() * bestMoves.length)] : { r: -1, c: -1 };
}

// Đếm số quân liên tiếp theo 4 hướng
function evaluatePosition(r, c, player) {
    let score = 0;
    const directions = [ [0, 1], [1, 0], [1, 1], [1, -1] ]; // Ngang, Dọc, Chéo xuôi, Chéo ngược

    for (let dir of directions) {
        let consecutive = 0;
        let blocked = 0;

        // Quét chiều dương
        for (let i = 1; i <= 4; i++) {
            let nr = r + dir[0] * i, nc = c + dir[1] * i;
            if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) { blocked++; break; }
            if (board[nr][nc] === player) consecutive++;
            else if (board[nr][nc] !== 0) { blocked++; break; }
            else break; // Gặp ô trống
        }

        // Quét chiều âm
        for (let i = 1; i <= 4; i++) {
            let nr = r - dir[0] * i, nc = c - dir[1] * i;
            if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) { blocked++; break; }
            if (board[nr][nc] === player) consecutive++;
            else if (board[nr][nc] !== 0) { blocked++; break; }
            else break; // Gặp ô trống
        }

        if (blocked === 2) continue; // Bị chặn 2 đầu thì vô giá trị
        
        let pointArr = (player === 2) ? attackScores : defenseScores;
        if (consecutive >= 5) score += pointArr[5];
        else score += pointArr[consecutive];
    }
    return score;
}

// ================= KIỂM TRA THẮNG THUA =================
function checkWin(r, c, player) {
    const directions = [ [0, 1], [1, 0], [1, 1], [1, -1] ];
    for (let dir of directions) {
        let count = 1;
        // Đếm tới
        for (let i = 1; i <= 4; i++) {
            let nr = r + dir[0] * i, nc = c + dir[1] * i;
            if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE || board[nr][nc] !== player) break;
            count++;
        }
        // Đếm lùi
        for (let i = 1; i <= 4; i++) {
            let nr = r - dir[0] * i, nc = c - dir[1] * i;
            if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE || board[nr][nc] !== player) break;
            count++;
        }
        if (count >= 5) return true;
    }
    return false;
}

function endGame(isWin) {
    isGameOver = true;
    clearInterval(timerInterval);
    
    let finalScore = isWin ? CONFIG[currentDiff].win : CONFIG[currentDiff].lose;

    setTimeout(() => {
        if (isWin) {
            alert(`🎉 CHÚC MỪNG! Bạn đã đánh bại AI.\nĐiểm nhận được: +${finalScore}`);
        } else {
            alert(`💀 BẠN ĐÃ THUA! AI quá thông minh.\nBạn bị trừ: ${finalScore} điểm.`);
        }
    }, 200);

    // Gửi dữ liệu lên API
    fetch('/game/submitScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            game: 'tic-tac-toe', 
            difficulty: currentDiff, 
            score: finalScore, 
            time: timeElapsed * 1000, 
            isWin: isWin
        })
    }).then(res => res.json()).then(console.log);
}