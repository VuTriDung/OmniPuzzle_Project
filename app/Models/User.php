<?php
// app/Models/User.php
class User {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    // Tìm user bằng email
    public function findUserByEmail(string $email) {
        $this->db->query('SELECT * FROM users WHERE email = :email');
        $this->db->bind(':email', $email);
        $row = $this->db->single();

        return $row ? $row : false;
    }

    // Đăng nhập
    public function login(string $email, string $password) {
        $row = $this->findUserByEmail($email);
        if (!$row) return false;

        $hashed_password = $row->password_hash;
        if (password_verify($password, $hashed_password)) {
            return $row;
        } else {
            return false;
        }
    }

    // Kiểm tra email hoặc username đã tồn tại chưa
    public function checkExists(string $email, string $username) {
        $this->db->query('SELECT id FROM users WHERE email = :email OR username = :username');
        $this->db->bind(':email', $email);
        $this->db->bind(':username', $username);
        $this->db->execute();
        return $this->db->rowCount() > 0;
    }

    // Tạo user mới (chưa xác thực)
    public function registerUser(string $username, string $email, string $password, string $token) {
        $this->db->query('INSERT INTO users (username, email, password_hash, verification_token, is_verified) 
                          VALUES (:username, :email, :password_hash, :token, FALSE)');
        
        $this->db->bind(':username', $username);
        $this->db->bind(':email', $email);
        $this->db->bind(':password_hash', password_hash($password, PASSWORD_BCRYPT));
        $this->db->bind(':token', $token);
        
        return $this->db->execute();
    }

    // Xác thực tài khoản bằng token
    public function verifyEmail(string $token) {
        $this->db->query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = :token');
        $this->db->bind(':token', $token);
        return $this->db->execute();
    }
}