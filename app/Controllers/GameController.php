<?php
// app/Controllers/GameController.php
class GameController extends Controller {
    
    // Gọi giao diện chơi game
    public function play($slug) {
        $data = ['title' => 'Chơi Game - OmniPuzzle'];

        if ($slug == 'minesweeper') {
            $data['title'] = 'Dò Mìn (Minesweeper)';
            // Trỏ tới thư mục games/minesweeper.php
            $this->view('games/minesweeper', $data); 
        } else {
            echo "Game đang được phát triển!";
        }
    }

    // API nhận điểm số từ JS gửi xuống
    public function submitScore() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Đọc dữ liệu JSON từ Fetch API
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);

            $score = $data['score'] ?? 0;
            $timeMs = $data['time'] ?? 0;
            $difficulty = $data['difficulty'] ?? 'easy';
            $isWin = $data['isWin'] ?? false;

            // TODO: Ở Phase tiếp theo, chúng ta sẽ code Model để insert điểm này vào DB
            // Hiện tại cứ trả về thành công để test luồng JS
            echo json_encode([
                'status' => 'success', 
                'message' => 'Đã lưu điểm thành công!',
                'received' => ['score' => $score, 'time' => $timeMs]
            ]);
        }
    }
}