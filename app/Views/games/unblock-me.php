<div class="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-sakura-100">
    
    <div id="intro-screen" class="text-center">
        <h2 class="text-4xl font-extrabold text-sakura-600 mb-4">🧱 Unblock Me</h2>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
            Quy tắc: Trượt các khối gỗ (Ngang hoặc Dọc) để dọn đường cho <span class="font-bold text-sakura-500">Khối Sakura</span> thoát ra khỏi cửa ở bên phải.
        </p>

        <h3 class="text-xl font-bold text-gray-800 mb-4">Chọn độ khó:</h3>
        <div class="flex justify-center gap-4">
            <button onclick="startGame('easy')" class="bg-green-100 text-green-700 hover:bg-green-200 px-6 py-3 rounded-xl font-bold transition">Dễ (+50đ)</button>
            <button onclick="startGame('medium')" class="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-6 py-3 rounded-xl font-bold transition">Vừa (+100đ)</button>
            <button onclick="startGame('hard')" class="bg-red-100 text-red-700 hover:bg-red-200 px-6 py-3 rounded-xl font-bold transition">Khó (+200đ)</button>
        </div>
    </div>

    <div id="game-screen" class="hidden flex flex-col items-center">
        <div class="w-full max-w-md flex justify-between items-center bg-sakura-50 p-4 rounded-xl mb-6 border border-sakura-100">
            <div class="text-lg font-bold text-gray-700">Bước di chuyển: <span id="move-count" class="text-sakura-600">0</span></div>
            <div class="text-2xl font-extrabold text-sakura-600" id="timer">00:00</div>
            <div class="text-lg font-bold text-gray-700">Điểm: <span id="score-display" class="text-green-500">0</span></div>
        </div>

        <div class="relative bg-orange-50 border-4 border-amber-800 rounded-lg shadow-inner" style="width: 308px; height: 308px;">
            <div class="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
                <?php for($i=0; $i<36; $i++): ?>
                    <div class="border border-orange-900"></div>
                <?php endfor; ?>
            </div>
            
            <div class="absolute bg-white right-[-4px] top-[100px] w-[8px] h-[50px] z-10"></div>
            
            <div id="board-container" class="absolute inset-0 m-[4px] w-[300px] h-[300px]"></div>
        </div>

        <div class="text-center mt-6 space-x-4">
            <button onclick="resetLevel()" class="bg-amber-100 text-amber-700 px-6 py-2 rounded-full font-bold hover:bg-amber-200 transition">Chơi lại màn này 🔄</button>
            <button onclick="quitGame()" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition">Thoát</button>
        </div>
    </div>
</div>

<style>
    .block-element {
        position: absolute;
        border-radius: 8px;
        box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2), 2px 2px 5px rgba(0,0,0,0.3);
        cursor: grab;
        transition: transform 0.1s;
        touch-action: none; 
    }
    .block-element:active { cursor: grabbing; transform: scale(0.98); }
    .block-wood { background: linear-gradient(to bottom right, #fcd34d, #d97706); }
    .block-target { background: linear-gradient(to bottom right, #f472b6, #be185d); z-index: 5; }
</style>

<script src="/js/unblock-me.js"></script>