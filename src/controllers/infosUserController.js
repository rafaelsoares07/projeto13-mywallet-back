import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { db, objectId } from '../dbStrategy/mongo.js';
import joi from 'joi';
import TransacaoSchema from '../schemas/transacoes.js';




const time = dayjs().locale("pt-br").format("DD/MM")
console.log(typeof(time))


export async function getCashFlow(req, res) {

    const sectionExist = res.locals.sectionExist

    const idUsuario = sectionExist.userId
    const userExists = await db.collection("usuarios").findOne({_id:idUsuario})

    console.log(userExists.transacoes)
    
   
   res.status(200).send(userExists.transacoes)
}


export async function createMoneyOut(req, res){

    const {valor, descricao, type}= req.body

    const saida = {
        valor:parseFloat(valor),
        descricao,
        type,
        time:time
    }

    const validacao = TransacaoSchema.validate(saida)

    if(validacao.error){
        res.status(422).send('campos incorretos')
        return
    }
   

    const sectionExist = res.locals.sectionExist

    const idUsuario = sectionExist.userId
    const userExists = await db.collection("usuarios").findOne({_id:idUsuario})
    const newBalance = parseFloat(userExists.balance) - parseFloat(valor)

    await db.collection('usuarios').updateOne(
        {_id:idUsuario},
        {$push:{transacoes:saida}}
    )

    
    
    await db.collection('usuarios').updateOne(
        {_id:idUsuario},
        {$set:{balance:newBalance}}
    )

    const userAtualizado = await db.collection("usuarios").findOne({_id:idUsuario})
    
    res.send(userAtualizado)
}


export async function createMoneyIn(req, res){

    const {valor, descricao, type}= req.body

    const entrada = {
        valor:parseFloat(valor),
        descricao,
        type,
        time:time
    }

    const validacao = TransacaoSchema.validate(entrada)

    if(validacao.error){
        res.status(422).send('campos incorretos')
        return
    }



    const sectionExist = res.locals.sectionExist

    const idUsuario = sectionExist.userId
    const userExists = await db.collection("usuarios").findOne({_id:idUsuario})
    const newBalance = parseFloat(userExists.balance) + parseFloat(valor)

    await db.collection('usuarios').updateOne(
        {_id:idUsuario},
        {$push:{transacoes:entrada}}
    )

    await db.collection('usuarios').updateOne(
        {_id:idUsuario},
        {$set:{balance:newBalance}}
    )


    const userAtualizado = await db.collection("usuarios").findOne({_id:idUsuario})
    
    res.send(userAtualizado)
}