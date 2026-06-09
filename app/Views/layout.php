<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'OmniPuzzle' ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        sakura: { 50: '#fdf2f8', 100: '#fce7f3', 400: '#f472b6', 500: '#ec4899', 600: '#db2777' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-sakura-50 min-h-screen text-gray-800 font-sans">
    <nav class="bg-white shadow-md border-b-2 border-sakura-100">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <a href="/" class="text-2xl font-bold text-sakura-500 tracking-wider">🌸 OmniPuzzle</a>
            <div class="space-x-4">
                <a href="/" class="hover:text-sakura-600 font-medium transition">Trò chơi</a>
                <a href="/leaderboard" class="hover:text-sakura-600 font-medium transition">BXH</a>
                
                <?php if(isset($_SESSION['user_id'])) : ?>
                    <span class="text-gray-600 font-medium px-2">Chào, <?= $_SESSION['username'] ?>!</span>
                    <a href="/auth/logout" class="bg-sakura-100 text-sakura-600 px-4 py-2 rounded-full hover:bg-sakura-200 transition font-bold">Thoát</a>
                <?php else : ?>
                    <a href="/auth/login" class="bg-sakura-500 text-white px-5 py-2 rounded-full hover:bg-sakura-600 transition shadow-sm font-bold">Đăng nhập</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <main class="max-w-6xl mx-auto px-4 py-8">
        <?php require_once $view_content; ?>
    </main>

</body>
</html>