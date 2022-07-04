import joi from "joi";


const TransacaoSchema = joi.object({
    valor: joi.number().required(),
    descricao: joi.string().required(),
    type: joi.string().valid("entrada", "saida"),
    time: joi.string().required()
})

export default TransacaoSchema