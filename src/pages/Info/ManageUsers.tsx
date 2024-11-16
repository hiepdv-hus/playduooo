// @flow
import {currentUserState, isAdminState} from "../../hooks/store.ts";
import {useRecoilState} from "recoil";
import useSWR from "swr";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {bg2, gray1, red1} from "../../common/utils/Styles.tsx";
import {BASE_URL, commonHeaders, getStaticFile} from "../../common/utils/useReq.ts";
import {CusButton} from "../../components/CusButton.tsx";
import {CusDivider} from "../../components/CusDivider.tsx";
import {CusModal} from "../../components/CusModal.tsx";
import {Input, Select, Spinner, ToastId, useToast} from "@chakra-ui/react";
import {SEX, getValBRef, randomStr} from "../../common/utils/utils.ts";
import {IUser} from "../PlayerDetail/PlayerDetail.tsx";

export interface IAllUsers {
    code: string;
    message: string;
    data: {
        [key: string]: IUser
    };
    links: null;
    relationships: null;
    timestamp: Date;
}

const objDefaultUser = {
    "password": "string",
    "name": "string",
    "username": "string",
    "avatar": "string",
    "birthday": "string",
    "sex": "string",
    "location": "string",
    "evaluate": "string",
    "price": "number",
}

export function ManageUsers() {
    const [isAdmin] = useRecoilState<boolean>(isAdminState)
    if (!isAdmin) return <div></div>

    const toast = useToast()
    const refToast = useRef<ToastId>()
    const [isFetching, setIsFetching] = useState(false)
    const [currentUser] = useRecoilState(currentUserState)

    const refUserName = useRef<HTMLInputElement>(null)
    const refName = useRef<HTMLInputElement>(null)
    const refDOB = useRef<HTMLInputElement>(null)
    const refSex = useRef<HTMLSelectElement>(null)
    const refPrice = useRef<HTMLInputElement>(null)
    // const refBalance = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File>()

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const {data: dtAllUsers,error: errDtAllUsers, mutate: mUser,isLoading: isLoadingAllUsers} = useSWR<IAllUsers>(['/users'])
    const [dataAllUsers, setDataAllUsers] = useState<IUser[]>([])
    const [selUser, setSelUser] = useState<IUser>({})
    const clsLabel= "text-md text-white mb-1 mt-5 pl-1"

    const notiError = () => {
        refToast.current && toast.update(refToast.current, {
            status: "error",
            title: `Cập nhật thông tin thất bại`,
            isClosable: true
        })
    }
    const notiErrorMsg = (msg: string) => {
        toast({
            status: "error",
            title: msg,
            isClosable: true
        })
    }

    useEffect(() => {
        if(dtAllUsers && dtAllUsers?.data) {
            const ar: IUser[] = []
            for(const i in dtAllUsers.data){
                ar.push(dtAllUsers.data[i])
            }
            setDataAllUsers(ar)
        }
    }, [dtAllUsers])

    const onOk = () => {
        if (isFetching) return
        const inputObj = {
            ...objDefaultUser,
            name: getValBRef(refName) || objDefaultUser.name,
            username: getValBRef(refUserName) || objDefaultUser.username,
            birthday: getValBRef(refDOB) || objDefaultUser.birthday,
            sex: getValBRef(refSex) || objDefaultUser.sex,
            price: getValBRef(refPrice) || objDefaultUser.price,
        }
        refToast.current = toast({
            status: "loading",
            title: `Đang cập nhật thông tin`,
        })
        setIsFetching(true)

        fetch(`${BASE_URL}/users/?user_id=${selUser.id}`,
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
                            !file && mUser()
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


        if(file){
            setIsFetching(true)
            const formdata = new FormData();
            const f = file.name.split(".")
            formdata.append("avatar", file, `${randomStr()}.${f[f.length - 1]}`);
            fetch(`${BASE_URL}/users/${selUser.id}/avatar`,
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
                               toast({
                                    status: "success",
                                    title: `Cập nhật avatar thành công`,
                                    isClosable: true
                                })
                                mUser()
                            } catch (e) {
                                notiErrorMsg("Cập nhật avatar thất bại")
                            }
                        })
                        setIsFetching(false)
                        return
                    } //end IF

                    notiErrorMsg("Cập nhật avatar thất bại")
                    setIsFetching(false)
                    return
                }).catch(_ => {
                notiErrorMsg("Cập nhật avatar thất bại")
                setIsFetching(false)
            })
        }

        // const balance = getValBRef(refBalance)
        // if(balance?.length){
        //     setIsFetching(true)
        //
        //     fetch(`${BASE_URL}/user_to_money?user_id=${selUser.id}&money=${balance}`,
        //         {
        //             method: "PUT",
        //             headers: {
        //                 Authorization: `Bearer ${currentUser.accessToken}`,
        //             },
        //         })
        //         .then((resp) => {
        //             if (resp.status == 200) {
        //                 resp.json().then((_) => {
        //                     try {
        //                         toast({
        //                             status: "success",
        //                             title: `Cập nhật số dư thành công`,
        //                             isClosable: true
        //                         })
        //                     } catch (e) {
        //                         notiErrorMsg("Cập nhật số dư thất bại")
        //                     }
        //                 })
        //                 setIsFetching(false)
        //                 return
        //             } //end IF
        //
        //             notiErrorMsg("Cập nhật số dư thất bại")
        //             setIsFetching(false)
        //             return
        //         }).catch(_ => {
        //         notiErrorMsg("Cập nhật số dư thất bại")
        //         setIsFetching(false)
        //     })
        // }

    }


    return (
        <div className={`p-2`}>
            <div style={{color: red1}} className={`text-title-md font-bold w-max mx-auto mt-5`}>ADMIN</div>

            <div className={`w-full`}>
                { isLoadingAllUsers ? <div className={`w-full flex justify-center mt-10`}><Spinner color={`white`}/></div> :

                    dataAllUsers.map(i =>
                    <div key={`user-${i?.id}`}>
                        <div  className={`my-r justify-between mt-5 `}>
                            <div className={`my-r gap-3`}>
                                <img src={getStaticFile(i?.avatar)} className={`rounded-full size-[50px] bg-[${gray1}]`}
                                     alt=""/>
                                <div className={`text-white text-sm txt-clip`}>{i?.name}</div>
                            </div>

                            <CusButton clsButton={`bg-[${red1}] h-[40px] min-w-[120px]`} name={`Chỉnh sửa`} clsText={``}
                                       onClick={() => {
                                           setSelUser(i)
                                           setFile(null)
                                           setIsOpen(true)
                                       }}/>
                        </div>
                        <CusDivider cls={{width: "97%", marginLeft: "auto", marginRight: "auto"}}/>
                    </div>
                )}
            </div>

            <CusModal title={`THÔNG TIN USER`} okTxt={"Lưu"} closeTxt={"HỦY"} isOpen={isOpen} setIsOpen={setIsOpen} onClickOk={onOk}>
                <div className={`p-3 h-max`}>

                    <label htmlFor="auser-upload-avatar"
                           style={{color: bg2}}
                           className={` hover:opacity-80 cursor-pointer size-25`}>
                        <img className={`rounded-lg size-25 mx-auto`}
                             src={(file && URL.createObjectURL(file)) || getStaticFile(selUser?.avatar || "")} alt=""/>
                    </label>

                    <div className={`${clsLabel}`}>Họ tên</div>
                    <Input ref={refName} defaultValue={selUser.name || ''} variant="custom1" required={true}/>

                    <div className={`${clsLabel}`}>NickName</div>
                    <Input ref={refUserName} defaultValue={selUser?.username || ''} variant="custom1" required={true}/>

                    <div className={`${clsLabel}`}>Giới tính</div>
                    <Select
                        ref={refSex}
                        className={`cursor-pointer `}
                        defaultValue={selUser?.sex || ''}
                        variant="customSelect1">
                        {SEX.map(i =>
                            <option key={`sel-game-${i.key}`} value={i.key}>{i?.name}</option>)}
                    </Select>

                    <div className={`w-full my-r justify-between mt-5`}>
                        <div className={`${clsLabel} !mt-0`}>Ngày sinh</div>
                        <input
                            ref={refDOB}
                            id={`dob-user`} type="date"
                            defaultValue={selUser?.birthday || ""}
                            className={`bg-[${bg2}] hov-style-1 rounded-[10px] h-[40px] px-2 !text-[16px]`}/>
                    </div>

                    <div className={`${clsLabel}`}>Giá</div>
                    <input ref={refPrice} type="number"
                           className={`bg-[${bg2}] w-full h-[40px] rounded-[10px] pl-[16px]`}
                           defaultValue={selUser?.price || 0}/>
                    {/*<div className={`${clsLabel}`}>Số dư</div>*/}
                    {/*<input ref={refBalance} type="number"*/}
                    {/*       className={`bg-[${bg2}] w-full h-[40px] rounded-[10px] pl-[16px]`}*/}
                    {/*       defaultValue={selUser?.balance || 0}/>*/}
                    <input
                        id={`auser-upload-avatar`}
                        type="file" style={{display: "none"}}
                        accept="image/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target && e.target.files) setFile(e.target.files[0])
                        }}/>
                </div>
            </CusModal>


        </div>
    );
}