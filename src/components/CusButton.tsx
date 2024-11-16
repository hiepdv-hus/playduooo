// @flow

import {ReactNode, useEffect, useState} from "react";

type Props = {
    clsButton: string
    icon?: string
    fIcon?: ReactNode
    name: string
    clsText: string
    clsIcon?: string
    onClick: () => void
    isDisable?: boolean
};

export function CusButton(props: Props) {
    const [stateBtn, setStateBtn] = useState("")
    useEffect(() => {
        if(props.isDisable) setStateBtn("cursor-not-allowed")
        else setStateBtn("cursor-pointer hover:opacity-80")

    }, [props.isDisable])

    return (
        <div className={`rounded-[8px] gap-0.5 flex ${stateBtn}  justify-center items-center select-none text-white ${props.clsButton}`}
             onClick={props.onClick}>
            {props.icon && <img src={props.icon} className={`w-6 ${props.clsIcon}`} alt=""/>}
            {props.fIcon && props.fIcon}

            <div className={`${props.clsText}`}>
                {props.name}
            </div>

        </div>
    );
}