<?php
// app/Models/User.php
class User {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    // Tìm user bằng email
    public function findUserByEmail($email) {
        $this->db->query('SELECT * FROM users WHERE email = :email');
        $this->db->bind(':email', $email);
        $row = $this->db->single();

        return $row ? $row : false;
    }

    // Đăng nhập
    public function login($email, $password) {
        $row = $this->findUserByEmail($email);
        if (!$row) return false;

        $hashed_password = $row->password_hash;
        if (password_verify($password, $hashed_password)) {
            return $row;
        } else {
            return false;
        }
    }
}