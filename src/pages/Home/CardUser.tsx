// @flow
import {Link} from "react-router-dom";
import {bg4, bg5, red1, red2} from "../../common/utils/Styles.tsx";
import {arFetcher, getStaticFile} from "../../common/utils/useReq.ts";
import {formatCurrency} from "../../common/utils/utils.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import star from '../../images/home/star.svg'
import {useEffect, useState} from "react";
import useSWR from "swr";
import './index.scss'

interface ICardUser{
    id: string,
    avatar: string | null,
    price: string | number | null,
    completion_rate: string | number | null,
    name: string,
    games?: {
        id?: string;
        name?: string
    } []

}

export interface IGames {
    code:          string;
    message:       string;
    data:          { [key: string]: {
            id:          string;
            title:       string;
            description: string;
            genre:       string;
            thumbnail:   string;
            tags: { id: string, name: string }[]
        }
    };
    links:         null;
    relationships: null;
    timestamp:     Date;
}

export function CardUser({id, avatar, price, completion_rate, name, games}: ICardUser) {
    const [arImg, setArImg] = useState<any[]>([])
    const {data: dtArFetch} = useSWR(arImg?.length ? arImg : null, arFetcher)

    useEffect(() => {
        if(games?.length){
            const a = games.map((i) => [`/games/game_id?game_id=${i?.id}`, {}, {method: 'PATCH'}])
            setArImg(a)
        }
    }, [games])

    return (
        <Link
            to={`/user/${id}`}
            style={{background: '#fff'}}
            className={`cardUser relative sm:w-full mx-auto w-[90%] sm:h-70 h-25 hov-style-1 rounded-xl cursor-pointer`}>

            {avatar && avatar != "string" ?
                <img src={`${getStaticFile(avatar)}`}
                     className={`p-0.5 absolute top-0 sm:h-[70%] h-full left-0 sm:w-full w-25 rounded-xl`}
                     alt=""/>
                :
                <div className={`absolute top-0 sm:h-2/3 h-full left-0 sm:w-full w-25 rounded-xl`}
                     style={{border: ".5px solid rgba(255,255,255,.3)"}}/>
            }
            <div
                style={{background: red2}}
                className={`sm:rounded-[12px] rounded-[8px] w-20 sm:h-7 h-5 cen-all text-xs font-thin sm:font-normal absolute sm:bottom-[30%] sm:mb-2 sm:right-2 
                        text-white right-[calc(100%-(6.25rem*2)+.75rem)] bottom-2`}>
                {formatCurrency(price)} đ/h
            </div>

            {/*Content*/}
            <div
                className={`w-[calc(100%-6.25rem)] sm:w-full sm:flex sm:flex-col justify-between sm:h-[30%] h-full text-dark absolute sm:top-[70%] sm:left-0 left-25 top-0  rounded-br-xl rounded-bl-xl px-2 py-1`}>
                <div className={`text-md font-bold max-h-[50px] overflow-hidden text-ellipsis`}>{name}</div>

                <div className={`text-xs relative w-full h-[30px]`}>{
                    dtArFetch && (dtArFetch as IGames[]).map((i, ii) =>
                        Object.keys(i?.data)?.map((j, ij) =>
                            <div key={`${ij}-${j}`} className={` rounded-full size-[30px] bg-white  absolute top-0`}
                                 style={{left: ii * 20, padding: 1}}>
                                <img src={getStaticFile(i?.data[j]?.thumbnail)} className={`rounded-full size-full`} alt=""/>
                            </div>
                        )

                    )}</div>
                <div className={`my-r mt-4 sm:mt-0 w-full h-[20px]`}>
                    <div className={`w-2/3`}></div>
                    <div className={`text-sm my-r justify-end w-1/3 gap-1`}>
                        <img src={star} alt="" className="w-[10px]"/>
                        {completion_rate || 0}
                        </div>
                </div>
            </div>

        </Link>
    );
}