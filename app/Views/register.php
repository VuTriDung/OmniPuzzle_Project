<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<div class="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-sakura-100 mt-10">
    <h2 class="text-3xl font-extrabold text-center text-sakura-600 mb-6">Tạo Tài Khoản</h2>
    
    <?php if(!empty($error)): ?>
        <div class="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm font-medium">
            <?= $error ?>
        </div>
    <?php endif; ?>

    <?php if(!empty($success)): ?>
        <div class="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center text-sm font-medium">
            <?= $success ?>
        </div>
    <?php else: ?>

    <form action="/auth/register" method="POST" class="space-y-4">
        <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Tên hiển thị (Username)</label>
            <input type="text" name="username" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-100 outline-none transition">
        </div>
        <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-100 outline-none transition">
        </div>
        <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
            <input type="password" name="password" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-100 outline-none transition">
        </div>

        <div class="g-recaptcha" data-sitekey="<?= $_ENV['RECAPTCHA_SITE_KEY'] ?>"></div>

        <button type="submit" class="w-full bg-sakura-500 text-white font-bold py-3 rounded-xl hover:bg-sakura-600 transition shadow-md">
            Đăng Ký
        </button>
    </form>
    
    <?php endif; ?>

    <p class="mt-6 text-center text-sm text-gray-500">
        Đã có tài khoản? <a href="/auth/login" class="text-sakura-600 font-bold hover:underline">Đăng nhập</a>
    </p>
</div>