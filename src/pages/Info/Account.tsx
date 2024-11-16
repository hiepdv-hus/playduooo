import {bg2, clsInputDate, gray1, red1} from "../../common/utils/Styles.tsx";
import IconStar from "../../images/icon/icon-star.svg";
import {CusButton} from "../../components/CusButton.tsx";
import IconChat from "../../images/icon/icon-chat-2.svg";
import IconLove from "../../images/icon/icon-love-1.svg";
import {CusDivider} from "../../components/CusDivider.tsx";
import {useRecoilState} from "recoil";
import {currentUserState} from "../../hooks/store.ts";
import useSWR from "swr";
import {BASE_URL, commonHeaders, getStaticFile, myFetch} from "../../common/utils/useReq.ts";
import {IUser} from "../PlayerDetail/PlayerDetail.tsx";
import {SEX, formatCurrency, getValBRef, randomStr, PROVINCES} from "../../common/utils/utils.ts";
import {Input, NumberInput, NumberInputField, Select, ToastId, useToast} from "@chakra-ui/react";
import React, {ChangeEvent, forwardRef, useEffect, useRef, useState} from "react";
import {ClassNamesArg} from "@emotion/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload, faWallet} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {hideByCls} from "../../components/VisibleControl.tsx";


const objDefaultUser = {
    "password": "string",
    "name": "string",
    "username": "string",
    "avatar": "string",
    "birthday": "string",
    "sex": "string",
    "location": "string",
    "evaluate": "string",
    "price": "string"
}


export interface IRentalUser {
    code:          string;
    message:       string;
    data:          { [key: string]: {
            id:            string;
            game_id:       string;
            user_id:       string;
            idol_id:       string;
            status:        string;
            rental_period: number;
            expense:       number;
        } };
    links:         null;
    relationships: null;
    timestamp:     Date;
}

export interface IRentalTotal {
    code:          string;
    message:       string;
    data:          number[];
    links:         null;
    relationships: null;
    timestamp:     Date;
}


export const Account = () => {
    const toast = useToast()
    const refToast = useRef<ToastId>()
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
    const [dtUser, setDtUser] = useState<IUser>()
    const {data: dataUser, error: errDataUser, mutate: mUser} = useSWR([currentUser.info.id ? `/users/user_id?user_id=${currentUser.info.id}` : null, {}, {method: 'PATCH'}])
    // const {data: dtRentalUser} = useSWR<IRentalUser>(currentUser.info.id ? [ `/rental_appication_user`] : null)
    const {data: dtRentalTT} = useSWR<IRentalTotal>(['/rental_appication_user_money'])
    // let dtUser: IUser
    // if(dataUser) dtUser = dataUser?.data[currentUser.info.id] as IUser
    const [isFetching, setIsFetching] = useState(false)
    const refLocation = useRef<HTMLSelectElement>(null)

    const [file, setFile] = useState<File>()
    const refUserName = useRef<HTMLInputElement>(null)
    const refName = useRef<HTMLInputElement>(null)
    const refDOB = useRef<HTMLInputElement>(null)
    const refSex = useRef<HTMLSelectElement>(null)
    const refPrice = useRef<HTMLInputElement>(null)

    // rental_appication_user

    const clsLabel= "text-md text-white mb-1 mt-5 pl-1"

    useEffect(() => {
        if(dataUser && dataUser.data){
            setDtUser(dataUser?.data[currentUser.info.id] as IUser)
            if(refLocation.current){
                refLocation.current.value = dataUser?.data[currentUser.info.id]?.location
            }

        }

    }, [dataUser])


    const notiError = () => {
        refToast.current && toast.update(refToast.current, {
            status: "error",
            title: `Cập nhật thông tin thất bại`,
            isClosable: true
        })
    }

    const onOk = () => {
        if (isFetching) return

        const inputObj = {
            ...objDefaultUser,
            name: getValBRef(refName) || objDefaultUser.name,
            username: getValBRef(refUserName) || objDefaultUser.username,
            birthday: getValBRef(refDOB) || objDefaultUser.birthday,
            sex: getValBRef(refSex) || objDefaultUser.sex,
            price: getValBRef(refPrice) || objDefaultUser.price,
            location: getValBRef(refLocation) || objDefaultUser.location
        }
        refToast.current = toast({
            status: "loading",
            title: `Đang cập nhật thông tin`,
        })
        setIsFetching(true)
        fetch(`${BASE_URL}/users/?user_id=${currentUser.info.id}`,
            {
                method: "PUT",
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${currentUser.accessToken}`,
                },
                body: JSON.stringify(inputObj)
            })
            .then((resp) => {
                if (resp.status == 200) {
                    resp.json().then((_) => {
                        try {
                            refToast.current && toast.update(refToast.current, {
                                status: "success",
                                title: `Cập nhật thông tin thành công`,
                                isClosable: true

                            })
                            mUser()
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

        setIsFetching(true)
        if(file){
            const formdata = new FormData();
            const f = file.name.split(".")
            formdata.append("avatar", file, `${randomStr()}.${f[f.length - 1]}`);
            fetch(`${BASE_URL}/users/${currentUser?.info?.id}/avatar`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${currentUser.accessToken}`,
                    },
                    body: formdata
                })
                .then((resp) => {
                    if (resp.status == 200) {
                        resp.json().then((_) => {
                            try {
                                refToast.current && toast.update(refToast.current, {
                                    status: "success",
                                    title: `Cập nhật thông tin thành công`,
                                    isClosable: true
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
    }

    const Div3 = () => {
        return (
            <div className={`p-2 w-full flex flex-col gap-3`}>
                <div className={`rounded-md flex flex-col justify-center items-center w-full py-4`}
                     style={{border: ".5px solid white"}}>
                    <div style={{color: gray1}} className={`text-sm`}>SỐ DƯ</div>
                    <div className={`my-r gap-1 `}>
                        <FontAwesomeIcon icon={faWallet} style={{color: red1, fontSize: 16}}/>
                        <div style={{color: red1}} className={`text-lg font-bold max-w-[90%] h-[30px] txt-clip`}>{dtUser?.balance || 0} đ</div>

                    </div>
                </div>
                <div className={`rounded-md flex flex-col justify-center items-center w-full py-4`}
                     style={{border: ".5px solid white"}}>
                    <div style={{color: gray1}} className={`text-sm`}>TỔNG TIỀN ĐÃ THUÊ</div>
                    <div style={{color: red1}} className={`text-lg font-bold`}>{formatCurrency(dtRentalTT?.data && dtRentalTT?.data[0] || 0) || 0} đ</div>
                </div>
                <div className={`rounded-md flex flex-col justify-center items-center w-full py-4`}
                     style={{border: ".5px solid white"}}>
                    <div style={{color: gray1}} className={`text-sm`}>TỔNG SỐ GIỜ THUÊ</div>
                    <div style={{color: red1}} className={`text-lg font-bold`}>{ dtRentalTT?.data && dtRentalTT?.data[1] } GIỜ</div>
                </div>
            </div>
            // <div className={`rounded-lg w-full  p-2 `} style={{border: "1px solid rgba(51, 53, 59, 1)"}}>
            //     <div style={{color: red1}} className={`font-bold text-xl`}>{dtUser?.price && formatCurrency(dtUser?.price) || 0} đ/h</div>
            //     <div className='my-r gap-1 mt-2'>
            //         <img className={`w-4`} src={IconStar} alt=""/>
            //         <img className={`w-4`} src={IconStar} alt=""/>
            //         <img className={`w-4`} src={IconStar} alt=""/>
            //         <img className={`w-4`} src={IconStar} alt=""/>
            //         <img className={`w-4`} src={IconStar} alt=""/>
            //     </div>
            //
            //     <div style={{color: red1}} className={`font-bold mt-5`}>
            //         Đã ngưng nhận yêu cầu
            //     </div>
            //
            //     <CusButton clsButton={'mt-5 rounded-lg w-full h-12 bg-[#97bddd]'} name={'DONATE'}
            //                clsText={'text-[#374050] font-bold text-lg'} onClick={() => {
            //     }}/>
            //     <CusButton clsButton={'mt-2 rounded-lg w-full h-12 bg-[#97bddd]'} name={'CHAT'}
            //                clsText={'text-[#374050] font-bold text-lg'} icon={IconChat} onClick={() => {
            //     }}/>
            //     <div style={{color: red1}} className={`font-bold mt-5 text-sm italic`}>
            //         Player này chưa xác thực thông tin và hồ sơ
            //     </div>
            // </div>
        )
    }

    return (
        <div className='flex flex-col lg:flex-row justify-between gap-4 lg:gap-10'>

            <div className={`flex flex-col sm:flex-row justify-between `}>
                <div className={`flex flex-col items-center gap-3 `}>
                    <div className={`size-50 `}>
                        <label htmlFor="upload-avatar"
                               style={{color: bg2}}
                               className={` hover:opacity-80 cursor-pointer`}>
                            <img className={`rounded-lg size-50`}
                                 src={(file && URL.createObjectURL(file)) || getStaticFile(dtUser?.avatar || "")} alt=""/>
                        </label>

                    </div>
                    <div className='my-r text-sm'>
                        <div className={`font-bold`} style={{color: gray1}}>NGÀY THAM GIA:</div>
                        {/*<div>&nbsp;19/01/2023</div>*/}
                    </div>



                </div>

                <div className={`block lg:hidden mt-5 sm:mt-0 w-[98%] sm:w-1/2`}>
                    <Div3/>
                </div>
            </div>

            <div className={`mt-5 sm:mt-0 flex-1`}>
                <div className={`my-r justify-between px-2 sm:px-0`}>
                    <div className={`text-title-lg font-bold`}>{dtUser?.name || ''}</div>
                    {/*<CusButton clsButton={`bg-[#e05844] rounded-[35px] px-4 py-1`} name={"Theo dõi"}*/}
                    {/*           clsText={'font-bold'} icon={IconLove} onClick={() => {*/}
                    {/*}}/>*/}
                </div>

                <div className='my-r justify-between mt-10 gap-4 font-bold text-sm'>
                    <div className={` `}>
                        <div className={` text-[#a8a8a9]`}>SỐ NGƯỜI THEO DÕI</div>
                        <div style={{color: red1}}>0 người</div>
                    </div>

                    <div className={``}>
                        <div className={` text-[#a8a8a9]`}>ĐÃ ĐƯỢC THUÊ</div>
                        <div style={{color: red1}}>0 giờ</div>
                    </div>

                    <div className={``}>
                        <div className={` text-[#a8a8a9]`}>TỶ LỆ HOÀN THÀNH</div>
                        <div style={{color: red1}}>0%</div>
                    </div>

                    <div className={``}>
                        <div className={` text-[#a8a8a9]`}>TÌNH TRẠNG THIẾT BỊ</div>
                        <div style={{color: red1}}>_</div>
                    </div>
                </div>

                <CusDivider cls={{background: 'rgba(51, 53, 59, 1)', marginTop: 50}}/>
                <CusDivider cls={{background: 'rgba(51, 53, 59, 1)', marginTop: 50}}/>

                <div className={``}>
                    <div className={`text-title-lg font-bold mt-15 mb-5`}>Thông tin</div>
                    <div className={`${clsLabel}`}>NickName</div>
                    <Input ref={refUserName} defaultValue={dtUser?.username || ''} variant="custom1" required={true}/>
                    <div className={`${clsLabel}`}>Họ và tên</div>
                    <Input ref={refName} defaultValue={dtUser?.name || ''} variant="custom1" required={true}/>
                    <div className={`${clsLabel}`}>Giới tính</div>
                    <Select
                        ref={refSex}
                        className={`cursor-pointer `}
                        defaultValue={dtUser?.sex || ''}
                        variant="customSelect1">
                        {SEX.map(i =>
                            <option key={`sel-game-${i.key}`} value={i.key}>{i?.name}</option>)}
                    </Select>

                    <div className={`${clsLabel}`}>Giá</div>
                    <input ref={refPrice} type="number"
                           className={`bg-[${bg2}] w-full h-[40px] rounded-[10px] pl-[16px]`}
                           defaultValue={dtUser?.price}/>

                    <div className={`w-full my-r justify-between mt-5`}>
                        <div className={`${clsLabel} !mt-0`}>Ngày sinh</div>
                        <div className={`w-1/2`}>
                            <input
                                ref={refDOB}
                                // id={`dob-user`}
                                type="date"
                                defaultValue={dtUser?.birthday}
                                className={`${clsInputDate} w-full`}/>
                        </div>

                    </div>

                    <div className={`w-full my-r justify-between mt-5`}>
                        <div className={`${clsLabel} !mt-0`}>Vị trí</div>
                        <div className={`w-1/2`}>
                            <Select
                                ref={refLocation}
                                className={`cursor-pointer `}
                                variant="customSelect1">
                                {PROVINCES.map(i =>
                                    <option key={`signup-loc-${i.key}`} value={i.key}>{i?.name}</option>)}
                            </Select>
                        </div>
                    </div>

                    <CusButton clsButton={`bg-[${red1}] h-[35px] mt-10`} name={'CẬP NHẬT THÔNG TIN'} clsText={''}
                               onClick={onOk}/>

                    <input
                        id={`upload-avatar`}
                        type="file" style={{display: "none"}}
                        accept="image/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target && e.target.files) setFile(e.target.files[0])
                        }}/>

                </div>
            </div>

            <div className={`hidden lg:block w-1/4`}>
                <Div3/>
            </div>

        </div>
    )
}
