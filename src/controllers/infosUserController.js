
import { v4 as uuid } from 'uuid';
import { db, objectId } from '../dbStrategy/mongo.js';
import joi from 'joi';
import TransacaoSchema from '../schemas/transacoes.js';






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
        type
    }

    const validacao = TransacaoSchema.validate(saida)

    if(validacao.error){
        res.status(422).send('campos incorretos')
    }
   

    const sectionExist = res.locals.sectionExist

    const idUsuario = sectionExist.userId
    const userExists = await db.collection("usuarios").findOne({_id:idUsuario})

    await db.collection('usuarios').updateOne(
        {_id:idUsuario},
        {$push:{transacoes:saida}}
        )


    res.send('deu certo')
}


export async function createMoneyIn(req, res){

    const {valor, descricao, type}= req.body

    const entrada = {
        valor,
        descricao,
        type
    }

    const validacao = TransacaoSchema.validate(entrada)

    if(validacao.error){
        res.status(422).send('campos incorretos')
    }



    const sectionExist = res.locals.sectionExist

    const idUsuario = sectionExist.userId
    const userExists = await db.collection("usuarios").findOne({_id:idUsuario})

    await db.collection('usuarios').updateOne(
        {_id:idUsuario},
        {$push:{transacoes:entrada}}
        )


    res.send(userExists)
}