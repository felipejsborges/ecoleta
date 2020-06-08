import express from 'express';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';

import routes from './routes';

const app = express();

app.use(cors()); // frontend can access this API
app.use(express.json()); // using json on this server
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors()); // validation (celebrate) errors

// insert the port that server is going to listen
const port = 3333;
app.listen(port);
console.log(`Server running on port ${port} 📡`);
