import React, {memo, useEffect, useRef, useState} from "react";
import ArrowLeft from "../../images/stories/arrow-left.png"
import ArrowRight from "../../images/stories/arrow-right.png"

import IconClose from "../../images/icon/icon-close.svg"
import {con1, red1} from "../../common/utils/Styles.tsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {CusButton} from "../CusButton.tsx";
import useSWR from "swr";
import EyeViewer from "../../images/home/eye-view.svg";
import IconChat from "../../images/icon/icon-chat-3.svg";
import IconLove from "../../images/icon/icon-love-1.svg";
import {arFetcher, BASE_URL, commonHeaders, getStaticFile} from "../../common/utils/useReq.ts";
import HireUser from "../Users/HireUser.tsx";
import {Input, InputGroup, InputRightAddon, Spinner, ToastId, useToast} from "@chakra-ui/react";
import {faGift, faHeart, faPaperPlane, faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useSWRImmutable from "swr/immutable";
import {useRecoilState} from "recoil";
import {currentUserState, isLoginState, selUserState} from "../../hooks/store.ts";
import {IUser} from "../../pages/PlayerDetail/PlayerDetail.tsx";

interface ISDetails {
    isOpen?: React.ComponentState,
    setIsOpen: React.ComponentState,
    infoStr: any,
}

export interface IStrCmt {
    code: string;
    message: string;
    data: {
        [key: string]: {
            id: string;
            content: string;
            user_id: string;
            story_id: string;
        }
    };
    links: null;
    relationships: null;
    timestamp: Date;
}

export interface ICreateCmtResp {
    code: string;
    message: string;
    data: {
        id: string;
        content: string;
        user_id: string;
        story_id: string;
        created_at: Date;
    };
    links: null;
    relationships: null;
    timestamp: Date;
}

export interface IUserStories {
    code:          string;
    message:       string;
    data:          { [key: string]: {
            id:             string;
            title:          string;
            content:        string;
            user_id:        string;
            media_url:      string;
            status:         string;
            likes_count:    number;
            comments_count: number;
            views_count:    number;
            created:        Date;
        } };
    links:         null;
    relationships: null;
    timestamp:     Date;
}

export interface IUserStory {
    id:             string;
    title:          string;
    content:        string;
    user_id:        string;
    media_url:      string;
    status:         string;
    likes_count:    number;
    comments_count: number;
    views_count:    number;
    created:        Date;
}

export interface ICmt {
    id: string;
    content: string;
    user_id: string;
    story_id: string;
}

const StoriesDetail = ({isOpen, setIsOpen, infoStr}: ISDetails) => {
    const wRemain = 'w-[18%]'
    const navi = useNavigate()
    const [isOpenHire, setIsOpenHire] = useState(false)
    const [isLogin, _] = useRecoilState(isLoginState)
    const [isFetching, setIsFetching] = useState(false)
    const [currentUser] = useRecoilState<any>(currentUserState)

    const [selUser] = useRecoilState(selUserState)
    const [objUsers, setObjUsers] = useState<{ [key: string]: IUser; }>({})

    const location = useLocation();
    const {pathname} = location;
    const initIDStr = pathname.split('/')[2] || infoStr?.story_id || ""
    // const [isLike, setIsLike] = useState(false)
    const [isLikeFetching, setIsLikeFetching] = useState(false)
    const [curIDStr, setCurIDStr] = useState(null)

    const [renStrCmtState, setRenStrCmtState] = useState<any[]>([])

    const refMsg = useRef<HTMLInputElement>(null)
    const toast = useToast()
    const refToast = useRef<ToastId>()

    const {data, error, mutate: mGetStr} = useSWR(curIDStr ? [`/stories/story_id?story_id=${curIDStr}`] : null)
    const {data: dtUserStories} = useSWR<IUserStories>(initIDStr?.length ? [`/stories/user?user_id=${selUser?.id}`] : null)
    const [dataUserStories, setDataUserStories] = useState<IUserStory[]>([])

    const [idxStr, setIdxStr] = useState(999)

    const {
        data: dtStrCmt, isLoading: isLoadingCMT
    } = useSWR<IStrCmt>(curIDStr ? [`/story-comments?story_id=${curIDStr}`] : null)
    const [dataStrCmt, setDataStrCmt] = useState<ICmt[]>([])

    const refVidStr = useRef<HTMLVideoElement>(null)

    useSWRImmutable(curIDStr ? [`/stories/view/story_id?story_id=${curIDStr}`, {}, {method: 'PUT'}] : null, {revalidateIfStale: false})

    const notiError = () => {
        refToast.current && toast.update(refToast.current, {
            status: "error",
            title: `Gửi bình luận thất bại`,
            duration: 3000,
            isClosable: true
        })
    }

    const isMine = () => {
        return currentUser?.info?.id == selUser.id
    }



    useEffect(() => {
        if(idxStr >= dataUserStories.length || infoStr < 0) return

        if(idxStr != 999){
            setCurIDStr(dataUserStories[idxStr]?.id)
            if(refVidStr.current)
                refVidStr.current.src = getStaticFile(dataUserStories[idxStr].media_url)

            // renderCmt()

        }

    }, [idxStr])

    useEffect(() => {
        if(dtUserStories && dtUserStories?.data){
            const ar = []
            for(const[ii,i] of Object.values(dtUserStories.data).entries()){
                if (i.id == initIDStr)
                    setIdxStr(ii)
                ar.push(i)
            }

            setDataUserStories(ar)
        }
    }, [dtUserStories])

    useEffect(() => {
        if(dtStrCmt && dtStrCmt.data){
            const a = []
            for(const i in dtStrCmt.data){
                a.push(dtStrCmt.data[i])
            }
            setDataStrCmt(a)
            return
        }
        setDataStrCmt([])
    }, [dtStrCmt])


    useEffect(() => {
        if (isOpenHire) {
            refVidStr.current && refVidStr.current.pause()
            return
        }
        refVidStr.current && refVidStr.current.play()
    }, [isOpenHire])

    const onLike = () => {
        if (isLikeFetching) return
        setIsLikeFetching(true)

        fetch(`${BASE_URL}/stories/like/story_id?story_id=${curIDStr}`,
            {
                method: "PUT",
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${currentUser.accessToken}`,
                },
            })
            .then((resp) => {
                if (resp.status == 200) {
                    resp.json().then((_) => {
                        try {
                            dataUserStories[idxStr].likes_count += 1
                        } catch (_) {

                        }
                    })
                    setIsLikeFetching(false)
                    return
                } //end IF

                setIsLikeFetching(false)
                return
            }).catch(_ => {
            setIsLikeFetching(false)
        })
    }

    if ((data && !data?.data) || error) {
        navi("/stories")
        setIsOpen(false)
    }

    const urlArr = []
    if (dtStrCmt && dtStrCmt.data) {
        for (const i in dtStrCmt.data) {
            urlArr.push([`/users/user_id?user_id=${dtStrCmt.data[i].user_id}`, {}, {method: 'PATCH'}])
        }
    }

    const {data: dtUser} = useSWRImmutable(urlArr.length ? urlArr : null, arFetcher, {revalidateIfStale: false})

    // const CommentUser = (id, ava, name, content) => {
    //     return (
    //         <div className={`flex justify-between my-3 gap-2 overflow-x-hidden`}
    //              key={`str-cmt-${id}`}>
    //             <img className={`size-9 rounded-full`}
    //                  src={getStaticFile(ava) || ''} alt=""/>
    //
    //             <div className={`flex-1`}>
    //                 <div className={`text-sm`}>{name}</div>
    //                 <div className={`text-sm font-thin`}>
    //                     {content}
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    useEffect(() => {
        if (dtUser) {
            const obj: { [key: string]: IUser; } = {}
            for (const i of dtUser) {
                for (const j in i.data) {
                    obj[j] = i.data[j]
                }
            }
            setObjUsers(obj)

        }
        // setRenStrCmtState([])
    }, [dtUser])


    const onFinish = () => {
        // mStrCmt
        if (isFetching) return
        setIsFetching(true)

        refToast.current = toast({
            status: "loading",
            title: `Đang gửi bình luận của bạn ...`,
            duration: 20000
        })

        const msg = refMsg.current && refMsg.current.value.trim() || ""

        if (!msg.length) {
            refToast.current && toast.update(refToast.current, {
                status: "error",
                title: `Gửi bình luận thất bại`,
                description: `Không có nội dung!`,
                duration: 3000,
                isClosable: true
            })
            setIsFetching(false)

            return
        }

        fetch(`${BASE_URL}/comments`,
            {
                method: "POST",
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${currentUser.accessToken}`,
                },
                body: JSON.stringify({
                    "content": msg.slice(0, 100),
                    "user_id": selUser.id,
                    // "story_id": infoStr.story_id
                    "story_id": curIDStr
                })
            })
            .then((resp) => {
                if (resp.status == 200) {
                    resp.json().then((data: ICreateCmtResp) => {
                        try {
                            refToast.current && toast.update(refToast.current, {
                                status: "success",
                                title: `Gửi bình luận thành công`,
                                isClosable: true
                            })
                            setDataStrCmt(prev => [{...data.data },...prev])

                            // setRenStrCmtState(prev => [CommentUser(data.data.id, currentUser.info.avatar, currentUser.info.name, data.data.content), ...prev])

                            if (refMsg.current) refMsg.current.value = ''

                        } catch (e) {
                            notiError()
                        }
                    })
                    setIsFetching(false)
                    return
                } //end IF

                notiError()
                setIsFetching(false)
                return
            })

            .catch((_) => {
                notiError()
                setIsFetching(false)
            });

    }


    return (
        <div id='StoriesDetail'
             style={{zIndex: 123}}
             className={`str-de ${con1}`}
             onClick={(e) => {
                 if ((e.target as HTMLElement).id == "StoriesDetail") {
                     setIsOpen(false)
                     if (pathname.split('/')[2]) {
                         navi('/stories')
                     }
                     // hideByCls('str-de')
                 }
             }}>

            <div className='flex absolute rounded-lg top-15 md:flex-row flex-col left-2/4 -translate-x-2/4 items-center
                    w-[350px] sm:w-[450px]  md:w-[750px] xl:w-[900px] h-[850px] sm:h-[800px] lg:h-[550px] md:h-[500px] pb-5'>

                <div className='w-full md:w-[60%] bg-[#151414] h-[300px] md:h-full justify-center md:py-5 my-r'>
                    <div className={`${wRemain} h-full relative `}>
                        {idxStr > 0 && <img src={ArrowLeft}
                                            onClick={() => {
                                                setIdxStr(prev => prev - 1)
                                            }}
                              className='hover:opacity-80 w-12 cursor-pointer absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4'
                              alt=""/>}
                    </div>

                    <div className='relative h-[300px] md:h-[450px] w-[80%]'>
                        <video
                            ref={refVidStr}
                            className='h-full absolute top-0 left-0 w-full z-1 rounded-lg' loop={true} controls
                               autoPlay={true} disablePictureInPicture={true}
                               controlsList={"nodownload noplaybackrate nofullscreen"}>
                            <source
                                // src={getStaticFile(infoStr?.media_url) || data?.data && `${getStaticFile(data?.data[initIDStr]?.media_url)} || ""`}
                                // src={getStaticFile(infoStr?.media_url)}
                                // src={`${getStaticFile(idxStr === 999 ? (infoStr?.media_url) : dataUserStories[idxStr].media_url)} || ""`}
                                // src={`${getStaticFile(dataUserStories[2]?.media_url)} || ""`}
                                type="video/mp4"/>
                        </video>
                        {/*<img src={Player} className='absolute left-0 bottom-1 w-full ' style={{zIndex: 3}}*/}
                        {/*     alt=""/>*/}
                    </div>

                    <div className={`${wRemain} h-full relative `}>
                        {idxStr < dataUserStories.length - 1 && <img src={ArrowRight}
                              onClick={() => {
                                  setIdxStr(prev => prev + 1)
                              }}
                              className='hover:opacity-80 absolute w-12 cursor-pointer top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4'
                              alt=""/>}
                        <div className="absolute bottom-0 left-0 flex flex-col gap-2.5 md:gap-2 items-center w-full ">
                            {/*<img src={Love} className='w-[70px] cursor-pointer hover:opacity-80' alt=""/>*/}
                            {isLogin &&
                                <div

                                    onClick={onLike}
                                    className={`active:scale-[1.2] rounded-full size-[30px] md:size-[35px] my-btn hover:opacity-80`}
                                    // style={{background: isLike ? red1 : "#bebebe", transition: "all .05s ease-in-out"}}>
                                    style={{background: "#bebebe", transition: "all .05s ease-in-out"}}>
                                    {/*<FontAwesomeIcon icon={faHeart} style={{color: isLike ? 'white' : "#151514"}}*/}
                                    <FontAwesomeIcon icon={faHeart} style={{color:  "#151514"}}
                                                     className='text-sm md:text-lg cursor-pointer hover:opacity-80'/>
                                </div>}

                            <div
                                className={`bg-[#bebebe] rounded-full size-[30px] md:size-[35px] my-btn hover:opacity-80`}>
                                <FontAwesomeIcon icon={faGift} style={{color: "#151514"}}
                                                 className='text-sm md:text-lg cursor-pointer hover:opacity-80'/>
                            </div>
                            <div
                                className={`bg-[#bebebe] rounded-full size-[30px] md:size-[35px] my-btn hover:opacity-80`}>
                                <FontAwesomeIcon icon={faShare} style={{color: "#151514"}}
                                                 className='text-sm md:text-lg cursor-pointer hover:opacity-80'/>
                            </div>
                            {/*<img src={Share} className='w-[50px] cursor-pointer hover:opacity-80' alt=""/>*/}
                        </div>
                    </div>

                </div>

                {/* Second */}
                <div className='relative md:flex-1 bg-[#101010] md:h-full h-[750px] w-full'>
                    <div className='absolute top-0 left-0 w-full p-5'>
                        <div className='justify-between my-r '>
                            <div className='my-r gap-2 cursor-pointer'>
                                <Link to={`/user/${selUser.id}`}>
                                    <img src={infoStr?.avatar}
                                         className='cursor-pointer w-10 rounded-[50%] hover:opacity-80'
                                         draggable={false}
                                         alt=""/>
                                </Link>
                                <div style={{color: 'rgba(159, 159, 159, 1)'}}>
                                    <Link to={`/user/${selUser.id}`}>
                                        <div
                                            className='text-sm cursor-pointer hover:text-[#e05844]'>{selUser?.name}</div>

                                    </Link>
                                    <div className='text-sm font-thin '>8 giờ trước</div>
                                </div>
                            </div>


                            {!isMine() && isLogin && <CusButton clsButton={`py-2 w-20 rounded-3xl bg-[${red1}]`} name={'Thuê'}
                                                     clsText={'text-sm'} onClick={() => {

                                setIsOpenHire(true)

                            }}/>}

                        </div>

                        <div className='my-r justify-around mt-3 select-none'>
                            {/*<img src={ViewCount} className='w-14 cursor-pointer hover:opacity-80' alt=""/>*/}
                            <div className='my-r gap-1'>
                                <img src={EyeViewer} alt="" className='w-4 '/>
                                <div className="text-white text-sm">
                                    {dataUserStories[idxStr]?.views_count || 0}
                                </div>
                            </div>

                            {/*<div className='pt-2'>*/}
                            {/*    <img src={CmtCount} className='w-18 cursor-pointer hover:opacity-80' alt=""/>*/}
                            {/*</div>*/}

                            <div className='my-r gap-1'>
                                <img src={IconChat} alt="" className=' w-4'/>
                                <div className="text-white text-sm">
                                    {renStrCmtState.length || 0}
                                </div>
                            </div>

                            {/*<img src={LoveCount} className='w-8 cursor-pointer hover:opacity-80' alt=""/>*/}
                            <div className='my-r gap-1'>
                                <img src={IconLove} alt="" className=' w-4 '/>
                                <div className="text-white text-sm">
                                    {dataUserStories[idxStr]?.likes_count || 0}
                                </div>
                            </div>
                        </div>

                        {/*<div className='mt-2 text-sm font-thin  ml-5'*/}
                        {/*     style={{color: 'rgba(159, 159, 159, 1)'}}>*/}
                        {/*</div>*/}

                        {/* Content Story*/}
                        <div className={`mt-3 text-white text-sm`}>
                            {/*{data?.data && data?.data[initIDStr]?.title || ""}*/}
                            {dataUserStories[idxStr]?.title || ""}
                        </div>

                        <div className='mt-3 mx-2'
                             style={{background: "rgba(159, 159, 159, .4)", height: 0.5}}/>

                        {/*Comment content*/}
                        <div className={`overflow-y-auto text-white  mt-1 md:mt-2  md:h-[300px] h-[320px] py-2 `}>
                            {/*{renStrCmtState}*/}
                            {isLoadingCMT ? <div className={`w-full h-full cen-all`}><Spinner color={'white'}/></div> : dataStrCmt.map((i) =>
                                <div className={`flex justify-between my-3 gap-2 overflow-x-hidden`}
                                     key={`str-cmt-${i.id}`}>
                                    <img className={`size-9 rounded-full`}
                                         src={getStaticFile(objUsers[i?.user_id]?.avatar) || ''} alt=""/>

                                    <div className={`flex-1`}>
                                        <div className={`text-sm`}>{objUsers[i?.user_id]?.name}</div>
                                        <div className={`text-sm font-thin`}>
                                            {i.content}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/*Comment Story ...*/}

                    <div className='absolute bottom-3 left-0 w-full'>
                        <div className=' mx-6' style={{background: "rgba(159, 159, 159, .4)", height: .1}}/>
                        <div className='my-r px-2 justify-between'>
                            <div className="flex-1">
                                {isLogin && <InputGroup variant={'inputGr1'} className={`mt-3`}>
                                    <Input ref={refMsg} placeholder={'Comment...'} variant="custom1" required={true}
                                           onKeyDown={(e) => {
                                               if (e.key == "Enter") onFinish()
                                           }}/>
                                    <InputRightAddon
                                        onClick={onFinish}><FontAwesomeIcon
                                        style={{fontSize: 20}}
                                        className={`hover:opacity-70`}
                                        icon={faPaperPlane}/></InputRightAddon>
                                </InputGroup>}

                            </div>
                        </div>
                    </div>


                </div>
                <img id={'55555'} src={IconClose} alt=""
                     className='hover:opacity-80 absolute w-8 -top-3 -right-3 overflow-auto cursor-pointer'
                     style={{zIndex: 123}} onClick={() => {
                    setIsOpen(false)
                }}/>
            </div>

            {!isMine() && isLogin && <HireUser setIsOpen={setIsOpenHire} isOpen={isOpenHire} infoUser={
                {id: selUser?.id, name: selUser?.name, price: selUser?.price}
            }/>}

        </div>

    )
}

export default memo(StoriesDetail)