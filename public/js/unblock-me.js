// public/js/unblock-me.js

const CONFIG = {
    easy: { score: 50 },
    medium: { score: 100 },
    hard: { score: 200 }
};

// Cấu hình đề: x, y (tọa độ từ 0-5), w (chiều rộng), h (chiều cao)
// Khối đích (isTarget) luôn nằm ngang ở hàng y=2
const LEVELS = {
    easy: [
        { id: 1, isTarget: true, x: 0, y: 2, w: 2, h: 1 },
        { id: 2, x: 2, y: 1, w: 1, h: 3 },
        { id: 3, x: 2, y: 4, w: 2, h: 1 },
        { id: 4, x: 4, y: 1, w: 1, h: 2 },
        { id: 5, x: 0, y: 4, w: 1, h: 2 }
    ],
    medium: [
        { id: 1, isTarget: true, x: 0, y: 2, w: 2, h: 1 },
        { id: 2, x: 2, y: 0, w: 1, h: 3 },
        { id: 3, x: 3, y: 1, w: 1, h: 2 },
        { id: 4, x: 3, y: 3, w: 2, h: 1 },
        { id: 5, x: 5, y: 0, w: 1, h: 3 },
        { id: 6, x: 0, y: 4, w: 3, h: 1 },
        { id: 7, x: 4, y: 4, w: 1, h: 2 }
    ],
    hard: [
        { id: 1, isTarget: true, x: 1, y: 2, w: 2, h: 1 },
        { id: 2, x: 0, y: 0, w: 1, h: 3 },
        { id: 3, x: 1, y: 0, w: 2, h: 1 },
        { id: 4, x: 3, y: 0, w: 1, h: 3 },
        { id: 5, x: 4, y: 1, w: 2, h: 1 },
        { id: 6, x: 5, y: 2, w: 1, h: 3 },
        { id: 7, x: 1, y: 3, w: 2, h: 1 },
        { id: 8, x: 0, y: 4, w: 3, h: 1 },
        { id: 9, x: 3, y: 4, w: 1, h: 2 }
    ]
};

const CELL_SIZE = 50; // Kích thước 1 ô cờ (px)
let currentDiff = 'easy';
let blocks = [];
let moves = 0;
let timeElapsed = 0;
let timerInterval = null;
let isGameOver = false;

// Trạng thái kéo thả
let activeBlock = null;
let startMousePos = 0;
let startBlockPos = 0;
let minLimit = 0;
let maxLimit = 0;

const boardEl = document.getElementById('board-container');
const moveEl = document.getElementById('move-count');
const timerEl = document.getElementById('timer');

function startGame(difficulty) {
    currentDiff = difficulty;
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('score-display').innerText = CONFIG[difficulty].score;
    
    resetLevel();
}

function resetLevel() {
    isGameOver = false;
    moves = 0;
    timeElapsed = 0;
    moveEl.innerText = moves;
    timerEl.innerText = "00:00";
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeElapsed++;
        let m = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
        let s = String(timeElapsed % 60).padStart(2, '0');
        timerEl.innerText = `${m}:${s}`;
    }, 1000);

    // Copy dữ liệu đề bài
    blocks = JSON.parse(JSON.stringify(LEVELS[currentDiff]));
    renderBoard();
}

function quitGame() {
    clearInterval(timerInterval);
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('intro-screen').classList.remove('hidden');
}

// ================= RENDER GIAO DIỆN =================
function renderBoard() {
    boardEl.innerHTML = '';
    
    blocks.forEach((blk, index) => {
        const el = document.createElement('div');
        el.className = `block-element flex items-center justify-center ${blk.isTarget ? 'block-target' : 'block-wood'}`;
        
        // Cập nhật vị trí và kích thước thực tế trên DOM
        el.style.left = (blk.x * CELL_SIZE) + 'px';
        el.style.top = (blk.y * CELL_SIZE) + 'px';
        el.style.width = (blk.w * CELL_SIZE) + 'px';
        el.style.height = (blk.h * CELL_SIZE) + 'px';

        // Biểu tượng cho đẹp
        if (blk.isTarget) el.innerHTML = '<span class="text-white text-xl drop-shadow-md">🌸</span>';
        else if (blk.w > blk.h) el.innerHTML = '<span class="text-amber-900 opacity-50">|||</span>';
        else el.innerHTML = '<span class="text-amber-900 opacity-50 font-bold">=</span>';

        // Gắn Event Kéo thả (Hỗ trợ cả Chuột và Cảm ứng)
        el.addEventListener('pointerdown', (e) => handleDragStart(e, index, el));
        
        boardEl.appendChild(el);
    });
}

// ================= LOGIC KÉO THẢ CHUẨN XÁC =================
function handleDragStart(e, index, el) {
    if (isGameOver) return;
    activeBlock = blocks[index];
    activeBlock.el = el;
    
    const isHorizontal = activeBlock.w > activeBlock.h;
    startMousePos = isHorizontal ? e.clientX : e.clientY;
    startBlockPos = isHorizontal ? (activeBlock.x * CELL_SIZE) : (activeBlock.y * CELL_SIZE);
    
    // Tính toán Giới hạn va chạm trước khi di chuyển
    calculateBounds(activeBlock, isHorizontal);
    
    el.setPointerCapture(e.pointerId);
    el.addEventListener('pointermove', handleDragMove);
    el.addEventListener('pointerup', handleDragEnd);
    el.addEventListener('pointercancel', handleDragEnd);
}

function handleDragMove(e) {
    if (!activeBlock) return;
    
    const isHorizontal = activeBlock.w > activeBlock.h;
    const currentMousePos = isHorizontal ? e.clientX : e.clientY;
    let delta = currentMousePos - startMousePos;
    
    let newPos = startBlockPos + delta;
    
    // Khóa vị trí không cho xuyên tường hoặc đè khối khác
    if (newPos < minLimit) newPos = minLimit;
    if (newPos > maxLimit) newPos = maxLimit;
    
    if (isHorizontal) activeBlock.el.style.left = newPos + 'px';
    else activeBlock.el.style.top = newPos + 'px';
}

function handleDragEnd(e) {
    if (!activeBlock) return;
    
    const el = activeBlock.el;
    el.removeEventListener('pointermove', handleDragMove);
    el.removeEventListener('pointerup', handleDragEnd);
    el.removeEventListener('pointercancel', handleDragEnd);
    
    const isHorizontal = activeBlock.w > activeBlock.h;
    const currentPx = parseInt(isHorizontal ? el.style.left : el.style.top);
    
    // Khớp vị trí (Snap to grid) khi nhả chuột
    const newGridPos = Math.round(currentPx / CELL_SIZE);
    
    if (isHorizontal) {
        if (activeBlock.x !== newGridPos) moves++; // Có thay đổi vị trí mới tính 1 bước
        activeBlock.x = newGridPos;
        el.style.left = (newGridPos * CELL_SIZE) + 'px';
    } else {
        if (activeBlock.y !== newGridPos) moves++;
        activeBlock.y = newGridPos;
        el.style.top = (newGridPos * CELL_SIZE) + 'px';
    }
    
    moveEl.innerText = moves;
    
    // Kiểm tra chiến thắng (Khối mục tiêu chạm tới mép phải)
    if (activeBlock.isTarget && activeBlock.x + activeBlock.w === 6) {
        winGame();
    }
    
    activeBlock = null;
}

// Thuật toán siêu gọn tìm giới hạn kéo
function calculateBounds(block, isHorizontal) {
    let minG = 0; 
    let maxG = isHorizontal ? (6 - block.w) : (6 - block.h);

    blocks.forEach(other => {
        if (other.id === block.id) return;

        if (isHorizontal) {
            // Kiểm tra các khối cản đường đi ngang (cùng tọa độ Y)
            if (block.y < other.y + other.h && block.y + block.h > other.y) {
                if (other.x < block.x) minG = Math.max(minG, other.x + other.w);
                if (other.x > block.x) maxG = Math.min(maxG, other.x - block.w);
            }
        } else {
            // Kiểm tra các khối cản đường đi dọc (cùng tọa độ X)
            if (block.x < other.x + other.w && block.x + block.w > other.x) {
                if (other.y < block.y) minG = Math.max(minG, other.y + other.h);
                if (other.y > block.y) maxG = Math.min(maxG, other.y - block.h);
            }
        }
    });

    minLimit = minG * CELL_SIZE;
    maxLimit = maxG * CELL_SIZE;
    
    // Hiệu ứng "chuột rút" mở cửa thoát cho khối Target
    if (block.isTarget) maxLimit = (6 - block.w) * CELL_SIZE; 
}

function winGame() {
    isGameOver = true;
    clearInterval(timerInterval);
    const finalScore = CONFIG[currentDiff].score;
    
    // Hiệu ứng khối thoát khỏi màn hình
    activeBlock.el.style.left = '320px'; 
    activeBlock.el.style.transition = 'left 0.5s ease-out';

    setTimeout(() => {
        alert(`🎉 GIẢI CỨU THÀNH CÔNG!\nBạn đã mở đường sau ${moves} bước đi.\nThời gian: ${timerEl.innerText}\nĐiểm: +${finalScore}`);
    }, 500);

    fetch('/game/submitScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            game: 'unblock-me', difficulty: currentDiff, score: finalScore, time: timeElapsed * 1000, isWin: true
        })
    }).then(res => res.json()).then(console.log);
}