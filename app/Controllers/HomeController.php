<?php
// app/Controllers/HomeController.php
class HomeController extends Controller {
    public function index() {
        // Truyền dữ liệu sang View
        $data = [
            'title' => 'OmniPuzzle - Khám phá Vũ trụ Giải đố',
            'games' => [
                ['name' => 'Cờ Caro (Gomoku)', 'slug' => 'tic-tac-toe', 'desc' => 'Đấu trí 15x15 với AI', 'color' => 'bg-pink-300', 'icon' => '⚔️'],
                ['name' => 'Sudoku Classic', 'slug' => 'sudoku', 'desc' => 'Thử thách tư duy logic', 'color' => 'bg-rose-300', 'icon' => '🔢'],
                ['name' => 'Dò Mìn (Minesweeper)', 'slug' => 'minesweeper', 'desc' => 'Cẩn thận từng bước đi', 'color' => 'bg-fuchsia-300', 'icon' => '💣'],
                ['name' => 'Flow Free', 'slug' => 'flow-free', 'desc' => 'Nối điểm màu không cắt nhau', 'color' => 'bg-purple-300', 'icon' => '🔗'],
                ['name' => 'Unblock Me', 'slug' => 'unblock-me', 'desc' => 'Trượt gỗ tìm lối thoát', 'color' => 'bg-orange-300', 'icon' => '🧱'],
                ['name' => 'Nonogram (Picross)', 'slug' => 'nonogram', 'desc' => 'Giải mã tranh Pixel Art', 'color' => 'bg-teal-300', 'icon' => '🖼️'],
                ['name' => 'Wordle', 'slug' => 'wordle', 'desc' => 'Thử thách 6 lần đoán từ', 'color' => 'bg-emerald-300', 'icon' => '🔤'],
                ['name' => '2048 Classic', 'slug' => '2048', 'desc' => 'Trượt và gộp số toán học', 'color' => 'bg-indigo-300', 'icon' => '🧮']
            ]
        ];
        $this->view('home', $data);
    }
}