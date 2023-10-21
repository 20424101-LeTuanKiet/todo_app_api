import db from '../utils/db.js';

export function findAll(id){
    return db('todos').where('userId', id).whereNot('isDelete', 1);
}

export async function findById(id){
    const list = await db('todos').where('id', id);
    
    if(list.length === 0){
        return null;
    }

    return list[0];
}

export function add(todo){
    return db('todos').insert(todo);
}

export function del(id){
    return db('todos').where('id', id).update('isDelete', 1);
}

export function completed(id, complete){
    return db('todos').where('id', id).update('completed', complete);
}