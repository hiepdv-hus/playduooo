// @flow
import './Info.scss'
import {CusDivider} from "../../components/CusDivider.tsx";
import {bg1, red1} from "../../common/utils/Styles.tsx";
import {useState} from "react";
import IconEdit from "../../images/icon/icon-edit-1.svg"

import {useRecoilState} from "recoil";
import {currentUserState, isAdminState} from "../../hooks/store.ts";
import {Account} from "./Account.tsx";
import {Wallet} from "./Wallet.tsx";
import {ManageUsers} from "./ManageUsers.tsx";
type Props = {};

const Player = () => {

    const Div2 = () => {
        return(
            <div className={`flex flex-wrap gap-10 `} >
                <div className={`xl:w-1/4 lg:w-1/3 md:w-1/2 w-[95%] h-45 p-3 text-[#98979b] text-sm mx-auto lg:mx-0`} style={{border: "1px solid #c3c2c6"}}>
                    <div>DOANH THU 7 NGÀY</div>
                    <div className={`font-bold text-lg mt-3`} style={{color: red1}}>0 đ</div>
                    <div className={`bg-white h-1 w-full mt-1`}></div>
                    <div className={`mt-3`}>
                        BẠN CẦN <b>200,000đ</b> NỮA ĐỂ TRỞ THÀNH <b>HOT PLAYER</b>
                    </div>
                </div>

                <div className={`xl:w-1/4 lg:w-1/3 md:w-1/2 w-[95%] h-45 p-3 text-[#98979b] text-sm mx-auto lg:mx-0`} style={{border: "1px solid #c3c2c6"}}>
                    <div>DOANH THU 30 NGÀY</div>
                    <div className={`font-bold text-lg mt-3`} style={{color: red1}}>Hạng 11908</div>
                    <div className={`bg-white h-1 w-full mt-1`}></div>

                </div>
                <div className={`xl:w-1/4 lg:w-1/3 md:w-1/2 w-[95%] h-45 p-3 text-[#98979b] text-sm mx-auto lg:mx-0`} style={{border: "1px solid #c3c2c6"}}>
                    <div>TỶ LỆ HOÀN THÀNH</div>
                    <div className={`font-bold text-lg mt-3`} style={{color: red1}}>0 %</div>
                    <div className={`bg-white h-1 w-full mt-1`}></div>
                    <div className={`mt-3`}>
                        BẠN CẦN ĐẠT <b>80%</b> NỮA ĐỂ TRỞ THÀNH <b>HOT PLAYER</b>
                    </div>
                </div>
                <div className={`xl:w-1/4 lg:w-1/3 md:w-1/2  h-45 w-[95%] p-3 text-[#98979b] text-sm mx-auto lg:mx-0`} style={{border: "1px solid #c3c2c6"}}>
                    <div>LƯỢT ĐÁNH GIÁ</div>
                    <div className={`font-bold text-lg mt-3`} style={{color: red1}}>0.00</div>
                    <div className={`bg-white h-1 w-full mt-1`}></div>
                    <div className={`mt-3`}>
                        BẠN CẦN <b>5</b> ĐỂ TRỞ THÀNH <b>HOT PLAYER</b>
                    </div>
                </div>
                <div className={`xl:w-1/4 lg:w-1/3 md:w-1/2 h-45 w-[95%] p-3 text-[#98979b] text-sm mx-auto lg:mx-0` } style={{border: "1px solid #c3c2c6"}}>
                    <div>ĐÁNH GIÁ TRUNG BÌNH</div>
                    <div className={`font-bold text-lg mt-3`} style={{color: red1}}>0.00</div>
                    <div className={`bg-white h-1 w-full mt-1`}></div>
                    <div className={`mt-3`}>
                        BẠN CẦN <b>4</b> ĐỂ TRỞ THÀNH <b>HOT PLAYER</b>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='text-white text-title-sm font-bold'>Tổng quan</div>
            <div className={`flex gap-10 mt-5 items-center mb-5`}>
                <div className={`w-[95%] md:w-1/2 mx-auto  lg:w-1/4 h-60 sm:h-100 md:h-80  text-sm`}
                     style={{border: "1px solid #c3c2c6"}}>
                    <div className='my-r mx-auto w-max mt-10'>
                        <div className={` text-[#9b969a]`}>BẠN ĐANG LÀ <b>PLAYER</b></div>
                    </div>
                </div>

                <div className={`lg:block hidden flex-1`}>
                    <Div2/>
                </div>
            </div>

            <div className={`flex-1 block lg:hidden`}>
                <Div2/>
            </div>

        </div>
    )
}
const DonateComp = () => {
    return (
        <div>
            <div className={`text-title-lg font-bold`}>Lịch sử giao dịch</div>
            <table className='table-head w-full mt-10  text-center'>
                <tr className=' font-bold'>
                    <td>Thời gian</td>
                    <td>Số tiền</td>
                    <td>Nội dung</td>
                    <td>Trạng thái</td>
                    <td></td>
                </tr>
                <tr>
                    <td>18/07/2024</td>
                    <td >1.000.000đ</td>
                    <td>ck playduo</td>
                    <td>pending</td>
                    <td><img className='cursor-pointer w-6 select-none hover:opacity-70' src={IconEdit} alt=""/></td>
                </tr>
                <tr>
                    <td>18/07/2024</td>
                    <td>1.000.000đ</td>
                    <td>ck playduo</td>
                    <td>pending</td>
                    <td><img className='cursor-pointer w-6 select-none hover:opacity-70' src={IconEdit} alt=""/></td>
                </tr>
                <tr>
                    <td>18/07/2024</td>
                    <td>1.000.000đ</td>
                    <td>ck playduo</td>
                    <td>pending</td>
                    <td><img className='cursor-pointer w-6 select-none hover:opacity-70' src={IconEdit}  alt=""/></td>
                </tr>
            </table>

        </div>
    )
}

export function Info(props: Props) {
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
    if(!currentUser.info || !currentUser.accessToken) return (<div className='min-h-screen'></div>)
    const [idx, setIdx] = useState(999999)
    // const [isOpenModal, setIsOpenModal] = useState(true)
    const [isAdmin] = useRecoilState<boolean>(isAdminState)

    return (
        <div className={`info text-white flex gap-2 pb-10`}>
            {/* BEGIN CAT */}
            <div className={`cat w-1/4 sm:w-[20%] lg:w-[15%] xl:w-[10%] bg-[${bg1}]  py-10 px-3 text-sm`}>
                <div className={`cursor-pointer hover:opacity-50 ${idx == 0 && 'opacity-50'}`}
                     onClick={() => setIdx(0)}>
                    <div className='my-r gap-3 font-bold cursor-pointer select-none w-25 justify-between'>
                        <div>TÀI KHOẢN</div>
                        <div className={`hidden sm:block`}>&gt;</div>
                    </div>
                    <CusDivider cls={{background: 'rgba(51, 53, 59, 1)', marginTop: 10}}/>
                </div>
                <div className={`cursor-pointer hover:opacity-50 ${idx == 1 && 'opacity-50'}`}
                     onClick={() => setIdx(1)}>
                    <div className='my-r gap-3 font-bold cursor-pointer select-none w-25 justify-between'>
                        <div>VÍ ĐIỆN TỬ</div>
                        <div className={`hidden sm:block`}>&gt;</div>
                    </div>
                    <CusDivider cls={{background: 'rgba(51, 53, 59, 1)', marginTop: 10}}/>
                </div>
                <div className={`cursor-pointer hover:opacity-50 ${idx == 2 && 'opacity-50'}`}
                     onClick={() => setIdx(2)}>
                    <div className='my-r gap-3 font-bold cursor-pointer select-none w-25 justify-between'>
                        <div>PLAYER</div>
                        <div className={`hidden sm:block`}>&gt;</div>
                    </div>
                    <CusDivider cls={{background: 'rgba(51, 53, 59, 1)', marginTop: 10}}/>
                </div>
                <div className={`cursor-pointer hover:opacity-50 ${idx == 3 && 'opacity-50'}`}
                     onClick={() => setIdx(3)}>
                    <div className='my-r gap-3 font-bold cursor-pointer select-none w-25 justify-between'>
                        <div>DONATE</div>
                        <div className={`hidden sm:block`}>&gt;</div>
                    </div>
                    <CusDivider cls={{background: 'rgba(51, 53, 59, 1)', marginTop: 10}}/>
                </div>


                {isAdmin && <div className={`cursor-pointer hover:opacity-50 ${idx == 4 && 'opacity-50'}`}
                      onClick={() => setIdx(4)}>
                    <div className='my-r gap-3 font-bold cursor-pointer select-none w-25 justify-between'>
                        <div>QUẢN LÝ USERS</div>
                        <div className={`hidden sm:block`}>&gt;</div>
                    </div>
                    <CusDivider cls={{background: 'rgba(51, 53, 59, 1)', marginTop: 10}}/>
                </div>}

            </div>
            {/* END CAT */}

            <div className={`flex-1 p-1 sm:p-5`}>
                {idx == 0 && <Account/>}
                {idx == 1 && <Wallet/>}
                {idx == 2 && Player()}
                {idx == 3 && DonateComp()}
                {idx == 4 && <ManageUsers/>}

                {/*<CusModal title={'sbc'} okTxt={"OK"} closeTxt={"Cancel"} isOpen={isOpenModal} setIsOpen={setIsOpenModal}>*/}
                {/*    {DonateComp()}*/}
                {/*</CusModal>*/}


            </div>

        </div>
    );
}