// @flow

import {bg1, con1} from "../../common/utils/Styles.tsx";
import IconTH from '../../images/navbar/icon-th.png'
import MainMenuNav from "../Sidebar/MainMenuNav.tsx";
import {useState} from "react";
import Login from "../../pages/Login";
import Signup from "../../pages/Signup";
import Rank from "../../pages/Stories/Rank.tsx";
import {hideByCls, visibleByCls} from "../VisibleControl.tsx";


export function Header() {
    return (
        <div
            style={{zIndex: 10}}
            className={`h-10 w-full bg-[${bg1}] my-r  justify-between p-2 md:hidden fixed top-0 left-0 select-none`}>
            <div className='flex flex-col gap-1.5 size-8 items-center justify-center cursor-pointer'
                 onClick={() => {
                     visibleByCls('main-menu-nav', con1)
                 }}>
                {[...Array(3).keys()].map((_, ii) =>
                    <div key={`hh-${ii}`} className='w-full h-1 bg-[#595959] rounded-lg'/>)}
            </div>

            {/*<div>*/}
            {/*    <img draggable={false}*/}
            {/*         alt={''}*/}
            {/*         className='size-8 cursor-pointer'*/}
            {/*         src={IconTH}/>*/}
            {/*</div>*/}


            <div id={'mainmenunav'}
                 onClick={(e) => {
                     if ((e.target as HTMLElement).id == 'mainmenunav') hideByCls('main-menu-nav')
                 }}
                 className='main-menu-nav hidden' style={{zIndex: 2000}}>
                <div className='absolute left-3 top-3 w-max h-max p-3 pr-30 bg-[#101010] rounded-md' style={{zIndex: 2000}}>
                    <MainMenuNav key={'mainNavHeader'}/>
                </div>

                < Rank/>

            </div>


        </div>
    );
}