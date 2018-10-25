var userModel = require('../schema/user');
var restModel = require('../schema/restaurant');
var aboutModel = require('../schema/about_Privacy')
var bcrypt = require('bcrypt');
var util = require('../app util/util');
var code = require('../constants').http_codes;
var msg = require('../constants').messages;
var role = require('../constants').roles;
var status = require('../constants').status;
var reviews = require('../schema/review');
var jwt = require('jsonwebtoken')
var Type = require('../constants').Type;
var aboutUs = 0;
var privacyPolicy = 0;
//admin signup function which register admin filtering from email and password validation nd also check email already exist or not
async function createAdmin(req, res) {
    let data = req.body;
    if (await userModel.findOne({ email: data.email })) {
        return res.json({ code: code.badRequest, message: msg.emailAlreadyRegistered });
    }
    else {
        if (util.validateEmail(data.email)
            && util.validatePassword(data.password)) {
            let user = new userModel(data)
            user.role = role.ADMIN  //assign bydefault role admin
            user.password = bcrypt.hashSync(data.password, 11)
            user.save((err, data) => {
                return (err) ?
                    res.json({ code: code.internalError, message: msg.internalServerError }) :
                    res.json({ code: code.created, message: msg.registered, data: data })
            });
        }
        else {
            return res.json({ code: code.badRequest, message: msg.invalidEmailPass })
        }
    }
}

//this is a login function of admin. it returns token which expires in 1hr and result:id,mail and role
async function authenticateAdmin(req, res) {
    let data = req.body;
    await userModel.findOne({ email: data.email, role: role.ADMIN }, (err, result) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!result) {
            return res.json({ code: code.notFound, message: msg.adminNotFound })
        }
        else {
            if (bcrypt.compareSync(data.password, result.password)) {
                let token = util.generateToken(result, process.env.admin_secret)//config.secret=admin@codezero
                return res.json({ code: code.ok, message: msg.loggedIn, token: token, data: result })
            }
            else {
                return res.json({ code: code.badRequest, message: msg.invalidPassword })
            }
        }
    })
}

// async function manageSocialLogin(req, res) {
//     let data = req.body
//     let user = new userModel(data)
//     await userModel.findOne({ socialId: data.socialId }, (err, data) => {
//         if (err) {
//             return json({ code: code.internalError, message: msg.internalServerError })
//         }
//         else if (!data) {
//             user.isSocialLogin = true
//             user.role = role.ADMIN
//             user.save((err, result) => {
//                 if (err) {
//                     return res.json({ code: code.internalError, message: msg.internalServerError })
//                 }
//                 else {
//                     let token = util.generateToken(result, config.secret)
//                     return res.json({ code: code.ok, message: msg.loggedIn, token: token })
//                 }
//             })
//         }
//         else {
//             let token = util.generateToken(data, config.secret)
//             return res.json({ code: code.ok, message: msg.loggedIn, token: token })
//         }
//     })
// }

async function resetPassword(req, res) {
    let newpass = util.generateRandomPassword().toUpperCase()
    let hash = bcrypt.hashSync(newpass, 11)

    await userModel.findOneAndUpdate({ email: req.body.email, role: role.ADMIN }, { password: hash }, { new: true }, async (err, result) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
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

async function getUsers(req, res) {
    userModel.find({ role: role.USER, status: status.active }, (err, result) => {
        return (err) ? res.json({ code: code.internalError, message: internalServerError })
            : res.json({ code: code.ok, message: msg.ok, data: result })
    })
}

async function getUserDetail(req, res) {
    let id = req.params.id
    userModel.findOne({ _id: id }, (err, result) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!result) {
            return res.json({ code: code.notFound, message: msg.userNotFound })
        }
        else {
            return res.json({ code: code.ok, message: msg.ok, data: result })
        }
    })
}

async function createUser(req, res) {
    console.log("in  create user api", req.body)
    let data = req.body;
    if (await userModel.findOne({ email: data.email })) {
        return res.json({ code: code.badRequest, message: msg.emailAlreadyRegistered });
    }
    else {
        console.log(util.validatePassword(data.password))
        if (util.validateEmail(data.email)
            && util.validatePassword(data.password)) {
            let user = new userModel(data)
            user.password = bcrypt.hashSync(data.password, 11)
            user.save((err, data) => {
                // if(err){console.log("error in create user api",err)}
                // else{console.log("message:user successfully created")}
                return (err) ?
                    res.json({ code: code.internalError, message: err }) :
                    res.json({ code: code.created, message: msg.registered, data: data })
            });
        }
        else {
            return res.json({ code: code.badRequest, message: msg.invalidEmailPass })
        }
    }
}

async function updateUserDetail(req, res) {
    let id = req.params.id;
    await userModel.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true }, (err, data) => {
        if (err) {
            res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            res.json({ code: code.notFound, message: msg.userNotFound })
        }
        else {
            res.json({ code: code.ok, message: msg.updated, data: data })
        }
    })
}

async function addRestaurant(req, res) {

    req.body.location = {
        type: "Point",
        coordinates: [req.body.longitude, req.body.latitude]
    }
    let rest = new restModel(req.body)
    let obj = util.decodeToken(req.headers['authorization'])
    rest.createdBy = obj.id;
    rest.status = status.active;
    rest.save((err, data) => {
        console.log(err)
        return (err) ? res.json({ code: code.internalError, message: msg.internalServerError }) :
            res.json({ code: code.created, message: msg.restAddSucessfully, data: data })
    })
}

async function getRestaurantDetails(req, res) {
    let id = req.params.id
    await restModel.findById({ _id: id }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.restNotFound })
        }
        else {
            return res.json({ code: code.ok, message: msg.ok, data: data })
        }
    })
}

async function getRestaurantList(req, res) {
    restModel.find(({ $or: [{ status: status.inactive }, { status: status.active }] }), (err, result) => {
        if (err) {
            console.log("error", err)
            res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else {
            res.json({ code: code.ok, message: msg.ok, data: result })
        }
    })
}

async function updateRestaurant(req, res) {
    let id = req.params.id;
    obj = util.decodeToken(req.headers['authorization'])
    req.body.editedBy = obj.id
    await restModel.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true }, (err, data) => {
        if (err) {
            res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            res.json({ code: code.notFound, message: msg.restNotFound })
        }
        else {
            res.json({ code: code.ok, message: msg.updated, data: data })
        }
    })
}

async function deleteRestaurant(req, res) {
    restModel.findByIdAndUpdate({ _id: req.params.id },
        { $set: { status: status.inactive } }, { new: true }, (err, data) => {
            console.log(err)
            if (err) {
                return res.json({ code: code.internalError, message: msg.internalServerError })
            }
            else if (!data) {
                return res.json({ code: code.notFound, message: msg.restNotFound })
            }
            else {
                return res.json({ code: code.ok, message: msg.ok, data: data })
            }
        })
}

// async function uploadPhoto(req, res) {
//     util.uploadPhoto(req).then((data) => {
//         return res.json({ code: code.created, message: msg.imageUploaded, url: data })
//     }).catch((err) => {
//         return res.json({ code: code.internalError, message: msg.internalServerError })
//     })

// }
function uploadPhoto(req, res) {
    req.newFile_name = [];

    util.upload(req, res, function (err) {
        if (err) {
            return res.json({ code: code.badRequest, message: err })
        }
        else {
            console.log(req.newFile_name)
            var response = req.newFile_name.map((result) => {
                result = process.cwd() + '/img/' + result;
                console.log(result);
                return result;
            })
            return res.json({ code: code.created, message: msg.ok, data: response })
        }
    });
}

async function deleteRestaurantPhoto(req, res) {
    url = req.body.url
    id = req.body.restId
    restModel.findOneAndUpdate({ _id: id }, { $pull: { photos: url } }, (err, data) => {
        return (err) ? res.json({ code: code.internalError, message: msg.internalServerError }) :
            res.json({ code: code.ok, message: msg.imageDeleted })
    })
}


async function deleteUser(req, res) {
    await userModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: status.inactive } }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.userNotFound })
        }
        else {
            return res.json({ code: code.ok, message: msg.userDelete })
        }
    })
}

// async function whatuLike(req, res) {
//     meal = req.body.meal;
//     console.log("meal", meal)
//     await restModel.find(({ mealOffers: meal, mealOffers: 'ALL' }), async(err, data) => {
//         if (err) {
//             return res.json({ code: code.internalError, message: msg.internalError })
//         }
//         else if (data.length < 1) {
//             return res.json({ code: code.badRequest, message: msg.noMealOffer })
//         }
//         else {
//             var arr=[]

//             for (let j = 0; j < data.length; j++) {
//                 for (let i = 0; i < data[j].cuisin.length; i++) {
//                     console.log("cui",data[j].cuisin)
//                     console.log("cui name",data[j].cuisin[i].name)
//                     // console.log("i and j", data[j].cuisin[i].name)
//                     let cui = data[j].cuisin[i].name;
//                     if(req.body.cuisin==data[j].cuisin[i].name)
//                     {
//                         var obj={
//                             name:data[j].name
//                         }
//                         arr.push(obj);

//                     }

//                 }
//             }
//             console.log("arrFinal",arr)
//             return res.json({ code: code.ok,data:arr})
//             }
//     })
// }

//pending for multiple cuisins,range
// async function whatuLike(req, res) {
//     meal = req.body.meal;
//     cui = req.body.cuisin;
//     // console.log("cuisin array", cui)
//     // cuii=cuisin.name;

//     await restModel.find(({ mealOffers: meal, mealOffers: 'ALL'},{ perPersonCost: { $gte: req.body.min, $lte: req.body.max }}), async (err, data) => {
//         if (err) { return res.json({ code: code.internalError, message: msg.internalServerError }) }
//         else {
//             // console.log("------cuisin",JSON.stringify(data[0].cuisin[0].name))
//             return res.json({ code: code.ok, data: data })
//         }
//     })
// }
//returning unique cuisin function getCuisin
async function getCuisin(req, res) {
    await restModel.aggregate([
        {
            $project: {
                cuisin: 1
            }
        },
        {
            $unwind: '$cuisin'
        },

        {
            $group: {
                _id: '$cuisin.name',
                image: { $first: '$cuisin.image' }

            }
        }
    ]).exec((err, data) => {
        if (err) {
            // console.log("jiiiiiiiiii", err)
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.restNotFound })
        }
        else {
            // console.log("data cuisin name",data)
            return res.json({ code: code.ok, data: data })


        }
    })

}
async function searchRestaurant(req, res) {
    restModel.find({ name: new RegExp('^' + req.params.name, "i") }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else {
            return res.json({ code: code.ok, data: data })
        }
    });

}


async function approveRestaurantProposal(rest_id, res) {
    restModel.findByIdAndUpdate({ _id: rest_id },
        { $set: { status: status.active } }, { new: true }, (err, data) => {
            if (err) {
                return res.json({ code: code.internalError, message: msg.internalServerError })
            }
            else if (!data) {
                return res.json({ code: code.notFound, message: msg.restNotFound })
            }
            else {
                return res.json({ code: code.ok, message: msg.ok, data: data })
            }
        })
}


function getAllPendingRestaurant(req, res) {
    // url = req.body.url
    // id = req.body.restId
    restModel.find({ status: status.pending }, (err, data) => {

        return (err) ? res.json({ code: code.internalError, message: msg.internalServerError }) :
            res.json({ code: code.ok, data: data })
    })
}

function restaurantCounts(req, res) {
    restModel.find({ status: status.active }, (err, results) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else {
            var count = results.length
            // console.log("no. of restaurant", count)
            // return res.json({count:count});
            return res.json({ code: code.ok, message: msg.ok, data: count })
        }
    });

}

function userCounts(req, res) {
    console.log("in noofuser")
    userModel.find({ $and: [{ status: status.active }, { role: role.USER }] }, (err, results) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else {
            var count = results.length
            console.log("no. of users", count)
            return res.json({ code: code.ok, message: msg.ok, data: count })
        }
    });

}
function reviewCounts(req, res) {
    reviews.find({ status: status.active }, (err, results) => {
        if (err) {
            // console.log("error in noofreviews", err)
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (results.length == 0) {
            return res.json({ code: code.notFound, message: msg.reviewsNotFound })
        }
        else {
            // console.log("data cuisin name",data)
            // console.log("reviews", results.length)
            return res.json({ code: code.ok, data: results })


        }
    });

}

async function verifyToken(req, res) {
    let token = req.headers['authorization']

    await jwt.verify(token, process.env.admin_secret, (err) => {
        if (err) {
            return res.json({ code: code.badRequest, message: msg.invalidToken })
        }
        else {
            return res.json({ code: code.ok, message: msg.ok })
        }
    })

}

async function addAboutUs(req, res) {
    if (aboutUs == 0) {
        aboutUs++;
        let about = new aboutModel(req.body)
        about.type = "About_Us"
        await about.save((err, data) => {
            return (err) ? res.json({ code: code.internalError, message: msg.internalServerError }) :
                res.json({ code: code.created, message: msg.contentSaved, data: data })
        })
    } else { res.json({ code: code.badRequest, message: "About us already added" }) }
}

async function aboutUsList(req, res) {
    await aboutModel.find({ $and: [{ status: status.active }, { type: Type.about }] }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.restNotFound })
        }
        else {
            return res.json({ code: code.ok, message: msg.ok, data: data })
        }
    })
}

async function deleteAboutUs(req, res) {

    await aboutModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: status.inactive } }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.contentNotFound })
        }
        else {
            aboutUs--;
            return res.json({ code: code.ok, message: msg.contentDel })
        }
    })
}

async function updateAboutUs(req, res) {
    let id = req.params.id;
    await aboutModel.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true }, (err, data) => {
        if (err) {
            res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            res.json({ code: code.notFound, message: msg.contentNotFound })
        }
        else {
            res.json({ code: code.ok, message: msg.contentSaved, data: data })
        }
    })
}

async function addPrivacyPolicy(req, res) {
    if (privacyPolicy == 0) {
        privacyPolicy++;
        let about = new aboutModel(req.body)
        about.type = "Privacy_Policy"
        await about.save((err, data) => {

            return (err) ? res.json({ code: code.internalError, message: msg.internalServerError }) :
                res.json({ code: code.created, message: msg.contentSaved, data: data })
        })
    }
    else { res.json({ code: code.badRequest, message: "Privacy Policy already added" }) }
}

async function privacyPolicyList(req, res) {
    await aboutModel.find({ $and: [{ status: status.active }, { type: Type.privacy }] }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.restNotFound })
        }
        else {
            return res.json({ code: code.ok, message: msg.ok, data: data })
        }
    })
}

async function updatePrivacyPolicy(req, res) {
    let id = req.params.id;
    await aboutModel.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true }, (err, data) => {
        if (err) {
            res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            res.json({ code: code.notFound, message: msg.contentNotFound })
        }
        else {
            res.json({ code: code.ok, message: msg.contentSaved, data: data })
        }
    })
}

async function deletePrivacyPolicy(req, res) {
    await aboutModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: status.inactive } }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.contentNotFound })
        }
        else {
            privacyPolicy--;
            return res.json({ code: code.ok, message: msg.contentDel })
        }
    })
}

async function getContactRequest(req, res) {
    await aboutModel.find({ $and: [{ status: status.pending }, { type: Type.contact }] }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.contentNotFound })
        }
        else {
            return res.json({ code: code.ok, message: msg.ok, data: data })
        }
    })
}

async function resolveContactRequest(req, res) {
    let id = req.params.id;
    await aboutModel.findByIdAndUpdate({ _id: id }, { $set: { status: status.resolved } }, { new: true }, (err, data) => {
        if (err) {
            res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            res.json({ code: code.notFound, message: msg.contentNotFound })
        }
        else {
            res.json({ code: code.ok, message: msg.resolved, data: data })
        }
    })
}

async function addCuisin(req, res) {
    userModel.findOneAndUpdate({ role: "ADMIN" }, { $push: { cuisin: req.body.cuisin } },
        { new: true },
        (err, data) => {
            if (err) {
                console.log("err in array updation ")
            } else { return res.json({ msd: "added successfully" }) }
        });


}

//from which i have to find cuisin.name
async function searchCuisin(req, res) {
    userModel.find({ cuisin: new RegExp('^' + req.body.name, "i") }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else {
            return res.json({ code: code.ok, data: data })
        }
    });

}

//want to give only Active cuisin
async function getCuisinList(req, res) {
    await userModel.aggregate([
        {
            // $match: {
            //     status: "INACTIVE"
            // },
            $project: {
                cuisin: 1
            }
        },
        {
            $unwind: '$cuisin'
        },

        {
            $group: {
                _id: '$cuisin.name',
                image: { $first: '$cuisin.image' },
                // status: '$cuisin.status',
                status:  { $first: '$cuisin.status' } 
            }
        }
    ]).exec((err, data) => {
        if (err) {
            console.log("jiiiiiiiiii============>", err)
            return res.json({ code: code.internalError, message: msg.internalServerError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.restNotFound })
        }
        else {
            // console.log("data cuisin name",data)
            return res.json({ code: code.ok, data: data })


        }
    })

}

async function deleteCuisin(req, res) {
    await userModel.findByIdAndUpdate({ id: req.params.id }, { $set: { status: status.inactive } }, (err, data) => {
        if (err) {
            return res.json({ code: code.internalError, message: msg.internalError })
        }
        else if (!data) {
            return res.json({ code: code.notFound, message: msg.contentNotFound })
        }
        else {
            return res.json({ code: code.ok, message: msg.contentDel })
        }
    })
}
module.exports = {
    createAdmin,
    authenticateAdmin,
    resetPassword,
    getUsers,
    getUserDetail,
    createUser,
    updateUserDetail,
    // manageSocialLogin,
    addRestaurant,
    getRestaurantDetails,
    getRestaurantList,
    updateRestaurant,
    deleteRestaurant,
    uploadPhoto,
    deleteRestaurantPhoto,
    deleteUser,
    // whatuLike,
    getCuisin,
    searchRestaurant,
    approveRestaurantProposal,
    getAllPendingRestaurant,
    restaurantCounts,
    userCounts,
    reviewCounts,
    verifyToken,
    addAboutUs,
    aboutUsList,
    deleteAboutUs,
    updateAboutUs,
    addPrivacyPolicy,
    privacyPolicyList,
    updatePrivacyPolicy,
    deletePrivacyPolicy,
    getContactRequest,
    resolveContactRequest,
    addCuisin,
    searchCuisin,
    getCuisinList,
    deleteCuisin
}