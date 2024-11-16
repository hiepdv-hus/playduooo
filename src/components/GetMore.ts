// @flow

import useSWR from "swr";
import {myFetch} from "../common/utils/useReq.ts";




export function GetUserByID(userID: string) {
    return useSWR([`/users/user_id?user_id=${userID}`, {}, {method: 'PATCH'}], myFetch)
    // return data
}