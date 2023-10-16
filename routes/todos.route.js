import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as todosModel from '../models/todos.model.js';
import { readFile } from 'fs/promises';
import validate from '../middlewares/validate.mdw.js';

const schema =  JSON.parse(await readFile(new URL('../schemas/todos.json', import.meta.url)));
const router = express.Router();


router.get('/', async function (req, res){
    const list = await todosModel.findAll();
    res.json(list);
})

router.get('/:id', async function (req, res){
    const id = req.params.id || 0;
    const todo = await todosModel.findById(id);
    if(todo === null){
        return res.status(204).end();
    }
    res.json(todo);

})

router.post('/', validate(schema), async function (req, res){
    // format todos 
    // {
    //     id: '#auto',
    //     userId: '#current',
    //     name: '...',
    //     status: 'todo',
    //     priority: '...',
    //     createAt: '#currentTimestamp'
    //     isDelete: 0,
    // }

    let todo = req.body;

    todo = {
        ...todo,
        id: uuidv4(),
        userId: '1'
    }

    const ret = await todosModel.add(todo);
    res.status(201).json(todo);
})

router.delete('/:id', async function (req, res){
    const id = req.params.id || 0;
    if(id === 0){
        res.status(204).end();
    }

    const n = await todosModel.del(id);
    res.json({
        affected: n
    })
})

router.put('/completed/:id', async function (req, res){
    const id = req.params.id || 0;
    if(id === 0){
        res.status(204).end();
    }

    const n = await todosModel.completed(id);
    res.json({
        affected: n
    })

})

export default router;