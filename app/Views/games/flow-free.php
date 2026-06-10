<div class="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-sakura-100">
    
    <div id="intro-screen" class="text-center">
        <h2 class="text-4xl font-extrabold text-sakura-600 mb-4">🔗 Flow Free (Nối Điểm Màu)</h2>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
            Quy tắc: Kéo chuột hoặc vuốt để nối các cặp điểm cùng màu với nhau. <br>
            <span class="font-bold text-sakura-500">Điều kiện thắng:</span> Các đường nối không được cắt chéo nhau và phải lấp đầy 100% tất cả các ô trên bàn cờ.
        </p>

        <h3 class="text-xl font-bold text-gray-800 mb-4">Chọn cấp độ thử thách:</h3>
        <div class="flex justify-center gap-4">
            <button onclick="startGame('easy')" class="bg-green-100 text-green-700 hover:bg-green-200 px-6 py-3 rounded-xl font-bold transition">
                Dễ (Lưới 5x5, 5 Cặp Màu) <br><span class="text-sm font-normal">+50 điểm</span>
            </button>
            <button onclick="startGame('medium')" class="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-6 py-3 rounded-xl font-bold transition">
                Vừa (Lưới 7x7, 6 Cặp Màu) <br><span class="text-sm font-normal">+100 điểm</span>
            </button>
            <button onclick="startGame('hard')" class="bg-red-100 text-red-700 hover:bg-red-200 px-6 py-3 rounded-xl font-bold transition">
                Khó (Lưới 9x9, 7 Cặp Màu) <br><span class="text-sm font-normal">+200 điểm</span>
            </button>
        </div>
    </div>

    <div id="game-screen" class="hidden flex flex-col items-center">
        <div class="w-full max-w-md flex justify-between items-center bg-sakura-50 p-4 rounded-xl mb-6 border border-sakura-100">
            <div class="text-lg font-bold text-gray-700">Tiến độ: <span id="flow-progress" class="text-sakura-600">0%</span></div>
            <div class="text-2xl font-extrabold text-sakura-600" id="timer">00:00</div>
            <div class="text-lg font-bold text-gray-700">Điểm: <span id="score-display" class="text-green-500">0</span></div>
        </div>

        <div class="relative bg-gray-900 rounded-2xl shadow-xl p-2 border-4 border-gray-700 select-none touch-none">
            <canvas id="flow-canvas" class="cursor-pointer"></canvas>
        </div>

        <div class="text-center mt-6 space-x-4">
            <button onclick="clearCurrentBoard()" class="bg-amber-100 text-amber-700 px-6 py-2 rounded-full font-bold hover:bg-amber-200 transition">Xóa đường vẽ 🧹</button>
            <button onclick="resetGame()" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition">Thoát</button>
        </div>
    </div>
</div>

<script src="/js/flow-free.js"></script>