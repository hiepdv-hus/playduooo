import React, {ComponentState, useEffect, useRef, useState} from "react";
import {CusModal} from "../CusModal.tsx";
import useSWR from "swr";
import {useRecoilState} from "recoil";
import {currentUserState} from "../../hooks/store.ts";
import {formatCurrency} from "../../common/utils/utils.ts";
import {Input, Textarea, ToastId, useToast} from "@chakra-ui/react";
import {BASE_URL, commonHeaders} from "../../common/utils/useReq.ts";
import {hideByCls} from "../VisibleControl.tsx";
import {useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWallet} from "@fortawesome/free-solid-svg-icons";
import {red1} from "../../common/utils/Styles.tsx";


interface IDonateUser{
    setIsOpen: ComponentState
    isOpen: ComponentState
}
function DonateUser({setIsOpen, isOpen}: IDonateUser) {
    const toast = useToast()
    const refToast = useRef<ToastId>()
    const [currentUser] = useRecoilState<any>(currentUserState)
    const {data: dtCurrentUser} = useSWR(isOpen ? [`/users/user_id?user_id=${currentUser?.info?.id}`, {}, {method: 'PATCH'}] : null)

    const refAmount = useRef<HTMLInputElement>(null)
    const refDisplayName = useRef<HTMLInputElement>(null)
    const refMsg = useRef<HTMLInputElement>(null)
    const [isFetching, setIsFetching] = useState(false)
    const [isDisableOK, setIsDisableOK] = useState(false)
    const {pathname} = useLocation();

    const idUser = pathname.split('/')[2]
    const {data: dtSelUser} = useSWR(isOpen ? [`/users/user_id?user_id=${idUser}`, {}, {method: 'PATCH'}] : null)


    useEffect(() => {
        if (dtCurrentUser && !dtCurrentUser?.data[currentUser?.info?.id]?.balance ){
            setIsDisableOK(true)
            return
        }
        setIsDisableOK(false)
        return

    }, [dtCurrentUser])

    const notiError = (msg: string = "") => {
        refToast.current && toast.update(refToast.current, {
            status: "error",
            title: `Donate player thất bại`,
            description: msg,
            isClosable: true
        })
    }
    const onOk = () => {
        if(isFetching) return

        const amount = refAmount.current && +(refAmount.current.value) || 0
        if (!amount || amount <= 0) {
            refToast.current = toast({
                status: "error",
                title: `Donate player thất bại`,
                description: 'Số tiền donate không hợp lệ!',
                isClosable: true
            })
            return
        }

        refToast.current = toast({
            status: "loading",
            title: `Đang gửi yêu cầu của bạn...`,
        })

        setIsFetching(true)
        fetch(`${BASE_URL}/donates?idol_id=${idUser}`,
            {
                method: "POST",
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${currentUser.accessToken}`,
                },
                body: JSON.stringify({expense: amount, message: refMsg.current && refMsg.current.value || ""})
            })
            .then((resp) => {
                if (resp.status == 200) {
                    resp.json().then((_) => {
                        try {
                            refToast.current && toast.update(refToast.current, {
                                status: "success",
                                title: `Donate player thành công`,
                                isClosable: true
                            })
                            setIsOpen(false)

                        } catch (e) {
                            notiError()
                        }
                    })
                    hideByCls('con-upload-str')
                    setIsFetching(false)
                    return
                } //end IF

                resp.json().then(data => {
                    notiError(data.message)
                    setIsFetching(false)
                    return
                })

            })

    }



    return (
        <CusModal title={"DONATE"} okTxt={"Donate"} isDisableOK={isDisableOK} closeTxt={'Đóng'} setIsOpen={setIsOpen}
                  onClickOk={onOk}
                  isOpen={isOpen}>
            <div className='text-white p-5 text-[16px] flex flex-col gap-3'>
                <div className='my-r justify-between'>
                    <div>Người nhận:</div>
                    <div className='w-1/2'>{dtSelUser?.data[idUser]?.name || ''}</div>
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
                            className='rounded-[50%] bg-[#ce5e4b] flex items-center justify-center size-6 hover:opacity-80 select-none cursor-pointer'>
                            <div className='text-white'>
                                +
                            </div>
                        </div>
                    </div>
                </div>

                <div className='my-r justify-between'>
                    <div>Số tiền muốn donate:</div>
                    <div className='w-1/2'>
                        <Input ref={refAmount} placeholder={'Số tiền...'} type={"number"} variant="custom1"/>

                    </div>
                </div>
                <div className='my-r justify-between'>
                    <div>Tên hiển thị:</div>
                    <div className='w-1/2'>
                        <Input ref={refDisplayName} placeholder={'Tên hiển thị...'} variant="custom1"/>
                    </div>

                </div>

                <Textarea
                    style={{fontFamily: 'Inter, FontAwesome'}}
                    placeholder='&#xf0e0; Tin nhắn của bạn ...'
                    variant={`textAreaStyle1`}
                    rows={4}
                    className={`fas fa-search fa-envelope py-3`}
                />
            </div>
        </CusModal>
    );
}

export default DonateUser;