import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import { readFile } from 'fs/promises';

import validate from '../middlewares/validate.mdw.js';

const schema =  JSON.parse(await readFile(new URL('../schemas/login.json', import.meta.url)));
const rfSchema =  JSON.parse(await readFile(new URL('../schemas/rf.json', import.meta.url)));
const router = express.Router();

router.post('/', validate(schema), async function (req, res){
    // format body 
    // {
    //     username: '...',
    //     password: '...',
    // }
    const {username, password} = req.body;

    const user = await userModel.findByUsername(username);

    if(user === null){
        return res.status(401).json({
            authenticated: false
        })
    }

    if(bcrypt.compareSync(password, user.password) === false){
        return res.status(401).json({
            authenticated: false
        })
    }

    const payload = {
        userId: user.id,
        roles: user.role,
    }
    const opts = {
        expiresIn: 24*60*60 // one day
    }
    const accessToken = jwt.sign(payload, 'SECRET_KEY', opts);

    const refreshToken = uuidv4();
    await userModel.patch(user.id, {
        refreshToken
    })

    res.json({
        authenticated: true,
        accessToken,
        refreshToken
    })
})

router.post('/refresh', validate(rfSchema), async function (req, res){
    // format body 
    // {
    //     accessToken: '...',
    //     refreshToken: '...',
    // }
    const {accessToken, refreshToken} = req.body;
    try{
        const opts = {
            ignoreExpiration: true
        }
        const {userId, roles} = jwt.verify(accessToken, 'SECRET_KEY', opts);
        const ret = await userModel.isValidRefreshToken(userId, refreshToken);
        
        if(ret === true){
            const newAccessToken = jwt.sign({userId, roles}, 'SECRET_KEY', { expiresIn: 10*60 })
            return res.json({
                accessToken: newAccessToken
            })
        }

        return res.status(401).json({
            message: 'RefreshToken is revoked'
        })

    } catch(err){
        console.error(err);
        return res.status(401).json({
            message: 'Invalid AccessToken.'
        })
    }
})

export default router;