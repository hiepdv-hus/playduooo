// @flow
import {Link, useLocation, useNavigate} from "react-router-dom";
import IconHomeUnActive from "../../images/navbar/icon-home-unactive.png";
import IconHomeActive from "../../images/navbar/icon-home-active.png";
import IconStoiesUnActive from "../../images/navbar/icon-story-unactive.png";
import IconStoiesActive from "../../images/navbar/icon-story-active.png";
import IconBXHStrUnActive from "../../images/navbar/icon-bxhstories-unactive.png";
// import IconTH from "../../images/navbar/icon-th.png";
import IconProfileUnActive from "../../images/navbar/icon-profile-unactive.png";
import IconProfileActive from "../../images/navbar/icon-profile-active.png";
// import IconFB from "../../images/navbar/icon-fb.png";
import IconLogin from "../../images/icon/icon-login.svg"
import IconLogout from "../../images/icon/icon-logout.svg"
import React, {useEffect, useState} from "react";
import {bg5, con1, red1} from "../../common/utils/Styles.tsx";
import Login from "../../pages/Login";
import {hideByCls, visibleByCls} from "../VisibleControl.tsx";
import Signup from "../../pages/Signup";
import Rank from "../../pages/Stories/Rank.tsx";
import {useRecoilState} from "recoil";
import {currentUserState, isAdminState, isLoginState} from "../../hooks/store.ts";
import {jwtDecode} from "jwt-decode";
import {useCookies} from "react-cookie";
import moment from "moment-timezone"
import {useToast} from "@chakra-ui/react";
import {BASE_URL, commonHeaders, getStaticFile} from "../../common/utils/useReq.ts";
import {ILogin} from "../../pages/Login/Login.tsx";
import {AddGamesToUser} from "./AddGamesToUser.tsx";
import {IUser} from "../../pages/PlayerDetail/PlayerDetail.tsx";
import useSWR from "swr";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMessage, faRectangleList, faUserShield, faWallet} from "@fortawesome/free-solid-svg-icons";
import {formatCurrency} from "../../common/utils/utils.ts";
import logoP from '../../images/home/logoP.svg'


interface IItemNav {
    unActiveIcon: string
    activeIcon: string
    to: string
    txt: string
    idx: number
}

interface IDemoIcon {
    icon: string
    txt: string
    cls?: string

}

export const Divider = () => {
    return (
        <div className="bg-[#646464] h-[2px] rounded-[5px] w-[24px] my-[5px] mx-3"/>
    )
}

export default function MainMenuNav() {
    const [curIdx, setCurIdx] = useState(0)
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
    const [cookies, setCookie, rmCookie] = useCookies(['refreshToken']);
    const [isLogin, setIsLogin] = useRecoilState(isLoginState)
    const location = useLocation();
    const {pathname} = location;
    const toast = useToast()
    const navi = useNavigate()
    const [isAdmin, setIsAdmin] = useRecoilState<boolean>(isAdminState)

    const {data: userData} = useSWR(currentUser?.info?.id ? [`/users/user_id?user_id=${currentUser?.info?.id}`, {}, {method: 'PATCH'}]: null)

    useEffect(() => {
        const roles = (userData?.data[currentUser?.info?.id] as IUser)?.roles || []
        let isAd = false

        if(roles?.length){
            for(const i of roles){
                if (i.name === "Admin"){
                    isAd = true
                    break
                }
            }
        }
        setIsAdmin(isAd)
    }, [userData])

    useEffect(() => {
        if (currentUser && currentUser.accessToken && currentUser.accessToken.length) {
            const decode = jwtDecode(currentUser.accessToken);
            if (decode && decode.exp) {
                setIsLogin(true)

                const timeout = setTimeout(() => {
                    fetch(`${BASE_URL}/user/refresh-token?email=${currentUser?.info?.email || ''}`, {
                        method: "POST",
                        headers: commonHeaders,
                        body: JSON.stringify({
                            "refresh_token": `${cookies['refreshToken'] || ''}`
                        }),
                    })
                        .then((resp) => {
                            if (resp.status == 200) {
                                resp.json().then((data: ILogin) => {
                                    try {
                                        setCurrentUser((cur: any) => {
                                            return {
                                                ...cur,
                                                accessToken: data.data.token.access_token
                                            }
                                        })
                                        setCookie('refreshToken', data.data.token.refresh_token, {
                                            path: '/',
                                            // httpOnly: true,
                                            secure: false,
                                            // sameSite: "strict"
                                        })
                                    } catch (e) {
                                        setCurrentUser({})
                                        rmCookie('refreshToken')
                                    }
                                })
                                return
                            }

                            resp.json().then(_ => {
                                setCurrentUser({})
                                rmCookie('refreshToken')
                            })

                        })
                        .catch((_) => {
                                setCurrentUser({})
                                rmCookie('refreshToken')
                            }
                        )
                }, (decode.exp - moment().utc().unix()) * 1000 || 1000)
                return () => clearTimeout(timeout);
            }


            return
        }
        setIsLogin(false)

    }, [currentUser])

    useEffect(() => {
        pathname == '/' && setCurIdx(0)
        pathname.includes('/stories') && setCurIdx(1)

    }, [pathname])

    const NavItem = ({unActiveIcon, activeIcon, idx, to, txt}: IItemNav) => {
        return (
            <Link
                data-tooltip-id="my-main-menu-nav"
                data-tooltip-content={txt}
                to={to}
                onClick={() => {
                    // setCurIdx(idx)
                    hideByCls('main-menu-nav')
                    // navigate(to)
                    // routerHistory.push(to)
                }}
            >
                <div className={`my-r gap-10`}>
                    <div
                        style={{background: bg5}}
                        className="my-1 select-none  w-[45px] h-[45px] flex justify-center items-center rounded-[50%] p-3">
                        <img draggable={false}
                             alt={''}
                             className='select-none'
                             src={curIdx == idx ? activeIcon : unActiveIcon}/>
                             {/*src={(pathname == "/" && curIdx == 0) || (pathname.includes(to)) ? activeIcon : unActiveIcon}/>*/}
                    </div>

                    <div className='text-white text-sm block md:hidden'>
                        {txt}
                    </div>
                </div>
            </Link>
        )
    }

    const RankBtn = () => {
        return (
            <div
                data-tooltip-id="my-main-menu-nav"
                data-tooltip-content="Bảng xếp hạng"
                className='my-1 cursor-pointer select-none my-r gap-10'
                onClick={() => {
                    // setIsOpen && setIsOpen(false)
                    visibleByCls('rankstr', `${con1}`)

                }}>
                <div
                    style={{background: bg5}}

                    className="  w-[45px] h-[45px] flex justify-center items-center rounded-[50%] p-3">

                    <img draggable={false}
                         alt={''}
                         src={IconBXHStrUnActive}/>
                </div>
                <div className='text-white text-sm block md:hidden'>Bảng xếp hạng</div>
            </div>
        )
    }

    return (
        <div className='' draggable={false}>
            {/*<NavItem*/}
            {/*    to={'/'}*/}
            {/*    unActiveIcon={IconHomeUnActive}*/}
            {/*    activeIcon={IconHomeActive}*/}
            {/*    idx={0}*/}
            {/*    txt={'Trang chủ'}*/}
            {/*/>*/}

            <a
                href={'/'}
                data-tooltip-id="my-main-menu-nav"
                data-tooltip-content={"Trang chủ"}
                className={`my-r gap-10 hover:opacity-80`}>
                <div
                    draggable={false}
                    className="my-2 select-none bg-[#ececec] w-[45px] h-[45px] flex justify-center items-center rounded-[50%] p-0.5">
                    {/* <div className={`font-bold`} style={{fontSize: 24, color:bg5}} >PD</div> */}
                    <img src={logoP} alt=""/>
                </div>
                <div className='text-white  text-sm block md:hidden'>
                    Trang chủ
                </div>
            </a>

            <NavItem
                to={'/stories'}
                idx={1}
                unActiveIcon={IconStoiesUnActive}
                activeIcon={IconStoiesActive}
                txt={'Stories'}
            />

            <RankBtn/>

            <Divider/>
            {/*<DemoIcon icon={IconTH} cls={' md:block hidden'} txt={''}/>*/}

            {/* term */}
            {isLogin &&
                <Link
                    data-tooltip-id="my-main-menu-nav"
                    data-tooltip-content={"Điều khoản sử dụng"}

                    to={'/'}
                    className={`my-r gap-10 hover:opacity-80`}>
                    <div
                        style={{background: bg5}}
                        className={`my-2 select-none w-[45px] h-[45px] flex justify-center items-center rounded-[50%] p-0.5`}>
                        <FontAwesomeIcon icon={faRectangleList} style={{fontSize: 22, color:"white"}} />

                    </div>
                    <div className='text-white text-sm block md:hidden'>
                        Điều khoản sử dụng
                    </div>
                </Link>
            }

            {/* secu... */}
            {isLogin &&
                <Link
                    data-tooltip-id="my-main-menu-nav"
                    data-tooltip-content={"Chính sách bảo mật"}
                    to={'/'}
                    className={`my-r gap-10 hover:opacity-80`}>
                    <div
                        style={{background: bg5}}
                        className={`my-2 select-none w-[45px] h-[45px] flex justify-center items-center rounded-[50%] p-0.5`}>
                        <FontAwesomeIcon icon={faUserShield} style={{fontSize: 21, color:"white"}} />

                    </div>
                    <div className='text-white text-sm block md:hidden'>
                        Chính sách bảo mật
                    </div>
                </Link>
            }

            {isLogin &&
                <div
                    data-tooltip-id="my-main-menu-nav"
                    data-tooltip-content={"Số dư"}
                    className={`my-r gap-10 hover:opacity-80`}>
                    <div
                        style={{background: bg5}}
                        className={`my-2 select-none w-[45px] justify-center items-center md:w-[90px] h-[45px] flex flex-col rounded-full md:rounded-lg p-0.5`}>
                        <div className={``}>
                            <FontAwesomeIcon icon={faWallet} style={{fontSize: 18, color: "white"}}/>
                        </div>
                        <div className='text-white text-xs md:block hidden w-max'>
                            {formatCurrency((userData?.data[currentUser?.info?.id] as IUser)?.balance || 0)}
                        </div>
                    </div>
                    <div className='text-white text-sm block md:hidden'>
                        {(userData?.data[currentUser?.info?.id] as IUser)?.balance || 0}
                    </div>
                </div>
            }

            {/* msg */}

            {isLogin &&
                <Link
                    data-tooltip-id="my-main-menu-nav"
                    data-tooltip-content={"Tin nhắn"}
                    to={'/'}
                    className={`my-r gap-10 hover:opacity-80`}>
                    <div
                        style={{background: bg5}}
                        className={`my-2 select-none w-[45px] h-[45px] flex justify-center items-center rounded-[50%] p-0.5`}>
                        <FontAwesomeIcon icon={faMessage} style={{fontSize: 18, color: "white"}}/>

                    </div>
                    <div className='text-white text-sm block md:hidden'>
                        Tin nhắn
                    </div>
                </Link>
            }

            {/* Info */}
            {isLogin &&
                <Link
                    data-tooltip-id="my-main-menu-nav"
                    data-tooltip-content={"Cá nhân"}

                    to={(!currentUser.info || !currentUser.accessToken) ? "/" : '/info'}
                    className={`my-r gap-10 hover:opacity-80`}>
                    <div

                        className="my-2 select-none bg-white w-[45px] h-[45px] flex justify-center items-center rounded-[50%] p-0.5">
                        <img draggable={false}
                             alt={''}
                             className='select-none rounded-[50%]'
                             src={getStaticFile((userData?.data[currentUser?.info?.id] as IUser)?.avatar)}/>
                        {/*src={(pathname == "/" && curIdx == 0) || (pathname.includes(to)) ? activeIcon : unActiveIcon}/>*/}
                    </div>
                    <div className='text-white text-sm block md:hidden'>
                        Cá nhân
                    </div>
                </Link>
            }

            {isLogin && <AddGamesToUser/>}


            {/*logout*/}
            {isLogin ?
                <div className='my-r gap-10 cursor-pointer select-none'
                     onClick={() => {
                         setCurrentUser({})
                         toast({
                             status: "success",
                             title: `Đăng xuất thành công.`,
                         })
                         navi('/')

                     }}>
                    <div data-tooltip-id="my-main-menu-nav"
                         data-tooltip-content="Đăng Xuất"
                         style={{background: bg5}}

                         className={`my-btn size-[45px] rounded-[50%] my-2 p-2`}>
                        <img src={IconLogout} alt="Login"/>
                    </div>
                    <div className='text-white text-sm block md:hidden'>
                        Đăng xuất
                    </div>
                </div>

                :

                <div className='my-r gap-10 cursor-pointer select-none'
                     onClick={() => {
                         visibleByCls("con-login", con1)
                     }}>
                    <div data-tooltip-id="my-main-menu-nav"
                         data-tooltip-content="Đăng nhập"
                         style={{background: bg5}}
                         className={`my-btn size-[45px]  rounded-[50%] my-2 p-2`}>
                        <img src={IconLogin} alt="Login"/>
                    </div>
                    <div className='text-white text-sm block md:hidden'>
                        Đăng nhập
                    </div>
                </div>
            }



            < Rank/>
            < Login/>
            < Signup/>
        </div>

    );
};