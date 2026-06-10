<?php /** @var array $games */ ?>
<div class="text-center mb-12">
    <h1 class="text-4xl font-extrabold text-sakura-600 mb-4">Chào mừng đến với OmniPuzzle!</h1>
    <p class="text-lg text-gray-600">Rèn luyện trí não mỗi ngày với hàng loạt thử thách logic hấp dẫn.</p>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <?php foreach($games as $game): ?>
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-sakura-100 hover:shadow-lg hover:-translate-y-1 transition transform duration-300 flex flex-col h-full">
        
        <div class="h-32 <?= $game['color'] ?> rounded-2xl mb-4 flex items-center justify-center opacity-80 shadow-inner">
            <span class="text-5xl drop-shadow-md"><?= $game['icon'] ?></span>
        </div>
        
        <h2 class="text-xl font-bold text-gray-800 mb-2"><?= $game['name'] ?></h2>
        
        <p class="text-gray-500 mb-6 flex-grow text-sm"><?= $game['desc'] ?></p>
        
        <a href="/game/play/<?= $game['slug'] ?>" class="block w-full text-center bg-sakura-50 text-sakura-600 font-bold py-3 rounded-xl hover:bg-sakura-100 transition mt-auto">
            Chơi ngay
        </a>
        
    </div>
    <?php endforeach; ?>
</div>