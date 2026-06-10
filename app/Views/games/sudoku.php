<style>
    /* Custom CSS để vẽ viền đậm cho các khối 3x3 */
    .sudoku-cell { border: 1px solid #fce7f3; }
    .sudoku-cell.border-r-thick { border-right: 2px solid #db2777; }
    .sudoku-cell.border-b-thick { border-bottom: 2px solid #db2777; }
    .sudoku-cell.border-l-thick { border-left: 2px solid #db2777; }
    .sudoku-cell.border-t-thick { border-top: 2px solid #db2777; }
</style>

<div class="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-sakura-100">
    
    <div id="intro-screen" class="text-center">
        <h2 class="text-4xl font-extrabold text-sakura-600 mb-4">🔢 Sudoku Classic</h2>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">Điền số từ 1-9. Không được trùng lặp trong cùng Hàng, Cột và Khối 3x3. Bạn có tối đa 3 lần sai.</p>
        <div class="flex justify-center gap-4">
            <button onclick="startGame('easy')" class="bg-green-100 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-200">Dễ (5đ/ô)</button>
            <button onclick="startGame('medium')" class="bg-yellow-100 text-yellow-700 px-6 py-3 rounded-xl font-bold hover:bg-yellow-200">Thường (15đ/ô)</button>
            <button onclick="startGame('hard')" class="bg-red-100 text-red-700 px-6 py-3 rounded-xl font-bold hover:bg-red-200">Khó (30đ/ô)</button>
        </div>
    </div>

    <div id="game-screen" class="hidden flex flex-col md:flex-row gap-8 items-start justify-center">
        
        <div class="flex-1 flex justify-center flex-col items-center">
            <div class="w-full max-w-sm flex justify-between items-center mb-4 px-2">
                <div class="text-lg font-bold text-gray-700">Mạng: <span id="lives" class="text-red-500 tracking-widest">❤️❤️❤️</span></div>
                <div class="text-2xl font-extrabold text-sakura-600" id="timer">00:00</div>
                <div class="text-lg font-bold text-gray-700">Điểm: <span id="score" class="text-green-500">0</span></div>
            </div>
            
            <div id="sudoku-board" class="grid grid-cols-9 bg-white border-2 border-sakura-600 w-full max-w-sm aspect-square cursor-pointer select-none shadow-md">
                </div>
        </div>

        <div class="w-full md:w-64 flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-2 mb-2">
                <button id="btn-note" onclick="toggleNoteMode()" class="bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                    <span id="note-icon">✏️</span> Nháp: Tắt
                </button>
                <button onclick="eraseCell()" class="bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                    Khóa tẩy 🧼
                </button>
            </div>
            <div class="grid grid-cols-3 gap-2">
                <?php for($i=1; $i<=9; $i++): ?>
                <button onclick="inputNumber(<?= $i ?>)" class="bg-sakura-50 text-sakura-600 text-2xl font-bold py-4 rounded-xl hover:bg-sakura-200 hover:scale-105 transition shadow-sm">
                    <?= $i ?>
                </button>
                <?php endfor; ?>
            </div>
            <button onclick="resetGame()" class="mt-4 bg-sakura-500 text-white w-full py-3 rounded-xl font-bold hover:bg-sakura-600 transition shadow-md">Thoát / Đầu hàng</button>
        </div>
    </div>
</div>

<script src="/js/sudoku.js"></script>