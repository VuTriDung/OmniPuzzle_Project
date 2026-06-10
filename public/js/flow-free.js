// public/js/flow-free.js

const CONFIG = {
    easy: { size: 5, score: 50 },
    medium: { size: 7, score: 100 },
    hard: { size: 9, score: 200 }
};

const COLOR_MAP = {
    1: { name: 'Đỏ', hex: '#ef4444' },
    2: { name: 'Xanh dương', hex: '#3b82f6' },
    3: { name: 'Xanh lá', hex: '#10b981' },
    4: { name: 'Vàng', hex: '#eab308' },
    5: { name: 'Cam', hex: '#f97316' },
    6: { name: 'Tím', hex: '#a855f7' },
    7: { name: 'Hồng Sakura', hex: '#f472b6' },
    8: { name: 'Lục lam', hex: '#06b6d4' }
};

let currentDiff = 'easy';
let gridSize = 5;
let initialMap = [];
let flows = {}; 
let isGameOver = false;
let timeElapsed = 0;
let timerInterval = null;

let isDrawing = false;
let activeColor = null;
let isEventAttached = false; 

const canvas = document.getElementById('flow-canvas');
const ctx = canvas.getContext('2d');
const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('flow-progress');

const CANVAS_DISPLAY_SIZE = 380; 
let cellSize = 0;

// ================= NÂNG CẤP LUỒNG ĐỌC ĐỀ TỪ API =================
function startGame(difficulty) {
    currentDiff = difficulty;
    gridSize = CONFIG[difficulty].size;
    isGameOver = false;
    isDrawing = false;
    activeColor = null;
    timeElapsed = 0;
    flows = {};

    // Gọi API Backend lấy đề phân bổ ngẫu nhiên chất lượng cao
    fetch(`/api/getFlowMap?difficulty=${difficulty}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                // Nhận ma trận đề từ API gán vào map hiển thị
                initialMap = data.map;

                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        let colorId = initialMap[r][c];
                        if (colorId > 0 && !flows[colorId]) {
                            flows[colorId] = [];
                        }
                    }
                }

                // Kích hoạt UI hiển thị
                document.getElementById('intro-screen').classList.add('hidden');
                document.getElementById('game-screen').classList.remove('hidden');
                document.getElementById('score-display').innerText = CONFIG[difficulty].score;

                canvas.width = CANVAS_DISPLAY_SIZE;
                canvas.height = CANVAS_DISPLAY_SIZE;
                cellSize = CANVAS_DISPLAY_SIZE / gridSize;

                clearInterval(timerInterval);
                timerInterval = setInterval(() => {
                    timeElapsed++;
                    let m = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
                    let s = String(timeElapsed % 60).padStart(2, '0');
                    timerEl.innerText = `${m}:${s}`;
                }, 1000);

                setupEventListeners();
                draw();
                calculateProgress(); 
            }
        })
        .catch(err => {
            console.error("Lỗi API kết nối màn chơi:", err);
            alert("Không thể kết nối dịch vụ API lấy màn chơi!");
        });
}

function resetGame() {
    clearInterval(timerInterval);
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('intro-screen').classList.remove('hidden');
}

function clearCurrentBoard() {
    for (let colorId in flows) {
        flows[colorId] = [];
    }
    draw();
    calculateProgress();
}

// ================= ĐỒ HỌA CANVAS =================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFlows();
    drawDots();
}

function drawGrid() {
    ctx.strokeStyle = '#374151'; 
    ctx.lineWidth = 2;
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
}

function drawDots() {
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            let colorId = initialMap[r][c];
            if (colorId > 0) {
                let centerX = c * cellSize + cellSize / 2;
                let centerY = r * cellSize + cellSize / 2;
                let radius = cellSize * 0.3;

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.fillStyle = COLOR_MAP[colorId].hex;
                ctx.shadowBlur = 10;
                ctx.shadowColor = COLOR_MAP[colorId].hex; 
                ctx.fill();
                ctx.shadowBlur = 0; 
            }
        }
    }
}

function drawFlows() {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let colorId in flows) {
        let path = flows[colorId];
        if (path.length === 0) continue;

        ctx.beginPath();
        ctx.strokeStyle = COLOR_MAP[colorId].hex;
        ctx.lineWidth = cellSize * 0.4; 
        ctx.shadowBlur = 8;
        ctx.shadowColor = COLOR_MAP[colorId].hex;

        ctx.moveTo(path[0].c * cellSize + cellSize / 2, path[0].r * cellSize + cellSize / 2);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].c * cellSize + cellSize / 2, path[i].r * cellSize + cellSize / 2);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// ================= TƯƠNG TÁC KÉO/THẢ =================
function setupEventListeners() {
    if (isEventAttached) return;

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', (e) => { handleStart(e.touches[0]); e.preventDefault(); }, {passive: false});
    canvas.addEventListener('touchmove', (e) => { handleMove(e.touches[0]); e.preventDefault(); }, {passive: false});
    window.addEventListener('touchend', handleEnd);

    isEventAttached = true;
}

function getCellCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const c = Math.floor(x / cellSize);
    const r = Math.floor(y / cellSize);

    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
        return { r, c };
    }
    return null;
}

function handleStart(e) {
    if (isGameOver) return;
    const coords = getCellCoords(e);
    if (!coords) return;

    let colorId = initialMap[coords.r][coords.c];
    
    if (colorId > 0) {
        isDrawing = true;
        activeColor = colorId;
        flows[activeColor] = [coords];
        draw();
        calculateProgress();
    }
}

function handleMove(e) {
    if (!isDrawing || isGameOver) return;
    const coords = getCellCoords(e);
    if (!coords) return;

    let path = flows[activeColor];
    if (!path || path.length === 0) return;
    let last = path[path.length - 1];

    const isNeighbor = (Math.abs(coords.r - last.r) + Math.abs(coords.c - last.c)) === 1;
    if (!isNeighbor) return;

    if (path.length > 1 && coords.r === path[path.length - 2].r && coords.c === path[path.length - 2].c) {
        path.pop();
        draw();
        calculateProgress();
        return;
    }

    for (let cid in flows) {
        if (parseInt(cid) === activeColor) continue;
        let idx = flows[cid].findIndex(cell => cell.r === coords.r && cell.c === coords.c);
        if (idx > -1) {
            flows[cid] = flows[cid].slice(0, idx); 
        }
    }

    let targetColor = initialMap[coords.r][coords.c];

    if (targetColor === 0) {
        if (path.some(cell => cell.r === coords.r && cell.c === coords.c)) return;
        path.push(coords);
    } 
    else if (targetColor === activeColor) {
        if (coords.r !== path[0].r || coords.c !== path[0].c) {
            path.push(coords);
            isDrawing = false; 
            checkWinCondition(); 
        }
    } else {
        isDrawing = false; 
    }
    
    draw();
    calculateProgress();
}

function handleEnd() {
    isDrawing = false;
    activeColor = null;
}

// ================= TÍNH TIẾN ĐỘ & CHIẾN THẮNG =================
function calculateProgress() {
    let totalCells = gridSize * gridSize;
    let filledCells = new Set();

    for (let cid in flows) {
        if (flows[cid]) {
            flows[cid].forEach(cell => filledCells.add(`${cell.r},${cell.c}`));
        }
    }
    let percent = Math.floor((filledCells.size / totalCells) * 100);
    
    if (!document.getElementById('flow-progress').innerHTML.includes('font-bold')) {
        progressEl.innerText = `${percent}%`;
    }
    
    return { percent, filled: filledCells.size, total: totalCells };
}

function checkWinCondition() {
    let allConnected = true;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            let colorId = initialMap[r][c];
            if (colorId > 0) {
                let path = flows[colorId];
                if (!path || path.length < 2) {
                    allConnected = false;
                    break;
                }
                let startMatch = initialMap[path[0].r][path[0].c] === colorId;
                let endMatch = initialMap[path[path.length-1].r][path[path.length-1].c] === colorId;
                if (!startMatch || !endMatch) {
                    allConnected = false;
                }
            }
        }
    }

    let progress = calculateProgress();

    if (allConnected) {
        if (progress.filled === progress.total) {
            isGameOver = true;
            clearInterval(timerInterval);
            let finalScore = CONFIG[currentDiff].score;

            progressEl.innerHTML = `<span class="text-green-500 font-bold">100% - HOÀN THÀNH</span>`;

            setTimeout(() => {
                alert(`🎉 XUẤT SẮC!\nBạn đã giải mã thành công dòng chảy trong ${timerEl.innerText}.\nĐiểm nhận được: +${finalScore}`);
            }, 200);

            fetch('/game/submitScore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    game: 'flow-free', difficulty: currentDiff, score: finalScore, time: timeElapsed * 1000, isWin: true
                })
            }).then(res => res.json()).then(console.log);
        } else {
            progressEl.innerHTML = `<span class="text-orange-500 font-bold">${progress.percent}% (Cần lấp kín ô!)</span>`;
        }
    } else {
        progressEl.innerHTML = `<span class="text-gray-700">${progress.percent}%</span>`;
    }
}