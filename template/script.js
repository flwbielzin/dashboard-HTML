// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

// Inicializar o Express
const app = express();

// Configuração do servidor
const PORT = process.env.PORT || 3000;

// Middleware para parsear o corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos como HTML, CSS e JS
app.use(express.static(path.join(__dirname, 'public')));

// Conectar ao banco de dados MariaDB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'seu_usuario', // Substitua pelo seu usuário
  password: 'sua_senha', // Substitua pela sua senha
  database: 'seu_banco_de_dados', // Substitua pelo nome do seu banco de dados
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MariaDB');
});

// Rota para login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verificar se o usuário existe no banco de dados
  const query = 'SELECT * FROM usuarios WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar usuário.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    // Verificar a senha
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao verificar senha.' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Senha inválida.' });
      }

      // Login bem-sucedido
      res.status(200).json({ message: 'Login realizado com sucesso!' });
    });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
