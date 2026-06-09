<?php
// app/Core/Controller.php
class Controller {
    // Gọi Model
    public function model($model) {
        require_once '../app/Models/' . $model . '.php';
        return new $model();
    }

    // Gọi View và truyền dữ liệu
    public function view($view, $data = []) {
        if (file_exists('../app/Views/' . $view . '.php')) {
            extract($data);
            $view_content = '../app/Views/' . $view . '.php'; // Gán file view con
            require_once '../app/Views/layout.php'; // Gọi layout bọc bên ngoài
        } else {
            die("View $view không tồn tại.");
        }
    }
}