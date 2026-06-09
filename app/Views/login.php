<div class="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-sakura-100 mt-10">
    <h2 class="text-3xl font-extrabold text-center text-sakura-600 mb-6">Đăng Nhập</h2>
    
    <?php if(!empty($error)): ?>
        <div class="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm font-medium">
            <?= $error ?>
        </div>
    <?php endif; ?>

    <form action="/auth/login" method="POST" class="space-y-5">
        <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-100 outline-none transition" placeholder="nhapemail@gmail.com">
        </div>
        <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
            <input type="password" name="password" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sakura-400 focus:ring-2 focus:ring-sakura-100 outline-none transition" placeholder="••••••••">
        </div>
        <button type="submit" class="w-full bg-sakura-500 text-white font-bold py-3 rounded-xl hover:bg-sakura-600 transition shadow-md">
            Vào game
        </button>
    </form>
    <p class="mt-6 text-center text-sm text-gray-500">
        Chưa có tài khoản? <a href="/auth/register" class="text-sakura-600 font-bold hover:underline">Đăng ký ngay</a>
    </p>
</div>