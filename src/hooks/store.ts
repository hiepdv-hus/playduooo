import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";
import {IUser} from "../pages/PlayerDetail/PlayerDetail.tsx";

const {persistAtom} = recoilPersist({

})

export const currentUserState = atom({
    key: 'currentUser',
    default: {},
    effects_UNSTABLE: [persistAtom],
})


export const isLoginState = atom({
    key: 'isLoginGlobal',
    default: false,
})

export const selUserState = atom({
    key: 'selUser',
    default: <IUser>{},
})

export const isAdminState = atom({
    key: 'isAdminGlobal',
    default: false,
})
export const navSelGameState = atom({
    key: 'navSelGamelobal',
    default: <{
        id: string;
        title: string;
        description: string;
        genre: string;
        thumbnail: string;
    }>{},
})