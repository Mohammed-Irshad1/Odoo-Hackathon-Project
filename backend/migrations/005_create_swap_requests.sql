CREATE TABLE swap_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  requester_id INT NOT NULL,
  owner_id INT NOT NULL,
  status ENUM('pending', 'approved', 'declined', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
); 