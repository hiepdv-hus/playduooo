// @flow

import {CSSProperties} from "react";

type Props = {
    cls: CSSProperties
};
export const CusDivider = (props: Props) => {
    return (
        <div className={`w-full h-[.1px] my-5`} style={{background: 'rgba(127, 127, 127, .5)' ,...props.cls}}/>
    );
};