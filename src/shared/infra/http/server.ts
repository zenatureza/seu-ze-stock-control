import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

app.get('/test', (request, response) => response.json({ message: '👨‍💻 test' }));

app.listen(3333, () => {
  console.log('🌴 starting node server on port 3333');
});
