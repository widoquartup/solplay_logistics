export function joinUser() {
    return [
        {
            $addFields: {
                user_id_oid: {
                    $convert: {
                        input: '$user_id',
                        to: 'objectId',
                        onError: null
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id_oid',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $addFields: {
                user_name: { $arrayElemAt: ['$user.name', 0] },
                user_email: { $arrayElemAt: ['$user.email', 0] },
                user_id_oid: '$$REMOVE',
                user: '$$REMOVE'

            }
        },
    ];
}
