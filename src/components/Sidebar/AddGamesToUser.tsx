// @flow
import {bg1, bg2, bg5, con1, red1} from "../../common/utils/Styles.tsx";
import {hideByCls, visibleByCls} from "../VisibleControl.tsx";
import useSWRImmutable from "swr/immutable";
import {useEffect, useRef, useState} from "react";
import {BASE_URL, commonHeaders, getStaticFile} from "../../common/utils/useReq.ts";
import { ToastId, useToast} from "@chakra-ui/react";
import {CusButton} from "../CusButton.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGamepad, faPlus} from '@fortawesome/free-solid-svg-icons';
import {useRecoilState} from "recoil";
import {currentUserState} from "../../hooks/store.ts";
import useSWR from "swr";
import {CusDivider} from "../CusDivider.tsx";
import {IGames} from "../../pages/Home/CardUser.tsx";

const idConAddGame = "con-add-game-user"




export function AddGamesToUser() {
    const toast = useToast()
    const refToast = useRef<ToastId>()
    const {data} = useSWRImmutable<IGames>(['/games'], {revalidateIfStale: false})
    const [renLGames, setRenLGames] = useState<any>([])
    const [currentUser] = useRecoilState(currentUserState)
    const {data: dataUser} = useSWR([currentUser?.info?.id ? `/users/user_id?user_id=${currentUser?.info?.id}` : null, {}, {method: 'PATCH'}])
    const [uSelected, setUSelected] = useState<{ [key: string]: boolean }>({})
    const [isFetching, setIsFetching] = useState(false)
    const refSel = useRef<{[key: string]: boolean}>(uSelected)

    useEffect(() => {
        if(uSelected){
            if(refSel.current) refSel.current = uSelected
        }
    }, [uSelected])

    useEffect(() => {
        if(dataUser && currentUser?.info?.id && dataUser?.data[currentUser?.info?.id]?.games){
            const obj: { [key: string]: boolean } = {}
            for(const i of dataUser?.data[currentUser?.info?.id]?.games) obj[i.id] = true
            setUSelected(obj)
            return
        }
        setUSelected({})

    }, [dataUser])

    useEffect(() => {
        const res = []
        if (data && data?.data) {
            for (const i in data.data)
                res.push(
                    {...data.data[i]}
                )
            setRenLGames(res)
        }
    }, [data])

    const notiError = (msg: string = "") => {
        refToast.current && toast.update(refToast.current, {
            status: "error",
            title: `Cập nhật game thất bại`,
            description: msg,
            isClosable: true
        })
    }

    const onOK = () => {

        if (isFetching) return
        setIsFetching(true)
        refToast.current = toast({
            status: "loading",
            title: `Đang Cập nhật game của bạn ...`,
            id: idConAddGame,
            duration: 15000,
        })


        fetch(`${BASE_URL}/user_to_game`,
            {
                method: "POST",
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${currentUser.accessToken}`,
                },
                body: JSON.stringify(Object.keys(refSel.current).filter(i => refSel.current[i]))
            })
            .then((resp) => {
                if (resp.status == 200) {
                    resp.json().then((_) => {
                        try {
                            refToast.current && toast.update(refToast.current, {
                                status: "success",
                                title: `Cập nhật game của bạn thành công`,
                                isClosable: true,
                                duration: 3000
                            })
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

            }).catch(_ => {
            notiError()
            setIsFetching(false)
        })
    }


    return (
        <div>
            <div className={`my-r gap-10 cursor-pointer select-none`}
                 onClick={() => {
                     visibleByCls(idConAddGame, con1)
                 }}
            >
                <div
                    data-tooltip-id="my-main-menu-nav"
                    style={{background: bg5}}

                    data-tooltip-content={'Cập nhật game của bạn'}
                    className={`my-2 flex my-btn flex-col justify-center items-center size-[45px] rounded-full text-white`}>
                    <FontAwesomeIcon icon={faGamepad} style={{fontSize: 20}}/>

                    <FontAwesomeIcon icon={faPlus} style={{fontSize: 10}}/>
                </div>
                <div className='text-white text-sm block md:hidden'>
                    Cập nhật game của bạn
                </div>
            </div>

            <div
                onMouseDown={(e) => {
                    if ((e.target as HTMLElement).classList.contains(idConAddGame)) hideByCls(idConAddGame)
                }}
                className={`${idConAddGame} hidden`} style={{zIndex: 10.}}>

                <div
                    className={`bg-[${bg1}] absolute top-15 left-2/4 -translate-x-2/4 w-[400px] md:w-[660px] h-[500px] md:h-[600px] rounded-lg flex flex-col items-center gap-2 md:gap-4 p-2 md:p-6`}>
                    <div style={{color: red1}} className={`text-title-sm font-bold`}>THÊM DANH SÁCH GAME</div>
                    <CusDivider cls={{marginTop: -5}}/>
                    <div className={`flex flex-wrap gap-5 w-full h-[90%] overflow-y-auto`}>
                        {renLGames.length && [...renLGames].map((i) =>
                            <div key={`add-game-${i?.id}`} className={`flex w-[78px] md:w-[105px] gap-1 md:gap-1.5 my-2 h-max`} draggable={false}>
                                <input
                                    className={`rounded-lg h-[15px] min-w-[15px] md:min-w-[20px]  md:min-h-[20px] mt-5 md:mt-8`}
                                    checked={uSelected[i?.id]}
                                    onChange={(e) => {
                                        const obj: { [key: string]: boolean; } = {}
                                        obj[i?.id] = e.target.checked
                                        setUSelected({...uSelected, ...obj})
                                    }}
                                    type="checkbox" id={`add-game-${i?.id}`}/>

                                <div
                                       style={{color: bg2}}
                                       onClick={() => {
                                           const obj: { [key: string]: boolean; } = uSelected
                                           obj[i?.id] = !obj[i?.id]
                                           setUSelected({...uSelected, ...obj})
                                       }}
                                       className={` flex flex-col items-center`}>
                                    <img src={getStaticFile(i?.thumbnail)}
                                          alt=""
                                         draggable={false}
                                         className='size-[45px] rounded-lg md:size-[75px]'/>
                                    <div className={` text-white text-sm font-extrabold mt-1 text-center select-none`}>{i?.title}</div>
                                </div>

                            </div>)}
                    </div>

                    <CusButton clsButton={`w-full h-10 bg-[${red1}]`} name={`OK`} clsText={``} onClick={() => {
                        onOK()
                    }}/>

                </div>

            </div>
        </div>

    );
}