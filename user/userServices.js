var userModel = require('../schema/userSchema');
var bcrypt = require('bcrypt');
var util = require('../app util/util');
var config = require('./userConfig');
var code = require('../constants').http_codes;
var msg = require('../constants').messages;
var role = require('../constants').roles;

async function createUser(req, res) {
    let data = req.body;
    if (await userModel.findOne({ email: data.email })) {
        return res.json({ code: code.badRequest, message: msg.emailAlreadyRegistered });
    }
    else {
        if (util.validateEmail(data.email)
            && util.validatePassword(data.password)) {
            let user = new userModel(data)
            user.role = role.USER
            user.password = bcrypt.hashSync(data.password, 11)
            user.save((err, data) => {
                return (err) ?
                    res.json({ code: code.ineternalError, message: msg.internalServerError }) :
                    res.json({ code: code.created, message: msg.registered, data: data })
            });
        }
        else {
            return res.json({ code: code.badRequest, message: msg.invalidEmailPass })
        }
    }
}

async function authenticateUser(req, res) {
    let data = req.body;
    await userModel.findOne({ email: data.email, role: role.USER }, (err, result) => {
        if (err) {
            return res.json({ code: code.ineternalError, message: msg.internalServerError })
        }
        else if (!result) {
            return res.json({ code: code.notFound, message: msg.userNotFound })
        }
        else {
            if (bcrypt.compareSync(data.password, result.password)) {
                let token = util.generateToken(result, config.secret)
                return res.json({ code: code.ok, message: msg.loggedIn, token: token })
            }
            else {
                return res.json({ code: code.badRequest, message: msg.invalidPassword })
            }
        }
    })
}

async function resetPassword(req, res) {
    let newpass = util.generateRandomPassword().toUpperCase()
    let hash = bcrypt.hashSync(newpass, 11)

    await userModel.findOneAndUpdate({ email: req.body.email, role: role.USER }, { password: hash }, { new: true }, async (err, result) => {
        if (err) {
            return res.json({ code: code.ineternalError, message: msg.internalServerError })
        }
        else if (!result) {
            return res.json({ code: code.notFound, message: msg.emailNotFound })
        }
        else {
            await util.sendEMail(result.email, newpass).then((data) => {
                return (data == true) ? res.json({ code: code.ok, message: `password sent on ${result.email}` })
                    : res.json({ code: code.notImplemented, message: msg.mailNotSent })
            }).catch((err) => {
                return res.json({ code: code.notImplemented, message: msg.mailNotSent })
            })
        }
    })
}

async function fetchDetail(req, res) {
    let id = req.params.id
    userModel.findOne({ _id: id }, (err, result) => {
        if (err) {
            console.log(err)
            return res.json({ code: code.ineternalError, message: msg.internalServerError })
        }
        else if (!result) {
            return res.json({ code: code.notFound, message: msg.userNotFound })
        }
        else {
            return res.json({ code: code.ok, message: msg.ok, data: result })
        }
    })
}


module.exports = {
    createUser,
    authenticateUser,
    resetPassword,
    fetchDetail
}