<div class="text-center mb-12">
    <h1 class="text-4xl font-extrabold text-sakura-600 mb-4">Chào mừng đến với OmniPuzzle!</h1>
    <p class="text-lg text-gray-600">Rèn luyện trí não mỗi ngày với hàng loạt thử thách logic hấp dẫn.</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <?php foreach($games as $game): ?>
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-sakura-100 hover:shadow-lg hover:-translate-y-1 transition transform duration-300">
        <div class="h-32 <?= $game['color'] ?> rounded-2xl mb-4 flex items-center justify-center opacity-80">
            <span class="text-4xl">🎮</span>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2"><?= $game['name'] ?></h2>
        <p class="text-gray-500 mb-4"><?= $game['desc'] ?></p>
        <a href="/game/play/<?= $game['slug'] ?>" class="block w-full text-center bg-sakura-50 text-sakura-600 font-bold py-2 rounded-xl hover:bg-sakura-100 transition">
            Chơi ngay
        </a>
    </div>
    <?php endforeach; ?>
</div>