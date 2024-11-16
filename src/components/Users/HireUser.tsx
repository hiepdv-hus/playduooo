import { CusModal } from "../CusModal";
import React, {ComponentState, useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import {currentUserState, selUserState} from "../../hooks/store.ts";
import useSWR from "swr";
import {red1} from "../../common/utils/Styles.tsx";
import {formatCurrency} from "../../common/utils/utils.ts";
import {Select, Textarea, ToastId, useToast} from "@chakra-ui/react";
import {BASE_URL, commonHeaders} from "../../common/utils/useReq.ts";
import {hideByCls} from "../VisibleControl.tsx";
import {useLocation} from "react-router-dom";
import {IUser} from "../../pages/PlayerDetail/PlayerDetail.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWallet} from "@fortawesome/free-solid-svg-icons";
import {IGames} from "../../pages/Home/CardUser.tsx";



interface IHireUser{
    setIsOpen: ComponentState
    isOpen: ComponentState
    infoUser: any
}



function HireUser({setIsOpen, isOpen, infoUser}: IHireUser) {
    const toast = useToast()
    const refToast = useRef<ToastId>()
    const [currentUser] = useRecoilState<any>(currentUserState)
    const {data: dtCurrentUser} = useSWR(isOpen ? [`/users/user_id?user_id=${currentUser.info.id}`, {}, {method: 'PATCH'}] : null)
    const {data: dtGames} = useSWR<IGames>(isOpen ? [`/games`] : null)
    const [isFetching, setIsFetching] = useState(false)
    const [isDisableOK, setIsDisableOK] = useState(false)
    const {pathname} = useLocation();

    const idUser = pathname.split('/')[2] || infoUser.id

    const {data: dtSelUser} = useSWR(isOpen ? [`/users/user_id?user_id=${idUser}`, {}, {method: 'PATCH'}] : null)

    const refSelGames = useRef<HTMLSelectElement>(null)
    const [timeHire, setTimeHire] = useState(1)
    const [dataGames, setDataGames] = useState<{
        id:          string;
        title:       string;
        description: string;
        genre:       string;
        thumbnail:   string;
    }[]>([])

    useEffect(() => {
        if (dtCurrentUser && !dtCurrentUser?.data[currentUser?.info?.id]?.balance ){
            setIsDisableOK(true)
            return
        }
        setIsDisableOK(false)
        return

    }, [dtCurrentUser])

    useEffect(() => {
        if(dtGames && dtGames.data){
            const _ar = []
            for(const i in dtGames.data) _ar.push(dtGames.data[i])
            setDataGames(_ar)
        }
    }, [dtGames])

    const notiError = () => {
        refToast.current && toast.update(refToast.current, {
            status: "error",
            title: `Tạo phiếu thuê player thất bại`,
            isClosable: true
        })
    }

    const onOk = () => {
        if(isFetching) return

        const gameId = refSelGames.current && refSelGames.current.value || ""
        if (!gameId.length) return

        refToast.current = toast({
            status: "loading",
            title: `Đang tạo phiếu thuê player của bạn...`,
        })
        setIsFetching(true)

        fetch(`${BASE_URL}/rental_appications?idol_id=${idUser}`,
            {
                method: "POST",
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${currentUser.accessToken}`,
                },
                body: JSON.stringify({game_id: gameId, rental_period: timeHire})
            })
            .then((resp) => {
                if (resp.status == 200) {
                    resp.json().then((_) => {
                        try {
                            refToast.current && toast.update(refToast.current, {
                                status: "success",
                                title: `Tạo phiếu thuê player thành công`,
                                isClosable: true
                            })
                            setIsOpen(false)

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

    }

    return (
        <CusModal title={"THUÊ PLAYER"} okTxt={"Thuê"} closeTxt={'Đóng'}
                  setIsOpen={setIsOpen}
                  isDisableOK={isDisableOK}
                  onClickOk={onOk}
                  isOpen={isOpen}>
            <div className='text-white p-5 text-[16px] flex flex-col gap-3'>
                <div className='my-r justify-between'>
                    <div>Player:</div>
                    <div className='w-1/2'>{dtSelUser?.data[idUser]?.name || ""}</div>
                </div>

                <div className='my-r justify-between'>
                    <div>Game:</div>
                    <div className={`w-1/2`}>
                        <Select
                            ref={refSelGames}
                            className={`cursor-pointer `}
                            defaultValue={'1h'}
                            variant="customSelect1">

                            {(dtSelUser?.data[Object.keys(dtSelUser?.data)[0]] as IUser)?.games.map(i => <option
                                key={`sel-game-${i?.id}`}
                                value={i?.id}>{i?.name}</option>)}

                        </Select>
                    </div>
                </div>

                <div className='my-r justify-between'>
                    <div>Thời gian muốn thuê:</div>

                    <div className={`w-1/2`}>
                        <Select
                            onChange={e => {
                                setTimeHire(e.target.value)
                            }}
                            className={`cursor-pointer `}
                            defaultValue={'1h'}
                            variant="customSelect1">
                            <option value='1'>1h</option>
                            <option value='2'>2h</option>
                            <option value='3'>3h</option>
                            <option value='4'>4h</option>
                            <option value='5'>5h</option>
                        </Select>
                    </div>

                </div>

                <div className='my-r justify-between'>
                    <div>Chi phí:</div>
                    <div className='w-1/2'>{dtSelUser?.data[idUser]?.price && formatCurrency(timeHire * dtSelUser?.data?.price)} đ</div>
                </div>
                <div className='my-r justify-between'>
                    <div>Số dư hiện tại:</div>
                    <div className='text-[#dd5743] w-1/2 my-r gap-4'>
                        <div className={`my-r gap-1`}>
                            <FontAwesomeIcon icon={faWallet} style={{color: red1, fontSize: 16}}/>
                            <div>
                                {formatCurrency(dtCurrentUser && dtCurrentUser?.data[currentUser?.info?.id]?.balance) || 0} đ
                            </div>
                        </div>

                        <div
                            style={{background: red1}}
                            className='rounded-full flex items-center justify-center size-6 select-none hover:opacity-80 cursor-pointer'>
                            <div className='text-white'>
                                +
                            </div>
                        </div>
                    </div>
                </div>

                <Textarea
                    style={{fontFamily: 'Inter, FontAwesome'}}
                    placeholder='&#xf0e0; Tin nhắn của bạn ...'
                    variant={`textAreaStyle1`}
                    rows={4}
                    className={` py-3`}
                />

            </div>
        </CusModal>
    );
}

export default HireUser;