import React, {ChangeEvent, useRef, useState} from 'react';
import {bg1, bg2, con1, red1} from "../../common/utils/Styles.tsx";
import {Input, Select, ToastId, useToast} from "@chakra-ui/react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUpload} from '@fortawesome/free-solid-svg-icons'
import {CusButton} from "../../components/CusButton.tsx";
import {randomStr} from "../../common/utils/utils.ts";
import {hideByCls} from "../../components/VisibleControl.tsx";
import {BASE_URL} from "../../common/utils/useReq.ts";
import {useRecoilState} from "recoil";
import {currentUserState} from "../../hooks/store.ts";

function UploadStories() {

    const [isErrorTitle, setIsErrorTitle] = useState(false)
    const [isErrorStatus, setIsErrorStatus] = useState(false)
    const [isErrorFile, setIsErrorFile] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [formData, setFormDate] = useState<FormData>()
    const [dataFetch, setDataFetch] = useState({
        status: "",
        title: ""
    })
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
    const refTitle = useRef<HTMLInputElement>(null)
    const refFileName = useRef<HTMLInputElement>(null)
    const refStatus = useRef<HTMLSelectElement>(null)
    const [file, setFile] = useState<File>()

    const refToast = useRef<ToastId>()
    const toast = useToast()

    const notiError = () => {
        refToast.current && toast.update(refToast.current, {
            status: "error",
            title: `Đăng tin thất bại`,
            isClosable: true
        })
    }


    const onOk = () => {
        if (isFetching) return

        setIsErrorTitle(false)
        setIsErrorStatus(false)
        setIsErrorFile(false)

        const title = refTitle.current && refTitle.current.value.trim() || ""
        const status = refStatus.current && refStatus.current.value.trim() || ""

        if(!title.length) {
            setIsErrorTitle(true)
            return
        }
        if(!status.length) {
            setIsErrorStatus(true)
            return;
        }
        if(!file) {
            setIsErrorFile(true)
            return
        }

        setIsFetching(true)
        refToast.current = toast({
            status: "loading",
            title: `Đang tạo tin của bạn...`,
            duration: 30000
        })

        const formdata = new FormData();
        const f = file.name.split(".")
        formdata.append("file", file, `${randomStr()}.${f[f.length - 1]}`);

        fetch(`${BASE_URL}/stories?title=${title}&content=${title}&status=${status}`,
            {
                method: "POST",
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
                                title: `Đăng tin thành công`,
                                isClosable: true
                            })

                        } catch (e) {
                            notiError()
                        }
                    })
                    hideByCls('con-upload-str')
                    setIsFetching(false)
                    return
                } //end IF

                notiError()
                setIsFetching(false)
                return
            })

            .catch((_) =>  {
                notiError()
                setIsFetching(false)
                hideByCls('con-upload-str')
            });
    }

    return (
        <div className={`con-upload-str hidden`}
             onMouseDown={(e) => {
                 if ((e.target as HTMLElement).classList.contains('con-upload-str')) hideByCls('con-upload-str')
             }}
             style={{zIndex: 5}}>
            <div
                className={`bg-[${bg1}] absolute top-15 left-2/4 -translate-x-2/4 w-[400px] h-[500px] rounded-lg flex flex-col items-center gap-4 p-8`}>
                <div className={`mt-5 text-title-md font-bold mb-10`} style={{color: red1}}>Tạo Story</div>

                <Input isInvalid={isErrorTitle}
                       ref={refTitle}
                       placeholder="Tiêu đề story"
                       variant="custom1"
                       required={true}/>
                <Select
                    ref={refStatus}
                    className={`cursor-pointer`}
                    isInvalid={isErrorStatus}
                    defaultValue={'public'}
                    placeholder='Trạng thái' variant="customSelect1">
                    <option value='public'>Công khai</option>
                    <option value='private'>Riêng tư</option>
                </Select>

                <div className={`w-full h-[40px] rounded-[10px] bg-[${bg2}] my-r justify-between`}
                style={{border: isErrorFile && '1px solid red'}}>
                    <div ref={refFileName} className={`text-white pl-[16px] select-none`}>...</div>
                    <label htmlFor="upload-vid-str"
                           style={{color: bg2}}
                           className={`rounded-[10px] px-2 py-1 h-full bg-white flex justify-center items-center hover:opacity-80 gap-2 cursor-pointer`}>
                        <FontAwesomeIcon

                            icon={faUpload}/>Upload</label>
                    <input
                        id={`upload-vid-str`}
                        type="file" style={{display: "none"}}
                           accept="video/mp4,video/x-m4v,video/*"
                           onChange={(e: ChangeEvent<HTMLInputElement>) => {
                               if (refFileName.current) {
                                   if (e.target && e.target.files) {
                                       setFile(e.target.files[0])
                                       refFileName.current.innerHTML = e.target.files[0].name
                                   }
                               }
                           }}/>
                </div>

                <CusButton clsButton={`bg-[${red1}] h-[40px] w-full mt-10`} name={`OK`} clsText={``} onClick={onOk}/>

            </div>
        </div>
    );
}

export default UploadStories