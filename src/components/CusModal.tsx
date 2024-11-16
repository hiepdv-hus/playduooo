import React, {ChangeEvent, ComponentState, ReactNode, SetStateAction} from "react";
import CloseBtn from "../images/icon/icon-close.svg";
import {CusDivider} from "./CusDivider.tsx";
import {red1} from "../common/utils/Styles.tsx";

interface IProps {
    title: string,
    children: ReactNode,
    okTxt: string,
    isDisableOK?: boolean,
    closeTxt: string,
    isOpen: ComponentState,
    setIsOpen: ComponentState,
    onClickOk?: () => void,
}
export const CusModal  = ({ children, title, okTxt, closeTxt, isOpen, setIsOpen, onClickOk, isDisableOK }:IProps) => {

    return (
        <div>
            {isOpen &&
                <div id={'cusmodel'}
                     onClick={(e) => {
                         if((e.target as HTMLElement).id == 'cusmodel') setIsOpen(false)
                     }}
                     className='fixed left-0 top-0 w-full h-full bg-[rgba(0,0,0,.7)] overflow-y-auto'>
                    <div
                        className='bg-[#1d1d1f] absolute flex flex-col justify-between rounded-[10px] w-[450px] md:w-[600px] min-h-[300px] max-h-[600px] md:h-max md:max-h-[700px] top-15 left-2/4 -translate-x-2/4'>
                        <div className='relative h-12'>
                            <div
                                style={{color: red1}}
                                className='absolute left-2/4 top-2/4 font-extrabold text-title-sm -translate-x-2/4 -translate-y-2/4'>{title}</div>

                            <img
                                className={`cursor-pointer absolute select-none w-6 right-2  top-2/4 hover:opacity-80  -translate-y-2/4`}
                                style={{zIndex: 10}}
                                onClick={() => {setIsOpen(false)}}
                                src={CloseBtn} alt=""/>

                            <div className={'absolute bottom-0 left-0  h-5 w-full'}>
                                <CusDivider cls={{opacity: .5}}/>
                            </div>
                        </div>
                        <div className=' overflow-auto '>
                            {children}
                        </div>
                        <div>
                            <CusDivider cls={{opacity: .5}}/>
                            <div className='my-r justify-end gap-2 -mt-2 mb-2 mr-4'>
                                {!isDisableOK && <div
                                    onClick={onClickOk}
                                    className='cursor-pointer bg-[#e05844] text-white flex hover:opacity-80 justify-center items-center px-5 py-1 rounded-[6px]'>
                                    <div>{okTxt}</div>
                                </div>}
                                <div
                                    onClick={() => {
                                        setIsOpen(false)
                                    }}
                                    className='cursor-pointer bg-white text-[#4e4e50] flex justify-center hover:opacity-80 items-center px-5 py-1 rounded-[6px]'>
                                    <div>{closeTxt}</div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>}
        </div>
    );
};