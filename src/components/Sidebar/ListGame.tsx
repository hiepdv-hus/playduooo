import React, {useEffect, useState} from "react";

import {BASE_URL, myFetch} from "../../common/utils/useReq.ts";
import useSWRImmutable from "swr/immutable";
import {useRecoilState} from "recoil";
import {navSelGameState} from "../../hooks/store.ts";
import {bg5, red1} from "../../common/utils/Styles.tsx";

interface ILGames {
    code: string;
    message: string;
    data: {
        [key: string]: {
            id: string;
            title: string;
            description: string;
            genre: string;
            thumbnail: string;
        }
    };
    links: null;
    relationships: null;
    timestamp: Date;
}


export const ListGame = () => {
    const {data} = useSWRImmutable(['/games'], {revalidateIfStale: false})
    const [navSelGame, setNavSelGame] = useRecoilState(navSelGameState)

    return (
        data && data?.data && Object.keys(data?.data).map((i, ii) =>
            <div
                key={`lg-${ii}`}
                style={{
                    border: data?.data[i]?.id  == navSelGame?.id ? `3px solid white` : "1px solid transparent",
                    background: bg5
                }}
                className={` hov-style-1 size-17  rounded-[12px] md:size-12 cursor-pointer my-2 cen-all `}>
                <img
                    onClick={() => {
                        setNavSelGame(data?.data[i])
                    }}
                    data-tooltip-id="my-main-menu-nav"
                    data-tooltip-content={data?.data[i].title}
                    src={`${BASE_URL}/file/path?path=${data?.data[i]?.thumbnail}`} key={`${data?.data[i]?.id}`} alt=""
                    className={`p-0.5 rounded-[12px] size-full hover:opacity-70 `}/>
            </div>)
    )
}