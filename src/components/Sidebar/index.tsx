import { useLocation} from 'react-router-dom';
import AddStr from "../../images/navbar/add-str.png";
import MainMenuNav, {Divider} from "./MainMenuNav.tsx";
import {bg3, con1, red1} from "../../common/utils/Styles.tsx";
import {TrendingStories} from "./TrendingStories.tsx";
import {Tooltip} from "react-tooltip";
import {ListGame} from "./ListGame.tsx";
import {useRecoilState} from "recoil";
import {isLoginState} from "../../hooks/store.ts";
import {visibleByCls} from "../VisibleControl.tsx";


const Sidebar = () => {
    const location = useLocation();
    const {pathname} = location;
    const [isLogin, _] = useRecoilState(isLoginState)

    return (
        <aside
            id={`nav-v-bar`}
            style={{backgroundColor: '#fff'}}
            // ref={sidebar}
            className={`left-0 top-0 overflow-auto z-123 flex-col  hidden md:block  ${pathname.includes("/stories") ? 'min-w-[120px] max-w-[120px]' : 'min-w-[90px] max-w-[90px]'}`}
        >
            <div
                className="pb-10 no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear pt-5 px-[12px] ">
                {/* <!-- Sidebar Menu --> */}
                <nav className="">
                    {/* <!-- Menu Group --> */}
                    <MainMenuNav key={'mainNavSidebar'}/>
                    <Divider/>
                    {pathname === '/' && <div className=''>
                        <div className={`pb-20`}>
                            <ListGame/>
                        </div>
                    </div>}
                    {/*<Divider/>*/}
                    {pathname.includes("/stories") &&
                        <div>
                            {isLogin &&
                                <div className=' my-r my-3 gap-2 cursor-pointer select-none'
                                onClick={() => {visibleByCls('con-upload-str', con1)}}>
                                    <img src={AddStr} alt="" className='w-8 hover:opacity-80'/>
                                    <div className="text-white hover:text-[#e05844] text-sm">Đăng tin của bạn</div>
                                </div>}

                            <div className='mt-5 font-bold text-white'>
                                Thịnh hành
                            </div>
                            <TrendingStories/>
                        </div>
                    }
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
            <Tooltip id="my-main-menu-nav"
                     style={{ backgroundColor: red1, color: "white", zIndex:99999 }}/>
        </aside>
    );
};

export default Sidebar;
