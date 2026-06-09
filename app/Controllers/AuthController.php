<?php
// app/Controllers/AuthController.php
class AuthController extends Controller {
    private $userModel;

    public function __construct() {
        $this->userModel = $this->model('User');
    }

    public function login() {
        // Nếu đã đăng nhập thì đá về trang chủ
        if(isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
            $loggedInUser = $this->userModel->findUserByEmail($_SESSION['user_id']);
            if ($loggedInUser && $loggedInUser->is_verified == 1) {
                header('Location: /');
                exit;
            }
        }

        $data = ['error' => ''];

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $email = trim($_POST['email']);
            $password = trim($_POST['password']);

            $loggedInUser = $this->userModel->login($email, $password);

            if ($loggedInUser) {
                // Tạo session
                $_SESSION['user_id'] = $loggedInUser->id;
                $_SESSION['username'] = $loggedInUser->username;
                header('Location: /');
            } else {
                $data['error'] = 'Email hoặc mật khẩu không chính xác!';
            }
        }
        $this->view('login', $data);
    }   

    public function logout() {
        unset($_SESSION['user_id']);
        unset($_SESSION['username']);
        session_destroy();
        header('Location: /');
    }

    public function register() {
        if(isset($_SESSION['user_id'])) {
            header('Location: /');
            exit;
        }

        $data = ['error' => '', 'success' => ''];

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $username = trim($_POST['username']);
            $email = trim($_POST['email']);
            $password = trim($_POST['password']);
            $recaptchaResponse = trim($_POST['g-recaptcha-response']);

            // 1. Validate reCAPTCHA
            $secretKey = $_ENV['RECAPTCHA_SECRET_KEY']; 
            $verifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$recaptchaResponse");
            $responseData = json_decode($verifyResponse);

            if (!$responseData->success) {
                $data['error'] = 'Vui lòng xác nhận bạn không phải người máy (reCAPTCHA).';
            } 
            // 2. Kiểm tra trùng lặp Email/Username
            else if ($this->userModel->checkExists($email, $username)) {
                $data['error'] = 'Email hoặc Tên đăng nhập đã tồn tại!';
            } 
            // 3. Tiến hành đăng ký
            else {
                // Tạo token ngẫu nhiên
                $token = bin2hex(random_bytes(32)); 
                
                if ($this->userModel->registerUser($username, $email, $password, $token)) {
                    // 4. Gửi Email (Code giả lập, dùng hàm mail cơ bản)
                    $verifyLink = "http://localhost:8000/auth/verify/" . $token;
                    $subject = "Xac nhan tai khoan OmniPuzzle";
                    $message = "Chào $username,\n\nVui lòng click vào link sau để xác nhận tài khoản:\n$verifyLink";
                    $headers = "From: noreply@omnipuzzle.com";

                    // Lưu ý: Trên localhost hàm mail() có thể báo lỗi hoặc không gửi được nếu chưa cài đặt SMTP ở php.ini
                    @mail($email, $subject, $message, $headers); 

                    $data['success'] = 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.';
                } else {
                    $data['error'] = 'Có lỗi xảy ra khi tạo tài khoản.';
                }
            }
        }
        $this->view('register', $data);
    }

    public function verify($token = '') {
        if (empty($token)) {
            die("Token không hợp lệ.");
        }

        if ($this->userModel->verifyEmail($token)) {
            echo "<h1>Xác thực thành công!</h1><p>Bạn có thể <a href='/auth/login'>đăng nhập</a> ngay bây giờ.</p>";
        } else {
            echo "<h1>Xác thực thất bại!</h1><p>Token không tồn tại hoặc tài khoản đã được xác thực.</p>";
        }
    }
}