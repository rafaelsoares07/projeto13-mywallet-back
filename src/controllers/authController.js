import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db, objectId } from '../dbStrategy/mongo.js';
import joi from 'joi';

//ESQUEMAS DE VALIDAÇÃO
const createUserSchema = joi.object({

    name:joi.string().trim().required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    passwordConfirm:joi.string().required()
  
})



export async function createUser(req, res) {
    
    const user = req.body

    const validation = createUserSchema.validate(user)

    if(validation.error){
        res.status(400).send('Não passou na validacao do joi')
        return
    }

    const userExist = await db.collection("usuarios").findOne({email:user.email})

    if(userExist){
        res.status(400).send('usuario ja existe')
        return 
    }

    const passwordHash = bcrypt.hashSync(user.password, 10)

    if(user.password != user.passwordConfirm){
        res.status(400).send("Senhas precisam ser identicas ")
        return
    }

    await db.collection("usuarios").insertOne({...user, password:passwordHash, passwordConfirm:true, transacoes:[{value:2000, type:'saida'}]});
    
    res.status(200).send('deu certinho')
   
}

export async function loginUser(req, res){
    const user = req.body

    const userExists = await db.collection("usuarios").findOne({email:user.email})

    if(!userExists){
        console.log('user nao existe doidao ')
        res.status(400).send('usuario nao existe')
        return 
    }

    const validPassword = bcrypt.compareSync(user.password, userExists.password)
   

    if(!validPassword){
        console.log('nao consegui logar ')
        res.status(400).send('Email ou senha não existem no servidor ')
        return 
    }

   

    const sectionExists = await db.collection("sessoes").findOne({userId:objectId(userExists._id)})
    
    if(!sectionExists){
        const token = uuid()

        const novaSection = {
            userId: userExists._id,
            token
        }
        await db.collection("sessoes").insertOne(novaSection)
        
        res.send(token)
        return
    }

    console.log( 'logou')

    const aux = {
        sectionExists,
        userExists
    }
    res.status(200).send(aux)
   
}