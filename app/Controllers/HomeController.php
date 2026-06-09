<?php
// app/Controllers/HomeController.php
class HomeController extends Controller {
    public function index() {
        // Truyền dữ liệu sang View
        $data = [
            'title' => 'OmniPuzzle - Khám phá Vũ trụ Giải đố',
            'games' => [
                ['name' => 'Cờ Caro (Tic-Tac-Toe)', 'slug' => 'tic-tac-toe', 'desc' => 'Đấu trí 3x3 kinh điển', 'color' => 'bg-pink-300'],
                ['name' => 'Sudoku Classic', 'slug' => 'sudoku', 'desc' => 'Thử thách tư duy logic', 'color' => 'bg-rose-300'],
                ['name' => 'Dò Mìn (Minesweeper)', 'slug' => 'minesweeper', 'desc' => 'Cẩn thận từng bước đi', 'color' => 'bg-fuchsia-300']
            ]
        ];
        $this->view('home', $data);
    }
}