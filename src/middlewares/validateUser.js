import {db} from "../dbStrategy/mongo.js"

async function validateUser(req, res, next){
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ",'')

    const sectionExist = await db.collection('sessoes').findOne({token:token})

    if(!sectionExist){
        res.status(400).send('nao existe esse token')
        return
    }

    res.locals.sectionExist = sectionExist

    next()
}

export default validateUser