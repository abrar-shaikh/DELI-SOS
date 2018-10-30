let schmaName = require('../constants').schemas;
let mongoose = require('mongoose');

function userProfileWithReview(id, flag) {
    if (flag) {
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
                        following: "$following",
                    },
                    reviews_details: { "$push": "$reviews_details" }
                }
            },
            {
                $addFields: {
                    "totalReviews": { $size: "$reviews_details" }
                }
            },

            {
                $addFields: {
                    "totalFollower": { $size: "$_id.follower" },
                    "totalFollowing": { $size: "$_id.following" }
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
                $project: {
                    "_id": 1, "name": 1,
                    "profilePicture": 1,
                    "location": 1, "locationVisible": 1,
                    "reviews_details._id": 1,
                    "reviews_details.likedBy": 1,
                    "reviews_details.content": 1,
                    "reviews_details.rating": 1,
                    "reviews_details.likePlace": 1,
                    "reviews_details.createdAt": 1,
                    "reviews_details.totalLiked": 1,
                    "reviews_details.restaurant_details.name": 1,
                    'totalReviews': 1, 'totalFollower': 1,
                    'totalFollowing': 1, 'restaurant': 1
                }
            },
            {
                $group: {
                    "_id": "$_id",
                    "totalFollower": { $first: '$totalFollower' },
                    "totalFollowing": { $first: '$totalFollower' },
                    "totalReviews": { $first: "$totalReviews" },
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

function getRestaurantDetail(id){
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
                    cuisin: '$cuisin',
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
                "reviews_details.restaurant_details._id": 1,
                "reviews_details.restaurant_details.name": 1,
                "reviews_details.user_details._id": 1,
                "reviews_details.user_details.profilePicture": 1
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

function showFavourites(id){
    return[
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
        {
            $addFields: {
                "favourites_details.rating": { $avg: '$reviews_details.rating' },
                "favourites_details.dist": " "
            }
        },
        {
            $project: {
                'location': 1, '_id': 0,
                'favourites_details._id': 1, 'favourites_details.name': 1,
                'favourites_details.location': 1, 'favourites_details.cuisin': 1,
                "favourites_details.rating": 1
            }
        }
    ]
}

module.exports = {
    userProfileWithReview,
    getRestaurantDetail,
    showFavourites
}