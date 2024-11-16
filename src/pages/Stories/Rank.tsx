import IconClose from "../../images/icon/icon-close.svg"
import {useEffect, useRef, useState} from "react";
import No1BG from "../../images/player/no1-player.png"
import {hideByCls} from "../../components/VisibleControl.tsx";
import {red1} from "../../common/utils/Styles.tsx";
import useSWR from "swr";
import {CusButton} from "../../components/CusButton.tsx";
import {IUser} from "../PlayerDetail/PlayerDetail.tsx";
import {getStaticFile} from "../../common/utils/useReq.ts";
import {Spinner} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {formatCurrency} from "../../common/utils/utils.ts";


export interface IRank {
    code: string;
    message: string;
    data: {
        [key: string]: { //top_rented...
            user: {
                [key: string]: {
                    id: string;
                    name: string;
                    location: null | string;
                    completion_rate: null;
                    username: string;
                    price: number;
                    avatar: string;
                    email: string;
                    birthday: string;
                    sex: string;
                    roles: {
                        id: string;
                        name: string;
                    }[];
                    games: {
                        id: string;
                        name: string;
                    }[];
                    balance: number | null;
                }
            };
            total_spent: number;
        }[];
    };
    links: null;
    relationships: null;
    timestamp: Date;
}


const Rank = () => {
    const clsCtn = "min-h-[520px] max-h-[520px] bg-[#151414]"
    const [tab, setTab] = useState(1)

    const [viewType, setViewType] = useState<string>("top_rented_users")
    const refTitle = useRef<HTMLDivElement>(null)
    const [durationQ, setDurationQ] = useState("7 days")
    const {
        data: dtRankAll,
        isLoading: isLoadingDtRankAll
    } = useSWR<IRank>([`/rental_applications/filter_duration?duration=${durationQ}`])

    const [dataView, setDataView] = useState<{ user: IUser, total_spent: number }[]>([])


    useEffect(() => {
        if (dtRankAll && dtRankAll.data && dtRankAll.data[viewType].length) {
            const a = []
            for (const i of dtRankAll.data[viewType]) {
                for (const j in i?.user) {
                    a.push({total_spent: i?.total_spent, user: i?.user[j]})
                }
            }
            setDataView(a)
            return
        }
        setDataView([])

    }, [dtRankAll, viewType])


    const Divider1 = () => {
        return (
            <div className='h-[1px] w-full mt-3' style={{background: "rgba(43, 43, 45, 1)"}}/>
        )
    }


    const getIndicatorStyle = (x: number): object => {
        const add = x == tab && {borderBottom: '2px solid rgba(219, 82, 71, 1)'}
        return {

            flex: 1,
            textAlign: "center",
            paddingTop: 5,
            paddingBottom: 5,
            userSelect: 'none',
            cursor: 'pointer',
            borderBottom: '2px solid transparent',
            ...add
        }
    }

    return (
        <div
            style={{zIndex: 123}}
            className={"hidden rankstr"} onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('rankstr')) hideByCls('rankstr')

        }}>
            <div
                className='absolute bg-[#151414] w-[350px] left-2/4 sm:w-[450px] min-h-[710px] rounded-[5px] -translate-x-2/4'
                style={{top: 25}}>

                <div className="my-r justify-between mt-3">
                    <div className='w-6'/>
                    <div ref={refTitle} className='text-white select-none font-bold text-title-xsm'
                         style={{color: red1}}>
                        BẢNG XẾP HẠNG USER
                    </div>
                    <div className='pr-3 select-none' onClick={() => {
                        hideByCls('rankstr')
                    }}>
                        <img src={IconClose} className='w-6 cursor-pointer ' alt=""/>
                    </div>
                </div>

                <Divider1/>

                <div className='my-r justify-around text-white mt-2 text-sm'>
                    <div style={getIndicatorStyle(0)} className={` duration-150 ease-linear`} onClick={() => {
                        setTab(0)
                        setDurationQ("3 days")
                    }}>3 Ngày qua
                    </div>
                    <div style={getIndicatorStyle(1)} className={` duration-150 ease-linear`} onClick={() => {
                        setTab(1)
                        setDurationQ("7 days")
                    }}>7 Ngày qua
                    </div>
                    <div style={getIndicatorStyle(2)} className={` duration-150 ease-linear`} onClick={() => {
                        setTab(2)
                        setDurationQ('1 month')
                    }}>1 tháng qua
                    </div>
                </div>


                {isLoadingDtRankAll ?
                    <div className={`${clsCtn} flex justify-center items-center`}><Spinner color={"white"}/></div> :
                    <div className={`${clsCtn} overflow-y-auto`}>
                        {dataView.length &&
                            <div>
                                <div className={'w-45 mx-auto my-2 relative'} style={{zIndex: 1}}>
                                    <img src={No1BG} className={'w-45'} alt={``}/>
                                    <img
                                        style={{zIndex: -1}}
                                        src={getStaticFile(dataView[0]?.user?.avatar)}
                                        className={`size-18 rounded-[50%] bg-white p-0.5 absolute left-[53%] -mt-[1px] -translate-x-[55%] top-2/4 -translate-y-2/4`}
                                        alt=""/>
                                </div>

                                <div className={`w-full flex flex-col items-center`}>
                                    <div className={` text-title-sm font-bold`}
                                         style={{color: red1}}>{dataView[0]?.user?.name}</div>
                                    <div
                                        className={`text-[#f2a93b]  text-title-lg font-bold`}>{formatCurrency(dataView[0]?.total_spent)} đ
                                    </div>
                                </div>
                            </div>
                        }
                        <div>
                            {dataView.map((i, ii) =>
                                <Link key={`tab2-e ${ii}`}
                                      to={`/user/${i?.user?.id}`}
                                      draggable={false}
                                      onClick={() => {
                                          hideByCls(`rankstr`)
                                          hideByCls(`main-menu-nav`)
                                      }}
                                      className='my-r justify-between text-white text-sm px-2 cursor-pointer hover:bg-black/75'>
                                    <div className='gap-3 my-r my-3'>
                                        <div className='w-6'>#{ii + 1}</div>
                                        <img className='rounded-[50%] size-12 p-0.5'
                                             src={`${getStaticFile(i?.user?.avatar)}`}
                                             alt={``}
                                             style={{background: 'rgba(217, 217, 217, 1)'}}/>
                                        <div className='font-bold'>{i?.user.name}</div>
                                    </div>
                                    <div className=''>{formatCurrency(i.total_spent)} đ</div>
                                </Link>)}

                        </div>

                    </div>
                }

                <Divider1/>

                <div
                    className='my-r justify-between gap-3 px-3 text-center  text-white text-sm my-5 select-none'>
                    <CusButton clsButton={`bg-[${red1}] flex-1 h-[40px]`} name={`Bảng xếp hạng User`}
                               clsText={`font:sm`} onClick={() => {
                        if (refTitle.current) {
                            setViewType("top_rented_users")
                            refTitle.current.innerHTML = "BẢNG XẾP HẠNG USER"
                        }
                    }}/>
                    <CusButton clsButton={`bg-[#cececf] flex-1 h-[40px]`} name={`Bảng xếp hạng Idol`}
                               clsText={`font:sm text-[#4c505b]`} onClick={() => {
                        if (refTitle.current) {
                            refTitle.current.innerHTML = "BẢNG XẾP HẠNG IDOL"
                            setViewType("top_rented_idols")
                        }
                    }}/>
                </div>
            </div>
        </div>

    )
}

export default Rank