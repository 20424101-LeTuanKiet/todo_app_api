import express from 'express';
// import 'dotenv/config';
import cors from 'cors';
// import morgan from 'morgan';
import todosRouter from './routes/todos.route.js';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
// import { accessLogStream } from './config/logging.js';
import auth from './middlewares/auth.mdw.js';

const app = express();

app.use(cors());
app.use(express.json());

// setup the logger
// morgan.token('body', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]', { stream: accessLogStream }))

app.get('/', function (req, res){
    res.json({
        message: 'Hello, API is starting'
    })
})

app.use('/api/todos', auth, todosRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(process.env.PORT || 3000, function(){
    console.log(`Product api server is listening at http://localhost:${process.env.PORT || 3000}`);
});