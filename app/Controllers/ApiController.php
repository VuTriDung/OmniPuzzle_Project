<?php
// app/Controllers/ApiController.php
class ApiController extends Controller {
    
    public function getFlowMap() {
        header('Content-Type: application/json');
        
        $difficulty = $_GET['difficulty'] ?? 'easy';
        
        // KHO ĐỀ CHUẨN 100% CÓ NGHIỆM VÀ LẤP KÍN BÀN CỜ
        // Sử dụng thuật toán "Đường ống lồng nhau" (Nested L-Shape) và các biến thể xoay chiều
        $maps = [
            'easy' => [
                // Dễ 1 (Lồng từ góc trên trái)
                [
                    [1, 2, 3, 4, 4],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 3],
                    [0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 1]
                ],
                // Dễ 2 (Lồng từ góc trên phải)
                [
                    [4, 4, 3, 2, 1],
                    [0, 0, 0, 0, 0],
                    [3, 0, 0, 0, 0],
                    [2, 0, 0, 0, 0],
                    [1, 0, 0, 0, 0]
                ],
                // Dễ 3 (Lồng từ góc dưới trái)
                [
                    [0, 0, 0, 0, 1],
                    [0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 3],
                    [0, 0, 0, 0, 0],
                    [1, 2, 3, 4, 4]
                ]
            ],
            'medium' => [
                // Trung bình 1 
                [
                    [1, 2, 3, 4, 5, 6, 6],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 5],
                    [0, 0, 0, 0, 0, 0, 4],
                    [0, 0, 0, 0, 0, 0, 3],
                    [0, 0, 0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 0, 0, 1]
                ],
                // Trung bình 2 (Xoay 180 độ)
                [
                    [1, 0, 0, 0, 0, 0, 0],
                    [2, 0, 0, 0, 0, 0, 0],
                    [3, 0, 0, 0, 0, 0, 0],
                    [4, 0, 0, 0, 0, 0, 0],
                    [5, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [6, 6, 5, 4, 3, 2, 1]
                ]
            ],
            'hard' => [
                // Khó 1 (9x9 siêu lồng)
                [
                    [1, 2, 3, 4, 5, 6, 7, 8, 8],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 7],
                    [0, 0, 0, 0, 0, 0, 0, 0, 6],
                    [0, 0, 0, 0, 0, 0, 0, 0, 5],
                    [0, 0, 0, 0, 0, 0, 0, 0, 4],
                    [0, 0, 0, 0, 0, 0, 0, 0, 3],
                    [0, 0, 0, 0, 0, 0, 0, 0, 2],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1]
                ],
                // Khó 2
                [
                    [8, 8, 7, 6, 5, 4, 3, 2, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [7, 0, 0, 0, 0, 0, 0, 0, 0],
                    [6, 0, 0, 0, 0, 0, 0, 0, 0],
                    [5, 0, 0, 0, 0, 0, 0, 0, 0],
                    [4, 0, 0, 0, 0, 0, 0, 0, 0],
                    [3, 0, 0, 0, 0, 0, 0, 0, 0],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
            ]
        ];

        // Lấy gói map theo độ khó
        $selectedPack = $maps[$difficulty] ?? $maps['easy'];
        
        // Bốc ngẫu nhiên 1 map trong gói
        $randomMap = $selectedPack[array_rand($selectedPack)];

        // Trả về kết quả JSON cho Frontend
        echo json_encode([
            'status' => 'success',
            'difficulty' => $difficulty,
            'map' => $randomMap
        ]);
        exit;
    }
}