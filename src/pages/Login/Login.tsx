// @flow
import ReCAPTCHA from "react-google-recaptcha";

import {bg1, con1, red1} from "../../common/utils/Styles.tsx";
import './login.scss'
import {CusButton} from "../../components/CusButton.tsx";
import {hideByCls, visibleByCls} from "../../components/VisibleControl.tsx";
import {

    Input, ToastId, useToast,
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {isValidateEmail} from "../../common/utils/utils.ts";
import {BASE_URL, commonHeaders} from "../../common/utils/useReq.ts";
import {useRecoilState} from "recoil";
import {currentUserState, isAdminState} from "../../hooks/store.ts";
import {useCookies} from 'react-cookie';
import {useNavigate} from "react-router-dom";
import useSWR from "swr";
import {IUser} from "../PlayerDetail/PlayerDetail.tsx";
// interface ILogin {
//     code: string
//     message: string
//     data: {
//         access_token: string
//         refresh_token: string
//     },
//     links: any
//     relationships: any
//     timestamp: string
// }

export interface ILogin {
    code: string
    message: string
    data: {
        token: {
            access_token: string
            refresh_token: string
        }
        user: {
            id: string
            email: string
            name: string
        }
    }
    links: any
    relationships: any
    timestamp: string
}


const objLogin = {
    email: "string",
    password: "string",
}


const idToast = "login-signup-toast"

export default function Login() {
    const navi = useNavigate()

    const [isFetching, setIsFetching] = useState(false)
    const [isError, setIsError] = useState(false)
    const toast = useToast()
    const refToast = useRef<ToastId>()

    const refEmail = useRef<HTMLInputElement>(null)
    const refPwd = useRef<HTMLInputElement>(null)
    const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState)
    const [cookie, setCookie] = useCookies(['refreshToken']);
    const [isOkCapt, setIsOkCapt] = useState(false)
    const [accessInfoD, setAccessInfoD, removeAccessInfoD] = useCookies(['accessInfoD']);
    // const [cookieRefreshTK, setCookieRefreshTK, removeCookieRefreshTK] = useCookies(['refreshTokenD']);
    const [userId, setUserId] = useState('')

    const {data: userData} = useSWR(userId.length ? [`/users/user_id?user_id=${userId}`, {}, {method: 'PATCH'}]: null)


    useEffect(() => {
        if(userData && userData?.data){
            setCurrentUser(prev => {
                return{
                    ...prev,
                    info :{
                        ...prev.info,
                        avatar: (userData?.data[userId] as IUser)?.avatar || "",
                        name: (userData?.data[userId] as IUser)?.name || ""
                    }
                }
            })

        }

    }, [userData])

    useEffect(() => {
        if(!accessInfoD["accessInfoD"]) return

        if(!toast.isActive(idToast))
            refToast.current = toast({
                status: "loading",
                title: `Đăng nhập ...`,
                duration: 50000,
                id: idToast
            })

        if(accessInfoD["accessInfoD"].slice(0,6) == "email:"){
            hideByCls('con-login')
            visibleByCls('con-signup', con1)
            return
        }

        const arrInfo = accessInfoD["accessInfoD"].split("||")
        if (arrInfo.length != 5) refToast.current && toast.update(refToast.current, {
            status: "error",
            title: `Đăng nhập Google thất bại`,
        })

        setUserId(arrInfo[2])

        setCurrentUser({
            accessToken: arrInfo[0],
            info: {
                id: arrInfo[2],
                email: arrInfo[3],
                name: arrInfo[4]
            }
        })

        setCookie('refreshToken', arrInfo[1], {
            path: '/',
            // httpOnly: true,
            secure: false,
            // sameSite: "strict"
        })

        refToast.current && toast.update(refToast.current, {
            status: "success",
            title: `Đăng nhập Google thành công`,
        })



        setTimeout(() => {
            hideByCls('con-login')
            hideByCls('con-signup')
        },2000)

    }, [accessInfoD['accessInfoD']])


    const fetchLogin = (obj: any) => {
        refToast.current = toast({
            status: "loading",
            title: `Đăng nhập ...`,
            id: idToast
        })

        fetch(`${BASE_URL}/user/login/access-token`, {
            method: "POST",
            headers: commonHeaders,
            body: JSON.stringify(obj),
            redirect: "follow"
        })
            .then((resp) => {
                if (resp.status == 200) {
                    resp.json().then((data: ILogin) => {
                        try{
                            refToast.current && toast.update(refToast.current, {
                                status: "success",
                                title: `Đăng nhập thành công`,
                                duration: 5000,
                                isClosable: true
                            })

                            setCurrentUser({accessToken: data.data.token.access_token, info: data.data.user})
                            setUserId(data.data.user.id)

                            setCookie('refreshToken', data.data.token.refresh_token, {
                                path: '/',
                                // httpOnly: true,
                                secure: false,
                                // sameSite: "strict"
                            })

                        }catch (e) {
                            refToast.current && toast.update(refToast.current, {
                                status: "error",
                                title: `Đăng nhập thất bại`,
                            })
                        }


                        setTimeout(() => {
                            hideByCls('con-login')
                            hideByCls('con-signup')
                        },1500)

                    })
                    setIsFetching(false)

                    return
                }
                resp.json().then(data => {
                    refToast.current && toast.update(refToast.current, {
                        status: "error",
                        title: `Đăng nhập thất bại`,
                        description: data.message
                    })
                })
                setIsFetching(false)

            })
            .catch((error) => {
                console.error(error)
                refToast.current && toast.update(refToast.current, {
                    status: "error",
                    title: `Đăng nhập thất bại`,
                })
                setIsFetching(false)
            });
    }

    const onFinish = () => {
        if (isFetching || !isOkCapt) return
        setIsError(false)
        const email = refEmail.current && refEmail.current.value || ""

        if (!isValidateEmail(email)) {
            setIsError(true)
            return
        }

        setIsFetching(true)
        const obj = JSON.parse(JSON.stringify(objLogin))
        obj.email = email
        obj.password = refPwd.current && refPwd.current.value || ""
        fetchLogin(obj)
    }

    return (
        <div
            onMouseDown={(e) => {if ((e.target as HTMLElement).classList.contains('con-login')) hideByCls('con-login')}}
            className={`con-login hidden`} style={{zIndex: 555}}>
            <div
                className={`login bg-[${bg1}] absolute top-15 left-2/4 -translate-x-2/4 w-[400px] h-[550px] rounded-lg flex flex-col items-center gap-4 p-8`}>
                <div className={` font-bold text-xl`} style={{color: red1}}>ĐĂNG NHẬP</div>
                <Input isInvalid={isError} ref={refEmail} placeholder="Email"  type={"email"}
                       variant="custom1" required={true}/>
                <Input ref={refPwd} placeholder="Mật khẩu" variant="custom1"
                       onKeyDown={(e) => {
                           if (e.key == "Enter") onFinish()
                       }}
                       type={"password"}/>

                <div className='w-full flex justify-end '>
                    <div className={`forgot-pwd cursor-pointer select-none text-white text-sm`}>Quên mật khẩu?</div>
                </div>

                <ReCAPTCHA
                    sitekey="6LfRF3AqAAAAAKqgl-K-_P8mPtOrN-NwyYNqsVce"
                    onChange={() => {setIsOkCapt(true)}}
                    onErrored={() => {setIsOkCapt(false)}}
                    onExpired={() => {setIsOkCapt(false)}}
                />

                <CusButton clsButton={`mt-4 bg-[${red1}] w-full h-[35px]`} name={"Đăng nhập"}
                           clsText={' text-sm'} isDisable={!isOkCapt}
                           onClick={onFinish}/>

                <CusButton clsButton={`border-2 border-[#2d2d2e] w-full h-[35px]`} name={"Đăng nhập bằng Google"}
                           clsText={' text-sm'} isDisable={!isOkCapt}
                           onClick={() => {

                               if (isFetching || !isOkCapt) return
                               setIsFetching(true)
                               // removeCookieAccTK('accessInfoD')

                               refToast.current = toast({
                                   status: "loading",
                                   title: `Đăng nhập ...`,
                                   duration: 3000,
                                   id: idToast
                               })

                               removeAccessInfoD('accessInfoD')
                               fetch(`${BASE_URL}/login/google`, {
                                   method: "GET",
                                   headers: commonHeaders,
                               })
                                   .then((resp) => {
                                       if (resp.status == 200) {
                                           resp.text().then((data) => {
                                               if (data && data.length) {
                                                   window.open(data.slice(1, -1), '_blank', 'rel=noopener noreferrer')
                                               }
                                           })
                                           setIsFetching(false)

                                           return
                                       }
                                       resp.json().then(_ => {
                                           refToast.current && toast.update(refToast.current, {
                                               status: "error",
                                               title: `Đăng nhập Google thất bại`,
                                               // description: data.message
                                           })
                                       })
                                       setIsFetching(false)

                                   })
                                   .catch((error) => {
                                       console.error(error)
                                       refToast.current && toast.update(refToast.current, {
                                           status: "error",
                                           title: `Đăng nhập thất bại`,
                                       })
                                       setIsFetching(false)
                                   })
                           }}/>


                <div className={`underline my-btn text-sm text-white mt-5`}
                     onClick={() => {
                         hideByCls('con-login')
                         visibleByCls('con-signup', con1)
                     }}
                >Đăng ký tài khoản
                </div>

            </div>
        </div>
    );
};
