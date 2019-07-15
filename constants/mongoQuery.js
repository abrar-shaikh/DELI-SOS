const schmaName = require('../constants').schemas;
const mongoose = require('mongoose');
const userModel = require('../schema/user')

function userProfileWithReview(id, flag) {

    if (flag == true) {
        return [
            {
                $match: {
                    _id: mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    foreignField: "_id",
                    localField: "review",
                    from: schmaName.reviews,
                    as: 'reviews_details'
                }
            },
            {
                $unwind: {
                    path: '$reviews_details'
                }
            },
            {
                $addFields: {
                    'reviews_details.totalLiked': { $size: "$reviews_details.likedBy" }
                }
            },
            {
                $group: {
                    _id: {
                        "userId": "$_id",
                        name: "$name",
                        profilePicture: "$profilePicture",
                        location: "$location",
                        locationVisible: "$locationVisible",
                        follower: "$follower",
                        following: "$following"
                    },
                    reviews_details: { "$push": "$reviews_details" }
                }
            },
            {
                $addFields: {
                    "_id.totalReviews": "",
                    "_id.totalFollower": { $size: "$_id.follower" },
                    "_id.totalFollowing": { $size: "$_id.following" }
                }
            },
            { $unwind: '$reviews_details' },
            {
                $lookup: {
                    foreignField: "_id",
                    localField: "reviews_details.restId",
                    from: schmaName.restaurants,
                    as: 'reviews_details.restaurant_details'
                }
            },
            {
                $unwind: '$reviews_details.restaurant_details'
            },
            {
                $addFields: {
                    "reviews_details.restaurantId": "$reviews_details.restaurant_details._id",
                    "reviews_details.restaurantName": "$reviews_details.restaurant_details.name",
                    'reviews_details.userProfilePicture': "$_id.profilePicture"
                }
            },
            {
                $project: {
                    "_id": 1,
                    "name": 1,
                    "profilePicture": 1,
                    "location": 1, "locationVisible": 1,
                    "reviews_details._id": 1,
                    "reviews_details.likedBy": 1,
                    "reviews_details.content": 1,
                    "reviews_details.rating": 1,
                    "reviews_details.likePlace": 1,
                    "reviews_details.createdAt": 1,
                    "reviews_details.totalLiked": 1,
                    "reviews_details.status": 1,
                    "reviews_details.restaurantId": 1,
                    "reviews_details.restaurantName": 1,
                    'reviews_details.userProfilePicture': 1
                }
            },
            {
                $group: {
                    "_id": "$_id",
                    "reviews": { $push: '$reviews_details' }
                }
            }
        ]
    } else {
        return [{ $match: { _id: mongoose.Types.ObjectId(id) } }, {
            $project: {
                'name': '$name',
                'email': '$email',
                'profilePicture': '$profilePicture',
                "locationVisible": '$locationVisible'
            }
        }]
    }
}

function getRestaurantDetail(id) {
    return [
        {
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                foreignField: "_id",
                localField: "reviews",
                from: schmaName.reviews,
                as: 'reviews_details'
            },
        },
        {
            $unwind: {
                path: '$reviews_details'
            }
        },
        {
            $match: {
                'reviews_details.status': {
                    $eq: 'ACTIVE'
                }
            }
        },
        {
            $addFields: {
                'reviews_details.totalLiked': { $size: "$reviews_details.likedBy" }
            }
        },
        {
            $group: {
                _id: {
                    "restId": '$_id',
                    name: '$name',
                    location: '$location',
                    photos: '$photos',
                    menu: '$menu',
                    description: '$description',
                    openTime: '$openTime',
                    closeTime: '$closeTime',
                    cuisin: '$cuisinOffered',
                    contactNumber: '$contactNumber',
                    website: '$website',
                    perPersonCost: '$perPersonCost',
                    photoByUser: '$photoByUser'
                },
                reviews_details: { "$push": "$reviews_details" }
            }
        },
        {
            $addFields: {
                "totalRatings": { $size: "$reviews_details" },
                "avgRating": { $avg: "$reviews_details.rating" }
            }
        },
        { $unwind: '$reviews_details' },
        {
            $lookup: {
                foreignField: "_id",
                localField: "reviews_details.restId",
                from: schmaName.restaurants,
                as: 'reviews_details.restaurant_details'
            }
        },
        {
            $lookup: {
                foreignField: "_id",
                localField: "reviews_details.userId",
                from: schmaName.users,
                as: 'reviews_details.user_details'
            }
        },
        {
            $unwind: '$reviews_details.user_details'
        },
        {
            $addFields: {
                'reviews_details.userId': '$reviews_details.user_details._id',
                'reviews_details.userName': '$reviews_details.user_details.name',
                'reviews_details.userProfilePicture': '$reviews_details.user_details.profilePicture',
                //'reviews_details.favourites': '$reviews_details.user_details.favourites'
            }
        },
        {
            $lookup: {
                foreignField: "_id",
                localField: "_id.photoByUser.userId",
                from: schmaName.users,
                as: 'photoByUserDetails'
            }
        },
        {
            $unwind: '$photoByUserDetails'
        },
        {
            $addFields: {
                '_id.photoByUser.userName': '$photoByUserDetails.name',
                '_id.photoByUser.userProfilePicture': '$photoByUserDetails.profilePicture'
            }
        },
        {
            $project: {
                "_id": 1, "name": 1,
                "totalRatings": 1,
                "avgRating": 1,
                "location": 1,
                "reviews_details._id": 1,
                "reviews_details.likedBy": 1,
                "reviews_details.content": 1,
                "reviews_details.rating": 1,
                "reviews_details.likePlace": 1,
                "reviews_details.createdAt": 1,
                "reviews_details.totalLiked": 1,
                "reviews_details.userId": 1,
                "reviews_details.userName": 1,
                "reviews_details.status": 1,
                "reviews_details.userProfilePicture": 1,
                // "reviews_details.user_details._id": 1,
                // "reviews_details.user_details.name": 1,
                // "reviews_details.user_details.profilePicture": 1
            }
        },
        {
            $group: {
                "_id": "$_id",
                "totalRatings": { $first: "$totalRatings" },
                "avgRating": { $first: "$avgRating" },
                "reviews": { $push: '$reviews_details' }
            }
        }

    ]
}

function showFavourites(id) {
    return [
        {
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                foreignField: '_id',
                localField: 'favourites',
                from: 'restaurants',
                as: 'favourites_details'
            }
        },
        {
            $unwind: '$favourites_details'
        },
        {
            $lookup: {
                foreignField: '_id',
                localField: 'favourites_details.reviews',
                from: schmaName.reviews,
                as: 'reviews_details'
            }
        },
        // {
        //     $match: {
        //         'reviews_details.status': {
        //             $eq: 'ACTIVE'
        //         }
        //     }
        // },
        // {
        //     $addFields: {
        //         "favourites_details.rating": { $avg: '$reviews_details.rating' },
        //         "favourites_details.dist": " "
        //     }
        // },
        {
            $group: {
                _id: {
                    'restId': '$favourites_details._id',
                    name: '$favourites_details.name',
                    cuisins: '$favourites_details.cuisinOffered',
                    location: '$favourites_details.location',
                    ratings: '$favourites_details.rating',
                    status: '$favourites_details.status'
                },
                reviews: { "$push": "$reviews_details" },
                location: { $first: '$location' }
            }
        },
        {
            $project: {
                'location': 1, '_id': 1,
                'reviews': 1
                // 'favourites_details._id': 1, 'favourites_details.name': 1,
                // 'favourites_details.location': 1, 'favourites_details.cuisin': 1,
                // "favourites_details.rating": 1
            }
        }
    ]
}

function filterRestaurant(data, flag) {

    if (flag == true) {
        console.log(data)
        return [
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { mealOffers: data.meal },
                                { mealOffers: 'ALL' }
                            ]
                        },
                        {
                            cuisinOffered: { $in: data.cuisins },
                            perPersonCost: { $gte: data.minBudget, $lte: data.maxBudget },
                            status: 'ACTIVE'
                        }
                    ]
                }
            },
            {
                "$unwind": {
                    path: "$reviews",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    foreignField: '_id',
                    localField: 'reviews',
                    from: schmaName.reviews,
                    as: 'reviews_details'
                }
            },
            {
                $group: {
                    _id: {
                        'restId': '$_id',
                        name: '$name',
                        cuisins: '$cuisinOffered',
                        location: '$location',
                        // reviews: '$reviews'
                    },
                    reviews: { $push: '$reviews_details' }
                }
            }
        ]
    }
    else {
        return [
          // {
          // $geoNear: {
          //               near: { type: data.location.type, coordinates: [data.location.coordinates[0], data.location.coordinates[1]] },
          //               distanceField: "dist.calculated",
          //               maxDistance: 100000,
          //               key: 'location',
          //               query: { status: status.active },
          //               num: 5, spherical: true
          //           }
          //         },
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { mealOffers: data.meal },
                                { mealOffers: 'ALL' }
                            ]
                        },
                        {
                            cuisinOffered: { $in: data.cuisins },
                            perPersonCost: { $gte: data.minBudget },
                            status: 'ACTIVE'
                        }
                    ]
                }
            },
            {
                "$unwind": {
                    path: "$reviews",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    foreignField: '_id',
                    localField: 'reviews',
                    from: schmaName.reviews,
                    as: 'reviews_details'
                }
            },
            {
                $group: {
                    _id: {
                        'restId': '$_id',
                        name: '$name',
                        cuisins: '$cuisinOffered',
                        location: '$location',
                        // reviews: '$reviews'
                    },
                    reviews: { $push: '$reviews_details' }
                }
            }
        ]
    }
}

function searchRestaurants(name) {
    return [
        {
            $match: {
                $and: [
                    {
                        $or: [{
                            name: { $regex: name, $options: 'i' }
                        },
                        {
                            cuisinOffered: { $elemMatch: { $regex: '^' + name, $options: 'i' } }
                        }]
                    },
                    {
                        status: 'ACTIVE'
                    }
                ]

            }
        },
        {
            "$unwind": {
                path: "$reviews",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                foreignField: '_id',
                localField: 'reviews',
                from: schmaName.reviews,
                as: 'reviews_details'
            }
        },
        // {
        //     $match: {
        //         'reviews_details.status': {
        //             $eq: 'ACTIVE'
        //         }
        //     }
        // },
        // {
        //     $addFields: {
        //         "ratings": { $avg: '$reviews_details.rating' },
        //     }
        // },
        {
            $group: {
                _id: {
                    'restId': '$_id',
                    name: '$name',
                    cuisins: '$cuisinOffered',
                    location: '$location',
                },
                reviews: { $push: '$reviews_details' }
            }
        }

    ]
}

function notificationList(id) {
    return [
        {
            $match: {
                receiver: mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                foreignField: '_id',
                localField: 'sender',
                from: schmaName.users,
                as: 'sender_details'
            }
        },
        {
            $lookup: {
                foreignField: '_id',
                localField: 'restId',
                from: schmaName.restaurants,
                as: 'restaurant_details'
            }
        },
        {
            $lookup: {
                foreignField: '_id',
                localField: 'reviewId',
                from: schmaName.reviews,
                as: 'review_details'
            }
        },
        {
            $project: {
                "_id": 1,
                "notificationType": 1,
                "createdAt":1,
                "sender_details._id": 1,
                "sender_details.name": 1,
                "sender_details.profilePicture": 1,
                "restaurant_details._id": 1,
                "restaurant_details.name": 1,
                "review_details._id": 1,
                "review_details.content": 1,
                "review_details.createdAt": 1
            }
        },
        {
            $group: {
                _id: {
                    notificationId: "$_id",
                    createdAt: '$createdAt',
                    // createdAt: { "$arrayElemAt": ["$review_details.createdAt", 0] } ,
                    notificationType: "$notificationType",
                    senderId: { "$arrayElemAt": ["$sender_details._id", 0] },
                    senderName: { "$arrayElemAt": ["$sender_details.name", 0] },
                    senderProfilePicture: { "$arrayElemAt": ["$sender_details.profilePicture", 0] },
                    restId: { "$arrayElemAt": ["$restaurant_details._id", 0] },
                    restName: { "$arrayElemAt": ["$restaurant_details.name", 0] },
                    reviewId: { "$arrayElemAt": ["$review_details._id", 0] },
                    reviewContent: { "$arrayElemAt": ["$review_details.content", 0] }
                }
            }
        },
        {
            $sort: { "_id.createdAt": -1 }
        }
    ]
}

module.exports = {
    userProfileWithReview,
    getRestaurantDetail,
    showFavourites,
    filterRestaurant,
    searchRestaurants,
    notificationList
}
