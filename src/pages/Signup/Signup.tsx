// @flow

import {bg1, bg2, clsInputDate, con1, red1} from "../../common/utils/Styles.tsx";
import {CusButton} from "../../components/CusButton.tsx";
import {hideByCls, visibleByCls} from "../../components/VisibleControl.tsx";
import {FormControl, FormErrorMessage, Input, Select, ToastId} from "@chakra-ui/react";
import {useToast} from '@chakra-ui/react'
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {BASE_URL, commonHeaders, getStaticFile, myFetch} from "../../common/utils/useReq.ts";
import {SEX, isValidateEmail, PROVINCES, getValBRef, randomStr} from "../../common/utils/utils.ts";
import {useCookies} from "react-cookie";
import ReCAPTCHA from "react-google-recaptcha";

const objSignUp = {
    email: "string",
    password: "string",
    name: "string",
    username: "string",
    avatar: "string",
    birthday: "string",
    sex: "string",
    location: "string",
    evaluate: "0.0",
    price: "0.0"
}


export function Signup() {
    const toast = useToast()
    const refToast = useRef<ToastId>()
    const [isFetching, setIsFetching] = useState(false)
    const [isErrorPwd, setIsErrorPwd] = useState(false)
    const [isErrorUserName, setIsErrorUserName] = useState(false)
    const [isErrorName, setIsErrorName] = useState(false)
    const [isErrorEmail, setIsErrorEmail] = useState(false)
    const [isErrorDOB, setIsErrorDOB] = useState(false)
    const [isErrorPrice, setIsErrorPrice] = useState(false)
    const [msgErrorPwd, setMsgErrorPwd] = useState('')
    const [file, setFile] = useState<File>()
    const [isOkCapt, setIsOkCapt] = useState(false)


    const refUserName = useRef<HTMLInputElement>(null)
    const refName = useRef<HTMLInputElement>(null)
    const refEmail = useRef<HTMLInputElement>(null)
    const refDOB = useRef<HTMLInputElement>(null)
    const refSex = useRef<HTMLSelectElement>(null)
    const refLocation = useRef<HTMLSelectElement>(null)
    const refPrice = useRef<HTMLInputElement>(null)

    const refPwd = useRef<HTMLInputElement>(null)
    const refConfirmPwd = useRef<HTMLInputElement>(null)

    const [accessInfoD, setAccessInfoD, removeAccessInfoD] = useCookies(['accessInfoD']);

    useEffect(() => {
        if(!accessInfoD["accessInfoD"]) return
        if(accessInfoD["accessInfoD"].slice(0,6) == "email:"){
            setIsErrorPwd(true)
            setIsErrorUserName(true)
            setMsgErrorPwd('Vui lòng đăng ký trước khi sử dụng tính năng đăng nhập bằng Google.')

            if(refEmail.current){
                refEmail.current.value = accessInfoD["accessInfoD"].slice(6)
            }
        }

    }, [accessInfoD['accessInfoD']])


    const isValidPwd = () => {
        if (refPwd.current && refConfirmPwd.current) {
            const pwd = getValBRef(refPwd)
            if (!pwd || pwd?.length < 7)
                return "Mật khẩu phải hơn 8 ký tự"
            if (refPwd.current.value === refConfirmPwd.current.value) return ""
        }
        return "Mật khẩu không khớp"
    }


    const fetchURL = (url: string) => {
        refToast.current = toast({
            status: "loading",
            title: `Đăng ký ...`,
            duration: 20000
        })

        const formdata = new FormData();
        try {
            const f = file.name.split(".")
            formdata.append("avatar", file, `${randomStr()}.${f[f.length - 1]}`);
        }catch (_){
            toast({
                title: "File không hợp lệ",
                duration: 5000,
                status: "error",
                isClosable: true
            })
            setIsFetching(false)
            return
        }

        fetch(`${BASE_URL}/create-user?${url}`, {
            method: "POST",
            // headers: commonHeaders,
            body: formdata,
            redirect: "follow"
        })
            .then((resp: any) => {
                if (resp.status == 200) {
                    resp.json().then((data: any) => {
                        refToast.current && toast.update(refToast.current, {
                            status: "success",
                            title: `Đăng ký thành công`,
                            duration: 3000,
                            isClosable: true
                        })

                        setTimeout(() => {
                            hideByCls('con-signup')
                            visibleByCls('con-login', con1)
                        },1500)

                    })
                    setIsFetching(false)

                    return
                }

                resp.json().then((data: any) => {
                        refToast.current && toast.update(refToast.current, {
                            status: "error",
                            title: `Đăng ký thất bại`,
                            description: `${data.message}`
                        })

                })
                setIsFetching(false)
            })
            .catch((error) => {
                console.error(error)
                setIsFetching(false)

                refToast.current && toast.update(refToast.current, {
                    status: "error",
                    title: `Đăng ký thất bại`,
                })

            });
    }

    return (
        <div
            onMouseDown={(e) => {
                if ((e.target as HTMLElement).classList.contains('con-signup')) hideByCls('con-signup')
            }}
            className={` con-signup hidden`} style={{zIndex: 555}}>
            <div draggable={false}
                 className={`login bg-[${bg1}]  absolute top-10 left-2/4 -translate-x-2/4 
                 w-[370px] sm:w-[400px]  min-h-[745px] rounded-lg flex flex-col items-center gap-4 px-8 py-5`}>
                <div style={{color: red1}} className={`font-bold text-xl`}>ĐĂNG KÝ</div>

                <div className={`size-15 rounded-lg `} style={{border: "1px dashed white"}}>
                    <label htmlFor="singup-upload-avatar"
                           style={{color: bg2}}
                           className={` hover:opacity-80 cursor-pointer`}>
                        {!file ? <div className={`flex justify-center items-center w-full h-full pb-1`}>Avatar</div> :
                            <img className={`rounded-lg size-15`}
                                 src={(file && URL.createObjectURL(file)) || ""} alt=""/>}

                    </label>

                </div>

                <Input placeholder="Tên đăng nhập*" isInvalid={isErrorUserName} ref={refUserName} variant="custom1"
                       required={true}/>

                <Input placeholder="Họ tên*" isInvalid={isErrorName} ref={refName} variant="custom1" required={true}/>
                <Input placeholder="Email*" isInvalid={isErrorEmail} ref={refEmail} type={"email"} variant="custom1"
                       required={true}/>

                <FormControl isInvalid={isErrorPwd}>
                    <Input placeholder="Mật khẩu*" ref={refPwd} variant="custom1" type={'password'} required={true}/>
                    <Input className={`mt-4`} placeholder="Nhập lại mật khẩu*" ref={refConfirmPwd} variant="custom1"
                           type={'password'} required={true}/>
                    {isErrorPwd && <FormErrorMessage className={`ml-1`}>{msgErrorPwd}</FormErrorMessage>}
                </FormControl>

                <input ref={refPrice} placeholder={`Giá*`} type="number"
                       style={{border: `${isErrorPrice ? '1px solid red' : '1px transparent'} `}}
                       className={`bg-[${bg2}] text-white w-full h-[40px] rounded-[10px] pl-[16px] hover:border-white `}/>

                <div className={`my-r justify-between w-full `}>
                    <div className={`text-[rgba(255,255,255,.5)] text-[16px] pl-1`}>Ngày sinh*</div>
                    <input
                        ref={refDOB}
                        type="date"
                        style={{border: `${isErrorDOB ? '1px solid red' : '1px transparent'}`}}
                        className={`${clsInputDate} w-2/3 text-white`}/>
                </div>

                <div className={`my-r justify-between w-full `}>
                    <div className={`text-[rgba(255,255,255,.5)] text-[16px] pl-1`}>Giới tính*</div>
                    <div className={`w-2/3`}>
                        <Select
                            ref={refSex}
                            className={`cursor-pointer `}
                            defaultValue={"male"}
                            variant="customSelect1">
                            {SEX.map(i =>
                                <option key={`signup-sel-sex-${i.key}`} value={i.key}>{i?.name}</option>)}
                        </Select>
                    </div>
                </div>


                <div className={`my-r justify-between w-full `}>
                    <div className={`text-[rgba(255,255,255,.5)] text-[16px] pl-1`}>Vị trí*</div>
                    <div className={`w-2/3`}>
                        <Select
                            ref={refLocation}
                            className={`cursor-pointer `}
                            defaultValue={"Hà Nội"}
                            variant="customSelect1">
                            {PROVINCES.map(i =>
                                <option key={`signup-loc-${i.key}`} value={i.key}>{i?.name}</option>)}
                        </Select>
                    </div>
                </div>
                <input
                    id={`singup-upload-avatar`}
                    type="file" style={{display: "none"}}
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target && e.target.files) setFile(e.target.files[0])
                    }}/>

                <ReCAPTCHA
                    sitekey="6LfRF3AqAAAAAKqgl-K-_P8mPtOrN-NwyYNqsVce"
                    onChange={() => {setIsOkCapt(true)}}
                    onErrored={() => {setIsOkCapt(false)}}
                    onExpired={() => {setIsOkCapt(false)}}
                />
                <CusButton clsButton={`mt-2 bg-[${red1}]  w-full h-[35px]`} name={"Đăng ký tài khoản"}
                           clsText={' text-sm'} isDisable={!isOkCapt}
                           onClick={() => {

                               if (isFetching || !isOkCapt) return
                               const email = getValBRef(refEmail) || ""
                               let cError = false
                               const errorMsgPwd = isValidPwd()

                               setIsErrorPwd(false)
                               setIsErrorEmail(false)
                               setIsErrorUserName(false)
                               setIsErrorName(false)
                               setIsErrorDOB(false)
                               setIsErrorPrice(false)

                               if (!getValBRef(refUserName)?.length) {
                                   setIsErrorUserName(true)
                                   cError = true
                               } else if (!getValBRef(refName)?.length) {
                                   setIsErrorName(true)
                                   cError = true
                               } else if (!isValidateEmail(email)) {
                                   setIsErrorEmail(true)
                                   cError = true
                               } else if (errorMsgPwd.length) {
                                   setIsErrorPwd(true)
                                   setMsgErrorPwd(errorMsgPwd)
                                   cError = true
                               } else if (!getValBRef(refPrice)?.length) {

                                   setIsErrorPrice(true)
                                   cError = true
                               } else if (!getValBRef(refDOB)?.length) {
                                   setIsErrorDOB(true)
                                   cError = true
                               }

                               if (cError) return
                               if(!file) {
                                   toast({title: "Avatar không được trống!", status:"error", isClosable:true})
                                   return;
                               }

                               const url = `email=${email}&password=${getValBRef(refPwd)}&name=${getValBRef(refName)}&username=${getValBRef(refUserName)}&birthday=${getValBRef(refDOB)}&sex=${getValBRef(refSex)}&location=${getValBRef(refLocation)}&price=${getValBRef(refPrice)}`

                               // const obj = JSON.parse(JSON.stringify(objSignUp))
                               // obj.username = refUserName.current && refUserName.current.value || ""
                               // obj.email = email
                               // obj.password = refPwd.current && refPwd.current.value || ""

                               setIsFetching(true)
                               fetchURL(url)

                           }}/>
                <div className={`underline my-btn text-white text-sm mt-8`}
                     onClick={() => {
                         hideByCls('con-signup')
                         visibleByCls('con-login', con1)
                     }}
                >Đăng Nhập
                </div>

            </div>
        </div>
    );
};