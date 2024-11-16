// @flow
import * as React from 'react';
import {bg1, con1, red1} from "../../common/utils/Styles.tsx";
import {CusButton} from "../../components/CusButton.tsx";
import {ComponentState, useState} from "react";

interface IDDetail{
    isOpen: ComponentState
    setIsOpen: ComponentState
}

const DuoDetail = ({isOpen, setIsOpen}: IDDetail) => {
    return (
        <div>
            {isOpen &&
                <div id={'duodetail'}
                     onClick={(e) => {
                         if ((e.target as HTMLElement).id == 'duodetail') setIsOpen(false)
                     }}
                     className={con1}>
                    <div
                        className={`bg-[${bg1}] absolute rounded-lg w-[470px] p-10 h-[420px] md:w-[550px] md:h-max md:max-h-[500px] xl:w-[600px] xl:h-[450px] top-15 left-2/4 -translate-x-2/4`}>
                        <div className={`text-[${red1}] text-title-md font-bold text-center`}>
                            Thông tin playduo
                        </div>

                        <div className='my-r justify-between h-10 text-white mt-5'
                             style={{borderBottom: "1px solid #38383a"}}>
                            <div className='font-bold text-md'>Họ và tên:</div>
                            <div>Abc</div>
                        </div>
                        <div className='my-r justify-between h-10 text-white mt-3'
                             style={{borderBottom: "1px solid #38383a"}}>
                            <div className='font-bold text-md'>Tuổi:</div>
                            <div>19</div>
                        </div>
                        <div className='my-r justify-between h-10 text-white mt-3'
                             style={{borderBottom: "1px solid #38383a"}}>
                            <div className='font-bold text-md'>Username:</div>
                            <div>Messi</div>
                        </div>
                        <div className='my-r justify-between h-10 text-white mt-3'
                             style={{borderBottom: "1px solid #38383a"}}>
                            <div className='font-bold text-md'>Số dư:</div>
                            <div>1.000.000đ</div>
                        </div>
                        <div className='my-r justify-between h-10 text-white mt-3'>
                            <div className='font-bold text-md'>Cấp bậc:</div>
                            <select id=""
                                    className="cursor-pointer bg-[#3c3c3c] text-[#b0b0b0] h-8 text-sm rounded-lg focus:outline-none w-1/3 p-1 outline-none dark:text-white">
                                <option selected>A</option>
                                <option value="2h">B</option>
                                <option value="3h">C</option>

                            </select></div>

                        <div className='my-r gap-3 justify-end mt-8'>
                            <CusButton clsButton={`bg-[${red1}] px-4 py-1`} name={'Lưu'} clsText={``} onClick={() => {
                            }}/>
                            <CusButton clsButton={`bg-[#3c3c3c] px-4 py-1`} name={'Hủy'} clsText={``} onClick={() => {
                                setIsOpen(false)
                            }}/>

                        </div>
                    </div>
                </div>}
        </div>

    )
}

export function Admin() {
    const [isOpenInfo, setIsOpenInfo] = useState(false)
    return (
        <div className={`bg-[${bg1}] rounded-lg p-8 w-[500px] h-full`}>
            <div className={`text-[${red1}] font-bold text-title-xl text-center`}>
                Admin
            </div>
            <div className='text-white font-bold text-xl my-5'>
                Danh sách Playduo
            </div>

            <div>
                {[...Array(10).keys()].map(_ =>
                    <div className='my-r justify-between h-15 mb-3' style={{borderBottom: "1px solid #38383a"}}>
                        <div className='my-r gap-2 cursor-pointer'
                            onClick={() => {setIsOpenInfo(true)}}>
                            <div className='rounded-[50%] bg-[#d4d4d4] size-10'/>
                            <div className='text-white text-sm'>Ronaldo</div>
                        </div>
                        <div>
                            <CusButton clsButton={`bg-[${red1}] py-1 px-4`} name={'Xem thêm'} clsText={''}
                                       onClick={() => {
                                           setIsOpenInfo(true)
                                       }}/>
                        </div>
                    </div>)}
            </div>

            <DuoDetail isOpen={isOpenInfo} setIsOpen={setIsOpenInfo}/>
        </div>
    );
}