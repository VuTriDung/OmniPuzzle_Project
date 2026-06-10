<div class="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-sakura-100">
    
    <div id="intro-screen" class="text-center">
        <h2 class="text-4xl font-extrabold text-sakura-600 mb-4">⚔️ Cờ Caro (Gomoku)</h2>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
            Luật chơi: Đạt 5 quân liên tiếp (Ngang, Dọc, Chéo) để chiến thắng. Chơi với Máy (AI).<br>
            <span class="text-red-500 font-bold">Thua sẽ bị trừ điểm tương ứng!</span>
        </p>

        <div class="flex justify-center gap-4">
            <button onclick="startGame('easy')" class="bg-green-100 text-green-700 hover:bg-green-200 px-6 py-3 rounded-xl font-bold transition">
                Dễ (+50đ)
            </button>
            <button onclick="startGame('medium')" class="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-6 py-3 rounded-xl font-bold transition">
                Trung Bình (+100đ)
            </button>
            <button onclick="startGame('hard')" class="bg-red-100 text-red-700 hover:bg-red-200 px-6 py-3 rounded-xl font-bold transition">
                Khó (+200đ)
            </button>
        </div>
    </div>

    <div id="game-screen" class="hidden">
        <div class="flex justify-between items-center bg-sakura-50 p-4 rounded-xl mb-6 border border-sakura-100">
            <div class="text-lg font-bold text-gray-700">Lượt: <span id="turn-indicator" class="text-sakura-600">Bạn (X)</span></div>
            <div class="text-2xl font-extrabold text-sakura-600" id="timer">00:00</div>
            <div class="text-lg font-bold text-gray-700">Điểm trận này: <span id="score-display" class="text-green-500">0</span></div>
        </div>

        <div class="overflow-x-auto">
            <div id="caro-board" class="mx-auto bg-gray-300 border border-gray-400 select-none shadow-inner" style="width: fit-content;">
                </div>
        </div>

        <div class="text-center mt-6">
            <button onclick="resetGame()" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition">Thoát / Đầu hàng</button>
        </div>
    </div>
</div>

<style>
    /* CSS cho bàn cờ Caro */
    .caro-cell {
        width: 35px; height: 35px;
        background-color: #fffaf0; /* Màu nền giấy hơi ngà */
        border: 1px solid #d1d5db;
        display: flex; align-items: center; justify-content: center;
        font-size: 24px; font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .caro-cell:hover { background-color: #fce7f3; }
    .caro-x { color: #db2777; /* Màu hồng đậm cho X */ }
    .caro-o { color: #3b82f6; /* Màu xanh biển cho O (Máy) */ }
</style>

<script src="/js/tic-tac-toe.js"></script>