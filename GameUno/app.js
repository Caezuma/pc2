const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
const cardRoutes = require('./routes/cardRoutes');
const scoreRoutes = require('./routes/scoreRoutes'); 
const { memoizationMiddleware, errorMiddleware } = require('./middleware/errorMiddleware');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());

const cacheConfig = {
  max: 50, 
  maxAge: 30000 
};
app.use(memoizationMiddleware(cacheConfig)); 

app.use('/game', gameRoutes);
app.use('/player', playerRoutes);
app.use('/card', cardRoutes);
app.use('/score', scoreRoutes);

app.use(errorMiddleware);


const PORT = process.env.PORT || 4000;
const server = require('http').createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Novo cliente WebSocket conectado');

    ws.on('message', (message) => {
        console.log('Mensagem recebida:', message);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
    });
});

sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado.');
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('Erro ao sincronizar banco de dados:', err));
