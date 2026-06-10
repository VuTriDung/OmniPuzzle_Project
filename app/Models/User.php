<?php
// app/Models/User.php
class User {
    private Database $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function findUserByEmail(string $email) {
        $this->db->query('SELECT * FROM users WHERE email = :email');
        $this->db->bind(':email', $email);
        $row = $this->db->single();
        return $row ? $row : false;
    }

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

    public function checkExists(string $email, string $username) {
        $this->db->query('SELECT id FROM users WHERE email = :email OR username = :username');
        $this->db->bind(':email', $email);
        $this->db->bind(':username', $username);
        $this->db->execute();
        
        // Gọi đúng hàm rowCount() của class Database
        return $this->db->rowCount() > 0;
    }

    public function registerUser(string $username, string $email, string $password, string $token) {
        $this->db->query('INSERT INTO users (username, email, password_hash, verification_token, is_verified) 
                          VALUES (:username, :email, :password_hash, :token, FALSE)');
        
        $this->db->bind(':username', $username);
        $this->db->bind(':email', $email);
        $this->db->bind(':password_hash', password_hash($password, PASSWORD_BCRYPT));
        $this->db->bind(':token', $token);
        
        return $this->db->execute();
    }

    public function verifyEmail(string $token) {
        $this->db->query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = :token');
        $this->db->bind(':token', $token);
        return $this->db->execute();
    }
}