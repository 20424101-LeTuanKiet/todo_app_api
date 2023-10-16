import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import userModel from '../models/user.model.js';
import { readFile } from 'fs/promises';

import validate from '../middlewares/validate.mdw.js';

const schema =  JSON.parse(await readFile(new URL('../schemas/user.json', import.meta.url)));
const router = express.Router();

router.post('/register', validate(schema), async function (req, res){
    // format users 
    // {
    //     id: '#auto',
    //     email: '...',
    //     username: '...',
    //     password: '...',
    //     refreshToken: 'null',
    //     role: '#default',
    //     state: '#auto' actived|active|blocked
    // }

    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);

    user = {
        id: uuidv4(),
        state: 'actived',
        ...user,
    }
    const ret = await userModel.add(user);

    delete user.password;
    res.status(201).json(user);
})

export default router;