const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');  // Para gerar o token JWT

const app = express();
const port = 3000;

// Configuração do middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados MariaDB
const db = mysql.createConnection({
  host: '100.87.218.90', // Ou o IP do seu servidor MariaDB
  user: 'root', // O usuário do MariaDB
  password: '0207', // A senha do MariaDB
  database: 'controle_financas' // O banco de dados que você está usando
});

// Verificar a conexão
db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MariaDB!');
});

// Rota de Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Consultar o banco de dados para verificar se as credenciais estão corretas
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar usuário' });
    }

    if (result.length > 0) {
      // Gerar token JWT
      const token = jwt.sign({ username: username }, 'secreta', { expiresIn: '1h' });
      return res.json({ message: 'Login bem-sucedido', token: token });
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
