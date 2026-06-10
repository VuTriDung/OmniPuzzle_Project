// public/js/sudoku.js

const CONFIG = {
    easy: { emptyCells: 35, points: 5 },
    medium: { emptyCells: 45, points: 15 },
    hard: { emptyCells: 55, points: 30 }
};

let currentDiff = 'easy';
let solutionBoard = []; // Mảng chứa đáp án đúng 100%
let gameBoard = [];     // Mảng hiển thị cho người chơi (có số 0 là ô trống)
let userNotes = [];     // Mảng 3 chiều lưu các số nháp [r][c] = [1,2,5...]
let isGameOver = false;
let score = 0;
let lives = 3;
let timeElapsed = 0;
let timerInterval = null;
let selectedCell = null; // Lưu tọa độ {r, c} của ô đang được chọn
let isNoteMode = false;

const boardEl = document.getElementById('sudoku-board');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const btnNote = document.getElementById('btn-note');

// ================= 1. KHỞI TẠO GAME =================
function startGame(difficulty) {
    currentDiff = difficulty;
    isGameOver = false;
    score = 0;
    lives = 3;
    timeElapsed = 0;
    selectedCell = null;
    isNoteMode = false;
    updateNoteUI();

    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeElapsed++;
        let m = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
        let s = String(timeElapsed % 60).padStart(2, '0');
        timerEl.innerText = `${m}:${s}`;
    }, 1000);

    generateSudoku();
    renderBoard();
    updateUI();
}

function resetGame() {
    clearInterval(timerInterval);
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('intro-screen').classList.remove('hidden');
}

// ================= 2. THUẬT TOÁN TẠO ĐỀ SUDOKU =================
function generateSudoku() {
    // Khởi tạo mảng rỗng
    solutionBoard = Array(9).fill().map(() => Array(9).fill(0));
    gameBoard = Array(9).fill().map(() => Array(9).fill(0));
    userNotes = Array(9).fill().map(() => Array(9).fill().map(() => []));

    // Bước 1: Điền ngẫu nhiên 3 khối đường chéo (vì chúng độc lập nhau)
    fillDiagonalBoxes();
    // Bước 2: Dùng Backtracking (quay lui) giải nốt phần còn lại để có đáp án chuẩn
    solveSudoku(solutionBoard);
    // Bước 3: Copy đáp án ra gameBoard, rồi đục lỗ theo độ khó
    for(let r=0; r<9; r++) {
        for(let c=0; c<9; c++) {
            gameBoard[r][c] = solutionBoard[r][c];
        }
    }
    removeNumbers(CONFIG[currentDiff].emptyCells);
}

function fillDiagonalBoxes() {
    for (let i = 0; i < 9; i = i + 3) fillBox(i, i);
}

function fillBox(rowStart, colStart) {
    let num;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            do {
                num = Math.floor(Math.random() * 9) + 1;
            } while (!isSafeInBox(rowStart, colStart, num));
            solutionBoard[rowStart + i][colStart + j] = num;
        }
    }
}

function isSafeInBox(rowStart, colStart, num) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (solutionBoard[rowStart + i][colStart + j] === num) return false;
        }
    }
    return true;
}

function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    }
    let startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}

function solveSudoku(board) {
    let empty = findEmpty(board);
    if (!empty) return true;
    let [row, col] = empty;

    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

function findEmpty(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) return [r, c];
        }
    }
    return null;
}

function removeNumbers(count) {
    while (count > 0) {
        let cellId = Math.floor(Math.random() * 81);
        let r = Math.floor(cellId / 9);
        let c = cellId % 9;
        if (gameBoard[r][c] !== 0) {
            gameBoard[r][c] = 0;
            count--;
        }
    }
}

// ================= 3. RENDER VÀ HIỆU ỨNG (HIGHLIGHT) =================
function renderBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell w-full h-full flex items-center justify-center text-xl sm:text-2xl font-bold transition duration-150';
            
            // Vẽ viền chia khối 3x3
            if (r === 0) cell.classList.add('border-t-thick');
            if (c === 0) cell.classList.add('border-l-thick');
            if ((r + 1) % 3 === 0) cell.classList.add('border-b-thick');
            if ((c + 1) % 3 === 0) cell.classList.add('border-r-thick');

            cell.dataset.r = r;
            cell.dataset.c = c;
            
            cell.addEventListener('click', () => selectCell(r, c));
            boardEl.appendChild(cell);
        }
    }
    refreshCells();
}

function refreshCells() {
    const cells = boardEl.children;
    let selectedVal = null;
    if (selectedCell) {
        selectedVal = gameBoard[selectedCell.r][selectedCell.c];
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = cells[r * 9 + c];
            let val = gameBoard[r][c];

            // Reset CSS classes
            cell.classList.remove('bg-sakura-100', 'bg-sakura-200', 'bg-sakura-300', 'text-gray-800', 'text-sakura-600');
            cell.innerHTML = '';

            // Xử lý Hiển thị Số hoặc Nháp
            if (val !== 0) {
                cell.innerText = val;
                // Nếu là số đề bài cho (khớp với solution và ban đầu đã có)
                // Để đơn giản, ta coi số đang có trên gameBoard lúc này là màu đen (đề) hoặc màu xanh/hồng (người chơi điền đúng)
                // Thực tế để phân biệt đề bài và người chơi, bạn có thể thêm logic. Ở đây ta làm phẳng.
                cell.classList.add('text-gray-800'); 
            } else {
                // Hiển thị lưới nháp (Note mode)
                let notes = userNotes[r][c];
                if (notes.length > 0) {
                    let noteGrid = document.createElement('div');
                    noteGrid.className = 'grid grid-cols-3 grid-rows-3 w-full h-full p-[2px]';
                    for(let i=1; i<=9; i++) {
                        let span = document.createElement('span');
                        span.className = 'flex items-center justify-center text-[10px] sm:text-xs text-gray-400 font-normal';
                        span.innerText = notes.includes(i) ? i : '';
                        noteGrid.appendChild(span);
                    }
                    cell.appendChild(noteGrid);
                }
            }

            // --- XỬ LÝ HIGHLIGHT (Hiệu ứng) ---
            if (selectedCell) {
                // Highlight ô đang chọn
                if (r === selectedCell.r && c === selectedCell.c) {
                    cell.classList.add('bg-sakura-300');
                } 
                // Highlight Hàng, Cột và Khối của ô đang chọn
                else if (r === selectedCell.r || c === selectedCell.c || 
                        (Math.floor(r/3) === Math.floor(selectedCell.r/3) && Math.floor(c/3) === Math.floor(selectedCell.c/3))) {
                    cell.classList.add('bg-sakura-100');
                }
                
                // Highlight các số GIỐNG NHAU trên toàn bảng
                if (selectedVal !== 0 && val === selectedVal && !(r === selectedCell.r && c === selectedCell.c)) {
                    cell.classList.add('bg-sakura-200');
                }
            }
        }
    }
}

function selectCell(r, c) {
    if (isGameOver) return;
    selectedCell = {r, c};
    refreshCells();
}

// ================= 4. XỬ LÝ NHẬP LIỆU =================
function toggleNoteMode() {
    isNoteMode = !isNoteMode;
    updateNoteUI();
}

function updateNoteUI() {
    btnNote.classList.toggle('bg-sakura-200', isNoteMode);
    btnNote.classList.toggle('text-sakura-700', isNoteMode);
    btnNote.innerHTML = isNoteMode ? `<span>✏️</span> Nháp: BẬT` : `<span>✏️</span> Nháp: Tắt`;
}

function inputNumber(num) {
    if (isGameOver || !selectedCell) return;
    let r = selectedCell.r;
    let c = selectedCell.c;

    // Không cho phép đè số đã chốt
    if (gameBoard[r][c] !== 0) return;

    if (isNoteMode) {
        // Bật/tắt số nháp
        let idx = userNotes[r][c].indexOf(num);
        if (idx > -1) userNotes[r][c].splice(idx, 1);
        else userNotes[r][c].push(num);
        refreshCells();
    } else {
        // Nhập số chính thức
        if (num === solutionBoard[r][c]) {
            // ĐÚNG: Điền số, cộng điểm
            gameBoard[r][c] = num;
            userNotes[r][c] = []; // Xóa nháp
            score += CONFIG[currentDiff].points;
            updateUI();
            refreshCells();
            checkWin();
        } else {
            // SAI: Mất mạng, báo đỏ
            lives--;
            updateUI();
            
            // Hiệu ứng nhấp nháy đỏ
            const cells = boardEl.children;
            const cellEl = cells[r * 9 + c];
            cellEl.classList.add('bg-red-500', 'text-white');
            cellEl.innerText = num;
            setTimeout(() => {
                refreshCells();
                if (lives <= 0) gameOver(false);
            }, 500);
        }
    }
}

function eraseCell() {
    if (isGameOver || !selectedCell) return;
    let r = selectedCell.r;
    let c = selectedCell.c;
    // Chỉ được xóa nháp, không xóa số đã chốt
    if (gameBoard[r][c] === 0) {
        userNotes[r][c] = [];
        refreshCells();
    }
}

// Hỗ trợ nhập bằng bàn phím máy tính
window.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') inputNumber(parseInt(e.key));
    if (e.key === 'n' || e.key === 'N') toggleNoteMode();
    if (e.key === 'Backspace' || e.key === 'Delete') eraseCell();
});

// ================= 5. KẾT THÚC GAME =================
function updateUI() {
    scoreEl.innerText = score;
    let heartStr = '';
    for(let i=0; i<3; i++) heartStr += (i < lives) ? '❤️' : '🤍';
    livesEl.innerText = heartStr;
}

function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (gameBoard[r][c] === 0) return; // Vẫn còn ô trống
        }
    }
    gameOver(true); // Kín bảng và đúng hết -> Thắng
}

function gameOver(isWin) {
    isGameOver = true;
    clearInterval(timerInterval);

    if (!isWin) {
        score = 0;
        updateUI();
        setTimeout(() => alert('BẠN ĐÃ HẾT MẠNG!\nGame Over. Điểm của bạn về 0.'), 200);
    } else {
        setTimeout(() => alert(`CHÚC MỪNG!\nBạn đã giải xong Sudoku trong ${timerEl.innerText}.\nĐiểm số: ${score}`), 200);
    }

    // Gửi điểm lên server giống hệt Dò Mìn
    fetch('/game/submitScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            game: 'sudoku', difficulty: currentDiff, score: score, time: timeElapsed * 1000, isWin: isWin
        })
    }).then(res => res.json()).then(data => console.log(data));
}