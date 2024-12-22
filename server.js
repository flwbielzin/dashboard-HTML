const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Configuração do middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados MariaDB
const db = mysql.createConnection({
  host: '100.87.218.90',
  user: 'root',
  password: '0207',
  database: 'controle_financas'
});

// Verificar a conexão
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MariaDB:', err.message);
    process.exit(1); // Encerra o servidor em caso de erro
  }
  console.log('Conectado ao MariaDB!');
});

// Rota de Login
app.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Usuário/email e senha são obrigatórios.' });
  }

  // Consultar o banco de dados
  const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(query, [usernameOrEmail, usernameOrEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao verificar usuário.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuário ou email não encontrado.' });
    }

    const user = results[0];

    // Comparar a senha usando bcrypt
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao verificar a senha.' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      // Gerar token JWT
      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, 'secreta', { expiresIn: '1h' });
      res.json({ message: 'Login bem-sucedido', token });
    });
  });
});

// Rota para registro de usuário
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Usuário, email e senha são obrigatórios.' });
  }

  // Validar o formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  // Criptografar a senha
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criptografar a senha.' });
    }

    // Inserir o usuário no banco de dados
    const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    db.query(query, [username, email, hash], (err, results) => {
      if (err) {
        console.error(err);

        // Verificar se o erro é por duplicidade de username/email
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Usuário ou email já existe.' });
        }

        return res.status(500).json({ error: 'Erro ao registrar o usuário.' });
      }

      res.json({ message: 'Usuário registrado com sucesso!' });
    });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
