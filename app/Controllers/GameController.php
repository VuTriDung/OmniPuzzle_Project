<?php
// app/Controllers/GameController.php
class GameController extends Controller {
    
    // Hàm gọi giao diện chơi game
    public function play($slug = '') {
        if (empty($slug)) {
            header('Location: /');
            exit;
        }

        $data = ['title' => 'Chơi Game - OmniPuzzle'];

        if ($slug == 'minesweeper') {
            $data['title'] = 'Dò Mìn (Minesweeper)';
            $this->view('games/minesweeper', $data); 
        } elseif ($slug == 'sudoku') { 
            $data['title'] = 'Sudoku Classic';
            $this->view('games/sudoku', $data);
        } elseif ($slug == 'tic-tac-toe') { // THÊM NHÁNH NÀY
            $data['title'] = 'Cờ Caro (Vs Máy)';
            $this->view('games/tic-tac-toe', $data);
        } else {
            echo "Game đang được phát triển!";
        }
    }

    // API nhận điểm số từ JS gửi xuống
    public function submitScore() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);

            $score = $data['score'] ?? 0;
            $timeMs = $data['time'] ?? 0;
            $difficulty = $data['difficulty'] ?? 'easy';
            $isWin = $data['isWin'] ?? false;

            echo json_encode([
                'status' => 'success', 
                'message' => 'Đã nhận điểm!',
                'received' => ['score' => $score, 'time' => $timeMs]
            ]);
        }
    }
}