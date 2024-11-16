import BannerIMG from '../../images/home/banner-top.png'
import EyeViewer from '../../images/home/eye-view1.svg'

import './index.scss'

import {MutableRefObject, useEffect, useRef, useState} from "react";
import StoriesDetail from "../../components/Stories/StoriesDetail.tsx";
import {Link} from "react-router-dom";
import useSWR from "swr";
import {arFetcher, commonHeaders, getStaticFile} from "../../common/utils/useReq.ts";

import useSWRImmutable from "swr/immutable";
import {useRecoilState} from "recoil";
import {navSelGameState, selUserState} from "../../hooks/store.ts";

import {Input, Select, Spinner} from "@chakra-ui/react";
import {getValBRef, SEX} from "../../common/utils/utils.ts";
import {bg2, red1} from "../../common/utils/Styles.tsx";

import {
    Select as MSelect, SelectInstance,
} from "chakra-react-select";
import {CusButton} from "../../components/CusButton.tsx";
import {CardUser, IGames} from "./CardUser.tsx";
import {ListGame} from "../../components/Sidebar/ListGame.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGamepad, faSearch} from "@fortawesome/free-solid-svg-icons";
import {IUser} from "../PlayerDetail/PlayerDetail.tsx";

export interface IUserByGame {
    code: string;
    message: string;
    data: {
        [key: string]: IUser
    };
    links: null;
    relationships: null;
    timestamp: Date;
}

export interface IHotUsers {
    code: string;
    message: string;
    data: {
        [key: string]: IUser
    };
    links: null;
    relationships: null;
    timestamp: Date;
}

const clsInpSearch = 'w-full  sm:w-[220px] '
const defaultFilter = {
    "name": "string",
    "username": "string",
    "avatar": "string",
    "birthday": "string",
    "sex": "string",
    "location": "string",
    "evaluate": "string",
    "price": "string"
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home = () => {
    // const [currentUser, setCurrentUser] = useRecoilState(currentUserState)

    const [isOpenStrDetail, setIsOpenStrDetail] = useState(false)
    const [selUser, setSelUser] = useRecoilState(selUserState)
    const [navSelGame, setNavSelGame] = useRecoilState(navSelGameState)

    const [infoStr, setInfoStr] = useState({})
    const {data: dataStories} = useSWR(['/stories'])
    const urlArr = []
    const idUsers: {
        [key: string]: any;
    } = {}
    if (dataStories && dataStories.data) for (const i in dataStories.data) idUsers[dataStories.data[i].user_id] = 1
    if (idUsers) for (const i in idUsers) urlArr.push([`/users/user_id?user_id=${i}`, {}, {method: 'PATCH'}])

    const refName = useRef<HTMLInputElement>(null)
    const refIdUser = useRef<HTMLInputElement>(null)
    const refSex = useRef<HTMLSelectElement>(null)
    const refIsMostHire = useRef<HTMLInputElement>(null)
    const refPrice = useRef<HTMLInputElement>(null)
    const refSelGames = useRef<SelectInstance>(null)
    const [isSearching, setIsSearching] = useState<boolean>(false)

    const {data: dataUsers} = useSWRImmutable(urlArr.length ? urlArr : null, arFetcher, {revalidateIfStale: false});
    const {data: dtGames} = useSWRImmutable<IGames>(['/games'], {revalidateIfStale: false})
    const {
        data: dtUserByGame,
        isLoading: isLDUBG
    } = useSWR<IUserByGame>(navSelGame && navSelGame?.id?.length ? [`/user/game?game_id=${navSelGame?.id}`] : null)
    
    const {data: dtLMHT} = useSWR<IUserByGame>(
        [`/user/game?game_id=f0660f10-fecc-5321-b4f3-e5b9ae9029ca`]
    );
    const {data: dtPUBGMobile} = useSWR<IUserByGame>(
        [`/user/game?game_id=ce685a75-0006-5723-8da8-25d42d153ecb`]
    );
    const {data: dtCSGO} = useSWR<IUserByGame>(
        [`/user/game?game_id=e72f7df2-3c3c-5b38-b36c-9638bc71d36d`]
    );
    

    const {data: dtHotUsers, isLoading: isLoadingHU} = useSWR<IHotUsers>(['/users/hot', {}, {method: "POST"}])
    const {data: dtVipUsers, isLoading: isLoadingVU} = useSWR<IHotUsers>(['/users/vip', {}, {method: "POST"}])
    
    const [arFetchGames, setArFetchGames] = useState<any[]>([])
    const {data: dtArFetch} = useSWR(arFetchGames && arFetchGames?.length ? arFetchGames : null, arFetcher)

    const [isFetchAllUsers, setIsFetchAllUsers] = useState<boolean>(false)
    const [dataUsersFilter, setDataUsersFilter] = useState<IUser[]>([])

    const {data: dtFilAllUsers} = useSWR<{
        code: string,
        message: string,
        data: IUser[]
    }>(isFetchAllUsers ? ['/users/filter', {...commonHeaders}, {
        method: "POST",
        body: JSON.stringify(defaultFilter)
    }] : null)

    const objUsers: { [key: string]: any; } = {}
    if (dataUsers) {
        for (const i of dataUsers) {
            for (const j in i.data) {
                objUsers[j] = i.data[j]
            }
        }
    }

    useEffect(() => {
        if(navSelGame && navSelGame?.id?.length){
            setDataUsersFilter([])
        }
    }, [navSelGame])

    useEffect(() => {
        if (dtFilAllUsers) {
            console.log('dtFilAllUsers?.data', dtFilAllUsers?.data);
            
            if (dtFilAllUsers?.data?.length) {
                setDataUsersFilter(dtFilAllUsers?.data)
            } else {
                setDataUsersFilter([])
            }

            setIsSearching(false)
            setIsFetchAllUsers(false)
        }
    }, [dtFilAllUsers])

    useEffect(() => {
        
        if(dtArFetch){
            setArFetchGames([])
            let arRes = []
            const objGames: { [key: string]: 1 } = {}
            for (let i = 1; i < dtArFetch.length; i ++) {
                if (dtArFetch[i]?.data && Object.keys(dtArFetch[i]?.data).length) {
                    for (const j in dtArFetch[i]?.data) {
                        objGames[j] = 1
                    }
                }
            }
            if (dtArFetch[0]?.data) {
                if (Object.keys(objGames).length) {
                    for (const i of dtArFetch[0].data)
                        if (objGames[i.id])
                            arRes.push(i)
                }
                else arRes = dtArFetch[0].data
            }

            if(arRes.length){
                setDataUsersFilter(arRes)
                setIsSearching(false)
                return
            }
            setIsFetchAllUsers(true)

        }

    }, [dtArFetch])



    const onSearch = () => {
        if (isSearching) return
        // setNavSelGame({})

        const arFetch: any[] = [['/users/filter', {...commonHeaders}, {
            method: "POST",
            body: JSON.stringify({
                ...defaultFilter,
                name: getValBRef(refName) || defaultFilter.name,
                sex: getValBRef(refSex) || defaultFilter.sex,
                price: getValBRef(refPrice) || defaultFilter.price,
                username: getValBRef(refIdUser) || defaultFilter.username,
            })
        }]]
        if (refSelGames.current) {
            for (const i of refSelGames.current.getValue() as { value: string, label: string }[]) {
                arFetch.push([`/user/game?game_id=${i?.value}`])
            }
        }

        setArFetchGames(arFetch)
        setIsSearching(true)

    }

    const renStories = []
    if (dataStories && dataStories.data && Object.keys(objUsers).length) {
        const dt = dataStories.data
        for (const i in dt) {
            renStories.push(
                <div key={dt[i].id}
                     className={`select-none min-w-[140px] min-h-[215px] rounded-[18px] hov-style-1 relative `}>
                    <img
                        onClick={() => {
                            setIsOpenStrDetail(true)
                            setInfoStr({
                                media_url: `${getStaticFile(dt[i]?.media_url)}`,
                                avatar: `${getStaticFile(objUsers[dt[i]?.user_id]?.avatar)}`,
                                // name: objUsers[dt[i].user_id].name,
                                // user_id: dt[i].user_id,
                                story_id: i,
                                // price: dt[i].price
                            })
                            setSelUser(objUsers[dt[i].user_id] || {})

                        }}
                        alt=''
                        draggable={false}
                        className='absolute p-0.5 top-0 left-0 select-none h-full w-full cursor-pointer rounded-[18px] hover:opacity-70 '
                        src={getStaticFile(objUsers[dt[i]?.user_id]?.avatar)}/>

                    <Link to={`/user/${dt[i].user_id}`}
                          className="absolute top-2 left-2 flex items-center gap-1 cursor-pointer">
                        <div
                            className="flex justify-center items-center p-0.5 bg-white max-w-8 min-w-8 max-h-8 min-h-8 rounded-[50%]">
                            <img src={`${getStaticFile(objUsers[dt[i]?.user_id]?.avatar)}`} alt=""
                                 className='min-w-full max-w-full rounded-[50%]'/>
                        </div>
                        <div className="text-white text-xs hover:text-[#e05844] max-w-[76px] max-h-[50px] txt-clip">
                            {objUsers[dt[i]?.user_id]?.name}
                        </div>

                    </Link>

                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1">
                        <img src={EyeViewer} alt="" className="w-[20px]"/>
                        <div className="text-white text-sm">
                            {dt[i]?.views_count}
                        </div>
                    </div>
                </div>
            )
        }
    }


    return (
        <div className='home min-h-screen pb-10'>
            {/* Search */}
            <div className='menu-search'>
                <div
                    className={`menu-search-item p-4 mt-0 flex flex-col sm:flex-row sm:flex-wrap gap-2 min-h-[46px] `}>
                    {/*    #3c3c3c*/}
                    <div className={`${clsInpSearch}`}>
                        <Input ref={refName} placeholder={'Tên'} variant="custom1"/>
                    </div>
                    <div className={`${clsInpSearch}`}>
                        <Input ref={refIdUser} placeholder={'ID'} variant="custom1"/>
                    </div>
                    <div className={`w-full  sm:w-[175px]`}>
                        <Input ref={refPrice} placeholder={'Giá'} type={"number"} variant="custom1"/>
                    </div>
                    <div className={`w-full sm:w-[100px]`}>
                        <Select
                            ref={refSex}
                            className={`cursor-pointer `}
                            defaultValue={`male`}
                            variant="customSelect1">
                            {SEX.map(i =>
                                <option key={`sel-game-${i.key}`} value={i.key}>{i?.name}</option>)}
                        </Select>
                    </div>
                    <div className={`w-full  sm:w-[200px] lg:w-[250px]`}>
                        <MSelect
                            isMulti
                            ref={refSelGames}
                            variant={`customSelect1`}
                            placeholder="Games ..."
                            closeMenuOnSelect={false}
                            options={dtGames?.data && Object.keys(dtGames.data).map(i => {
                                return (
                                    {value: dtGames.data[i].id, label: dtGames.data[i].title}
                                )
                            })
                            }
                        />

                    </div>
                    <div className={`${clsInpSearch} my-r gap-2 pl-5`}>
                        <input
                            ref={refIsMostHire}
                            id={`home-checkbox-most`}
                            className={`rounded-lg size-[20px] `}
                            type="checkbox"/>
                        <label htmlFor={`home-checkbox-most`}
                            style={{color: bg2}}
                            className={`h-[20px] text-[16px] select-none`}>
                            Người được thuê nhiều
                        </label>
                    </div>
                    <div className={`my-r ml-6 mt-1 gap-4`}>
                        <CusButton clsButton={`bg-gradient-to-r from-emerald-900 to-red-400 h-[36px] w-[140px]  gap-2 !rounded-[28px] `}
                                    name={`TÌM KIẾM`}
                                    isDisable={isSearching}
                                    fIcon={<FontAwesomeIcon icon={faSearch} style={{fontSize: 18}}/>}
                                    clsText={`text-sm`} onClick={onSearch}/>

                        {isSearching && <Spinner color={'white'}/>}
                    </div>
                </div>
            </div>

            {/*  */}
            <img src={BannerIMG} className="w-screen h-auto max-h-40" alt=""/>

            {/*  STORIES  */}
            <div
                className='flex md:mx-5 mx-1 min-h-[280px] gap-3 bg-transparent overflow-x-auto h-full items-center p-3 md:w-[calc(100vw-120px)]'>
                {/*{stories.map((i, ii) => <CardStory1 key={`stories ${ii}`} ava={i.ava} userName={i.userName} viewCount={i.viewCount}/>)}*/}
                {renStories}
            </div>
            {/* END-STORIES */}

            {/*   TAG  */}
            <div className='flex mx-5 justify-between items-center my-2 h-max'>
            </div>
            {/*    END TAG  */}

            {/*<div className='flex content-between flex-wrap gap-3 md:hidden  my-5'>*/}
            <div className='pl-3 w-full items-center grid md:hidden justify-center gap-1 md:gap-5 '
                 style={{gridTemplateColumns: 'repeat(auto-fill, 80px)'}}>
                <ListGame/>
            </div>

            

            {/* Filter Users */}
            {dataUsersFilter?.length ? <div
                className={`px-6 mt-8 sm:grid gap-5 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5  md:grid-cols-4 sm:grid-cols-3 flex flex-col`}>
                {
                    dataUsersFilter && dataUsersFilter?.length && dataUsersFilter.map(i =>
                        <CardUser id={i?.id}
                                  avatar={i?.avatar}
                                  games={i?.games || []}
                                  key={`hot-user-${i?.id}`}
                                  price={i?.price || 0}
                                  completion_rate={i?.completion_rate}
                                  name={i?.name}/>)
                }
            </div> : <></>}

            {/* Users by Game*/}
            {!dataUsersFilter?.length && isLDUBG ?
                <div className={`w-[100%]  mt-10 flex justify-center`}>
                    <Spinner color={`white`}/>
                </div>
                :
                Object.keys(navSelGame).length ?
                <div className={`p-5`}>
                    {navSelGame?.title && <div className={`my-r gap-2 `}>
                        <img src={getStaticFile(navSelGame?.thumbnail)} className={`size-12 rounded-[10px]`} alt=""/>
                        <div
                            className={`font-extrabold  text-title-md h-12 text-transparent bg-clip-text bg-gradient-to-r to-red-700 from-red-300 my-r gap-3`}>{navSelGame?.title?.toUpperCase()}
                        </div>
                    </div>}
                    {dtUserByGame && dtUserByGame?.data ?
                        <div
                            className={`min-h-[400px] mt-4 sm:grid gap-5 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5  md:grid-cols-4 sm:grid-cols-3 flex flex-col`}>

                            {Object.keys(dtUserByGame?.data).map(i =>
                                <CardUser key={`user-b-game-${dtUserByGame?.data[i]?.id}`}
                                          id={dtUserByGame?.data[i]?.id}
                                          avatar={getStaticFile(dtUserByGame?.data[i]?.avatar)}
                                          games={dtUserByGame?.data[i]?.games || []}
                                          price={dtUserByGame?.data[i]?.price || 0}
                                          completion_rate={dtUserByGame?.data[i]?.completion_rate}
                                          name={dtUserByGame?.data[i]?.name}/>)}
                        </div>
                        :
                        navSelGame?.title && <div className={`min-h-[400px]`}/>
                    }
                </div> : <></>
            }

            {/* VIP + Hot Users */}
            {!dataUsersFilter?.length && !dtUserByGame?.data && !navSelGame?.id?.length &&
                <div>
                    {/*<VipUsers/>*/}
                    <div className={`p-5 mt-4  min-h-[260px] item`}>
                        <div
                            className={`label font-extrabold  text-title-md text-transparent bg-clip-text bg-gradient-to-r to-red-700 from-red-200 my-r gap-3`}>
                            <div>VIP PLAYERS</div>
                            {isLoadingVU && <Spinner color={`white`}/>}
                        </div>
                        <div
                            className={`content mt-3 sm:grid gap-5 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5  md:grid-cols-4 sm:grid-cols-3 flex flex-col`}>
                            {dtVipUsers && dtVipUsers?.data && Object.keys(dtVipUsers?.data).map(i =>
                                <CardUser id={dtVipUsers?.data[i]?.id}
                                          avatar={getStaticFile(dtVipUsers?.data[i]?.avatar)}
                                          key={`hot-user-${dtVipUsers?.data[i]?.id}`}
                                          games={dtVipUsers?.data[i]?.games}
                                          price={dtVipUsers?.data[i]?.price || 0}
                                          completion_rate={dtVipUsers?.data[i]?.completion_rate}
                                          name={dtVipUsers?.data[i]?.name}/>)}
                        </div>
                    </div>

                    {/*<HotUsers/>*/}
                    <div className={`p-5 mt-4 min-h-[260px] item`}>
                        <div
                            className={`label font-extrabold  text-title-md text-transparent bg-clip-text bg-gradient-to-r to-red-700 from-red-200 my-r gap-3`}>
                            <div>HOT PLAYERS</div>
                            {isLoadingHU && <Spinner color={`white`}/>}
                        </div>
                        <div
                            className={`content mt-3 sm:grid gap-5 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5  md:grid-cols-4 sm:grid-cols-3 flex flex-col`}>
                            {dtHotUsers && dtHotUsers?.data && Object.keys(dtHotUsers?.data).map(i =>
                                <CardUser id={dtHotUsers?.data[i]?.id}
                                          avatar={getStaticFile(dtHotUsers?.data[i]?.avatar)}
                                          key={`hot-user-${dtHotUsers?.data[i]?.id}`}
                                          games={dtHotUsers?.data[i]?.games}
                                          price={dtHotUsers?.data[i]?.price || 0}
                                          completion_rate={dtHotUsers?.data[i]?.completion_rate}
                                          name={dtHotUsers?.data[i]?.name}/>)}
                        </div>
                    </div>
                </div>
            }

            {dataUsersFilter?.length ?
                <div className={`w-[100%] flex justify-center`}>
                    <Spinner color={`white`}/>
                </div>
                :
                <div className={`p-5 item mt-4`}>
                        <div
                            className={`label font-extrabold  text-title-md text-transparent bg-clip-text bg-gradient-to-r to-red-700 from-red-200 my-r gap-3`}>
                                LMHT
                        </div>
                    {dtLMHT && dtLMHT?.data ?
                        <div
                            className={`content mt-3 sm:grid gap-5 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5  md:grid-cols-4 sm:grid-cols-3 flex flex-col`}>

                            {Object.keys(dtLMHT?.data).map(i =>
                                <CardUser key={`user-b-game-${dtLMHT?.data[i]?.id}`}
                                          id={dtLMHT?.data[i]?.id}
                                          avatar={getStaticFile(dtLMHT?.data[i]?.avatar)}
                                          games={dtLMHT?.data[i]?.games || []}
                                          price={dtLMHT?.data[i]?.price || 0}
                                          completion_rate={dtLMHT?.data[i]?.completion_rate}
                                          name={dtLMHT?.data[i]?.name}/>)}
                        </div>
                        :
                        navSelGame?.title && <div className={`min-h-[400px]`}/>
                    }
                </div>
            }

            {dataUsersFilter?.length ?
                <div className={`w-[100%]  flex justify-center`}>
                    <Spinner color={`white`}/>
                </div>
                :
                <div className={`p-5 item mt-4`}>
                <div
                    className={`label font-extrabold  text-title-md text-transparent bg-clip-text bg-gradient-to-r to-red-700 from-red-200 my-r gap-3`}>
                        PUBG Mobile
                </div>
                    {dtPUBGMobile && dtPUBGMobile?.data ?
                        <div
                            className={`content mt-3 sm:grid gap-5 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5  md:grid-cols-4 sm:grid-cols-3 flex flex-col`}>

                            {Object.keys(dtPUBGMobile?.data).map(i =>
                                <CardUser key={`user-b-game-${dtPUBGMobile?.data[i]?.id}`}
                                          id={dtPUBGMobile?.data[i]?.id}
                                          avatar={getStaticFile(dtPUBGMobile?.data[i]?.avatar)}
                                          games={dtPUBGMobile?.data[i]?.games || []}
                                          price={dtPUBGMobile?.data[i]?.price || 0}
                                          completion_rate={dtPUBGMobile?.data[i]?.completion_rate}
                                          name={dtPUBGMobile?.data[i]?.name}/>)}
                        </div>
                        :
                        navSelGame?.title && <div className={`min-h-[400px]`}/>
                    }
                </div>
            }

            {dataUsersFilter?.length ?
                <div className={`w-[100%] flex justify-center`}>
                    <Spinner color={`white`}/>
                </div>
                :
                <div className={`p-5 item mt-4`}>
                    <div
                        className={`label font-extrabold  text-title-md text-transparent bg-clip-text bg-gradient-to-r to-red-700 from-red-200 my-r gap-3`}>
                            CSGO
                    </div>
                    {dtCSGO && dtCSGO?.data ?
                        <div
                            className={`content mt-3 sm:grid gap-5 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5  md:grid-cols-4 sm:grid-cols-3 flex flex-col`}>

                            {Object.keys(dtCSGO?.data).map(i =>
                                <CardUser key={`user-b-game-${dtCSGO?.data[i]?.id}`}
                                          id={dtCSGO?.data[i]?.id}
                                          avatar={getStaticFile(dtCSGO?.data[i]?.avatar)}
                                          games={dtCSGO?.data[i]?.games || []}
                                          price={dtCSGO?.data[i]?.price || 0}
                                          completion_rate={dtCSGO?.data[i]?.completion_rate}
                                          name={dtCSGO?.data[i]?.name}/>)}
                        </div>
                        :
                        navSelGame?.title && <div className={`min-h-[400px]`}/>
                    }
                </div>
            }

            {isOpenStrDetail && <StoriesDetail setIsOpen={setIsOpenStrDetail} infoStr={infoStr}/>}

        </div>
    )

}

export default Home