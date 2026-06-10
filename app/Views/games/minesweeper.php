<div class="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-sakura-100">
    <div id="intro-screen" class="text-center">
        <h2 class="text-4xl font-extrabold text-sakura-600 mb-4">💣 Dò Mìn (Minesweeper)</h2>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
            Quy tắc: Tìm và đánh dấu (chuột phải) tất cả các quả mìn. Mở vào mìn sẽ mất trắng điểm. Mở ô an toàn được cộng điểm tùy theo độ khó.
        </p>

        <h3 class="text-xl font-bold text-gray-800 mb-4">Chọn độ khó để bắt đầu:</h3>
        <div class="flex justify-center gap-4">
            <button onclick="startGame('easy')" class="bg-green-100 text-green-700 hover:bg-green-200 px-6 py-3 rounded-xl font-bold transition">
                Dễ (9x9, 10 Mìn) <br><span class="text-sm font-normal">5 điểm/ô</span>
            </button>
            <button onclick="startGame('medium')" class="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-6 py-3 rounded-xl font-bold transition">
                Vừa (16x16, 40 Mìn) <br><span class="text-sm font-normal">15 điểm/ô</span>
            </button>
            <button onclick="startGame('hard')" class="bg-red-100 text-red-700 hover:bg-red-200 px-6 py-3 rounded-xl font-bold transition">
                Khó (20x20, 80 Mìn) <br><span class="text-sm font-normal">30 điểm/ô</span>
            </button>
        </div>
    </div>

    <div id="game-screen" class="hidden">
        <div class="flex justify-between items-center bg-sakura-50 p-4 rounded-xl mb-6 border border-sakura-100">
            <div class="text-lg font-bold text-gray-700">Mìn: <span id="mines-left" class="text-red-500">0</span></div>
            <div class="text-2xl font-extrabold text-sakura-600" id="timer">00:00</div>
            <div class="text-lg font-bold text-gray-700">Điểm: <span id="score" class="text-green-500">0</span></div>
        </div>

        <div id="grid-container" class="mx-auto select-none flex justify-center"></div>

        <div class="text-center mt-6">
            <button onclick="resetGame()" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition">Thoát / Chơi lại</button>
        </div>
    </div>
</div>

<script src="/js/minesweeper.js"></script>