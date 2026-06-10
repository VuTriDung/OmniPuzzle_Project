<?php
// app/Core/App.php
class App {
    protected $controller = 'HomeController';
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
        // Lấy đường dẫn thực tế trên trình duyệt (VD: /game/play/minesweeper)
        $requestUri = $_SERVER['REQUEST_URI'] ?? '/';
        
        // Cắt bỏ phần query string (?id=1) nếu có
        $requestUri = explode('?', $requestUri)[0];
        $requestUri = trim($requestUri, '/');

        if (!empty($requestUri)) {
            return explode('/', filter_var($requestUri, FILTER_SANITIZE_URL));
        }
        return [];
    }
}