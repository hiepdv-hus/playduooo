import {useLocation, useNavigate, useParams} from "react-router-dom";
import AvaPlayer from '../../images/player/ava-player.png'
import Vote from '../../images/player/vote.png'
import Chat1 from '../../images/icon/icon-chat-1.svg'
import Love1 from '../../images/icon/icon-love-1.svg'
import Checked from '../../images/icon/icon-checked.svg'
import Mic1 from '../../images/icon/icon-mic-1.svg'
import {CusButton} from "../../components/CusButton.tsx";

import Game1 from "../../images/navbar/games/game1.png";
import Game2 from "../../images/navbar/games/game2.png";
import Game3 from "../../images/navbar/games/game3.png";
import Game4 from "../../images/navbar/games/game4.png";
import Star from "../../images/icon/icon-star.svg";
import {CusDivider} from "../../components/CusDivider.tsx";
import {CusModal} from "../../components/CusModal.tsx";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {BASE_URL, commonHeaders, myFetch} from "../../common/utils/useReq.ts";
import {gray1} from "../../common/utils/Styles.tsx";
import {formatCurrency} from "../../common/utils/utils.ts";
import {useRecoilState} from "recoil";
import {currentUserState, isLoginState, selUserState} from "../../hooks/store.ts";
import HireUser from "../../components/Users/HireUser.tsx";
import DonateUser from "../../components/Users/DonateUser.tsx";
import {Textarea} from "@chakra-ui/react";
import {hideByCls} from "../../components/VisibleControl.tsx";


export interface IUser {
    id: string
    name: string
    location: null | string;
    balance?: number | string | null;
    completion_rate: any | null;
    username: string
    price?: string | number | null;
    avatar: string
    email: string
    birthday: string
    sex: string
    roles?: {
        id: string
        name: string
    }[]
    games?: {
        id: string;
        title?: string;
        name?: string;
        description?: string;
        genre?:       string;
        thumbnail?:   string;
    }[];

}

export const PlayerDetail = () => {
    const navi = useNavigate()
    const {pathname} = useLocation();
    const [currentUser] = useRecoilState(currentUserState)

    // const {id} = useParams();
    const [isOpenHire, setIsOpenHire] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [isFollowed, setIsFollowed] = useState(false)
    const [isOpenDonate, setIsOpenDonate] = useState(false)
    const [isOpenMsg, setIsOpenMsg] = useState(false)
    const [isLogin, _] = useRecoilState(isLoginState)
    const [selUser, setSelUser] = useRecoilState(selUserState)

    const idUser = pathname.split('/')[2]

    const {
        data: dataUser,
        error: errDataUser
    } = useSWR([`/users/user_id?user_id=${idUser}`, {}, {method: 'PATCH'}], myFetch)

    if (errDataUser) navi("/")

    let dtUser
    try {
        dtUser = dataUser?.data[idUser] as IUser

    } catch (e) {
        navi("/")
    }

    useEffect(() => {
        document.getElementsByClassName("player-detail")[0]?.scrollIntoView()
    }, [pathname]);

    const isMine = () => {
        return currentUser && dataUser && currentUser?.info?.id == idUser
    }

    const onFollow = () => {
        if (isFetching) return
        setIsFetching(true)
        setIsFollowed(true)

        fetch(`${BASE_URL}/followers`,
            {
                method: "POST",
                headers: {
                    ...commonHeaders,
                    Authorization: `Bearer ${currentUser.accessToken}`,
                },
                body: JSON.stringify({follower_id: idUser, following_id: currentUser?.info?.id})
            })
            .then((resp) => {
                if (resp.status != 200) {
                    setIsFollowed(false)
                    setIsFetching(false)
                    return
                } //end IF
                setIsFetching(false)
                return
            })
    }

    useEffect(() => {
        if (dataUser) {
            setSelUser(dataUser?.data[idUser] as IUser || {})
        }
    }, [dataUser])

    return (
        <div className='player-detail bg-[#1f1f22] min-h-screen h-full p-5 md:p-10'>
            <div className='flex md:flex-row flex-col md:gap-5'>
                {/*    div 1   */}
                <div className='md:w-[20%] flex flex-col items-center gap-3 '>
                    <div className={`size-50 `}>
                        <img src={`${BASE_URL}/file/path?path=${dtUser?.avatar}`} className={`rounded-lg size-50`}
                             alt=""/>
                    </div>
                    <div className='my-r mt-3'>
                        <div className='text-[#989898] text-sm font-thin'>Ngày tham gia:</div>
                        <div className='text-white text-sm'>...</div>
                    </div>
                    <div
                        className='text-[#de6152] text-title-md sm:text-title-sm lg:text-title-md xl:text-title-lg font-bold'>
                        {dtUser?.price && formatCurrency(dtUser?.price) || 0} đ/h
                    </div>
                    {/*<img src={Vote} className='w-50 -mt-1' alt=""/>*/}
                    <div className={``} style={{color: gray1}}>{dtUser?.completion_rate || 0} Đánh giá</div>

                    {!isMine() && isLogin && <div className={`w-full flex flex-col gap-3`}>
                        <CusButton clsButton={'bg-[#de6152] w-full h-12'} name={'THUÊ'} clsText={'text-white w'}
                                   onClick={() => setIsOpenHire(true)}/>
                        <CusButton clsButton={'bg-white w-full h-12'} name={'DONATE'} clsText={'text-[#374050]'}
                                   onClick={() => setIsOpenDonate(true)}/>
                        <CusButton clsButton={'bg-white w-full h-12'} icon={Chat1} name={'CHAT'}
                                   clsText={'text-[#374050]'}
                                   onClick={() => setIsOpenMsg(true)}/>
                    </div>}

                </div>
                {/*    div 2   */}
                <div className='md:w-full mt-10 md:mt-0 md:p-10 xl:p-20'>
                    <div className='text-white my-r w-full justify-between'>
                        <div className='text-[30px] font-bold'>{dtUser?.name || ''}</div>
                        {(!isMine() && isLogin) &&
                            <CusButton clsButton={'bg-[#de6152] w-35 h-10 rounded-[20px]'}
                                       icon={isFollowed ? Checked : Love1}
                                       name={isFollowed ? 'ĐÃ THEO DÕI' : 'THEO DÕI'}
                                       clsText={''} onClick={() => {
                                onFollow()
                            }}/>}

                    </div>

                    <div className='my-r justify-between my-10'>
                        {[['SỐ NGƯỜI THEO DÕI', '0 người'], ['ĐÃ ĐƯỢC THUÊ', '0 giờ'], ['TỶ LỆ HOÀN THÀNH', `${dtUser?.completion_rate || 0}%`], ['TÌNH TRẠNG THIẾT BỊ',
                            <img src={Mic1} className='w-6' alt=""/>]].map((i, ii) =>
                            <div key={`playerde-${ii}`}>
                                <div className=' pr-2' style={{color: gray1}}>
                                    {i[0]}
                                </div>
                                <div className='text-[#c86456]'>
                                    {i[1]}
                                </div>

                            </div>)}
                    </div>

                    <div className='my-5 flex flex-wrap gap-5 md:px-10 justify-center'>
                        {[Game1, Game2, Game3, Game4, Game1, Game2, Game4, Game3].map((i, ii) =>
                            <div key={`playerde-g-${ii}`}>
                                <img className='w-20 rounded-[5px] cursor-pointer' src={i} alt=""/>
                            </div>)}


                    </div>

                    <CusDivider cls={{}}/>

                    <div className=' text-white'>
                        <div className='text-title-lg text-white my-3 font-bold'>Thông tin</div>
                        <div>XIN CHÀO TẤT CẢ MỌI NGƯỜI !!!</div>
                    </div>

                    <div>
                        <div className='text-white mt-5'>
                            Anh ơi?
                        </div>
                        <ul className='text-white list-disc ml-5 li'>
                            <li>Tớ nhận onl cam, xoa dịu tâm hồn cậu, cam kết quan tâm cậu hơn cả mấy em ghệ cũ =))</li>
                            <li>Giá cam tớ only 500/1h</li>
                            <li>Đôi khi không check app nên cậu cần thì lhe ig: khongnhu502 hoặc facebook:
                                https://www.facebook.com/profile.php?id=100047185901124&mibextid=b06tZ0
                            </li>
                            <li>Trước tới giờ chỉ có bị chơi đùa tình cảm thôi chứ không có chơi được cái game gì hết
                            </li>
                            <li>Tớ nói chuyện hiền lắm và hiếm nói bậy nên xin user đừng lớn tiếng, giật mình là mếu
                            </li>
                            <li>Không 18+, không toxic, cảm ơn.</li>
                        </ul>
                    </div>

                    <CusDivider cls={{}}/>

                    <div className='text-title-lg text-white my-3 font-bold'>Top donate tháng</div>

                    {[
                        ["#1", <div className='rounded-[50%] size-8 bg-[#d4d4d4] mr-3 ml-6'/>, '5.000.000 đ'],
                        ["#2", <div className='rounded-[50%] size-8 bg-[#d4d4d4] mr-3 ml-6'/>, '5.000.000 đ'],
                        ["#3", <div className='rounded-[50%] size-8 bg-[#d4d4d4] mr-3 ml-6'/>, '5.000.000 đ'],

                    ].map((i, ii) => <div className='my-r justify-between text-white my-4'>
                        <div className='my-r' key={`player-de-donate-${ii}`}>
                            <div className='text-title-md'>{i[0]}</div>
                            {i[1]}
                            <div className='text-title-sm'>Ronaldo</div>

                        </div>
                        <div className='text-title-sm'>{i[2]}</div>
                    </div>)}

                    <CusDivider cls={{}}/>
                    <div className='text-title-lg text-white my-6 font-bold'>Đánh giá</div>
                    <div>
                        {[...Array(5).keys()].map((_, ii) =>
                            <div className='flex my-3' key={`player-de-cmt-${ii}`}>
                                <div className='rounded-[50%] size-13 bg-[#d4d4d4] mr-1 md:mr-3 md:ml-6 '/>
                                <div className='flex-1'>
                                    <div className='my-r gap-2 justify-between '>
                                        <div className='flex flex-col gap-3'>
                                            <div className='text-blue-300'>Anh Béo</div>
                                            <div className='text-[#44474e]'>13:29:49&nbsp;14/07/2024</div>
                                            <div className='text-white'>Hi</div>
                                        </div>
                                        <div className=''>
                                            <div className='my-r gap-2'>
                                                {[...Array(5).keys()].map((_, ii) =>
                                                    <img key={`star-${ii}`} src={Star} className={'w-5'}
                                                         alt=""/>)}
                                            </div>
                                            <div className='text-[#717172] text-right mt-2'>(Thuê 2h)</div>
                                        </div>
                                    </div>
                                    <CusDivider cls={{}}/>
                                </div>


                            </div>)}
                    </div>

                </div>

            </div>

            <HireUser setIsOpen={setIsOpenHire} isOpen={isOpenHire} infoUser={dataUser?.data[idUser] as IUser}/>

            <DonateUser setIsOpen={setIsOpenDonate} isOpen={isOpenDonate}/>


            <CusModal title={"GỬI TIN NHẮN CHO PLAYER"} okTxt={"Gửi tin nhắn"} closeTxt={'Đóng'}
                      setIsOpen={setIsOpenMsg}
                      isOpen={isOpenMsg}>
                <div className='py-5 px-5'>
                    <Textarea
                        placeholder='Tin nhắn của bạn ...'
                        variant={`textAreaStyle1`}
                        rows={5}
                        className={` py-3`}
                    />

                </div>

            </CusModal>


        </div>
    );
};