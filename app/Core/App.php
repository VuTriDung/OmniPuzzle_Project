<?php
// app/Core/App.php
class App {
    protected $controller = 'HomeController'; // Mặc định vào trang chủ
    protected $method = 'index';
    protected $params = [];

    public function __construct() {
        $url = $this->parseUrl();

        // 1. Tìm Controller
        if (isset($url[0]) && file_exists('../app/Controllers/' . ucfirst($url[0]) . 'Controller.php')) {
            $this->controller = ucfirst($url[0]) . 'Controller';
            unset($url[0]);
        }
        
        require_once '../app/Controllers/' . $this->controller . '.php';
        $this->controller = new $this->controller;

        // 2. Tìm Method (Hàm) trong Controller
        if (isset($url[1])) {
            if (method_exists($this->controller, $url[1])) {
                $this->method = $url[1];
                unset($url[1]);
            }
        }

        // 3. Lấy Params (Tham số)
        $this->params = $url ? array_values($url) : [];

        // Chạy hàm
        call_user_func_array([$this->controller, $this->method], $this->params);
    }

    public function parseUrl() {
        // Lấy đường dẫn thực tế đang gõ trên trình duyệt (VD: /auth/login)
        $requestUri = $_SERVER['REQUEST_URI'];
        
        // Loại bỏ các tham số phía sau dấu ? nếu có (VD: ?id=1)
        $requestUri = explode('?', $requestUri)[0];

        // Cắt bỏ dấu gạch chéo '/' ở đầu và cuối chuỗi
        $requestUri = trim($requestUri, '/');

        // Nếu có đường dẫn thì cắt thành mảng để lấy Controller và Method
        if (!empty($requestUri)) {
            return explode('/', filter_var($requestUri, FILTER_SANITIZE_URL));
        }
        
        // Trả về mảng rỗng nếu đang ở trang chủ gốc (/)
        return [];
    }
}