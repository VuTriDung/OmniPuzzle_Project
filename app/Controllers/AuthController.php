<?php
// app/Controllers/AuthController.php
class AuthController extends Controller {
    private $userModel;

    public function __construct() {
        $this->userModel = $this->model('User');
    }

    public function login() {
        // Nếu đã đăng nhập thì đá về trang chủ
        if(isset($_SESSION['user_id'])) {
            header('Location: /');
            exit;
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
}