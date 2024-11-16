import {red1} from "../../common/utils/Styles.tsx";
import AvaPlayer from "../../images/user/user-01.png";
import {useRecoilState} from "recoil";
import {currentUserState} from "../../hooks/store.ts";
import useSWR from "swr";
import {BASE_URL, myFetch} from "../../common/utils/useReq.ts";
import {IUser} from "../PlayerDetail/PlayerDetail.tsx";

export const Wallet = () => {

    const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
    const {data: dataUser, error: errDataUser} = useSWR([currentUser.info.id ? `/users/user_id?user_id=${currentUser.info.id}` : null, {}, {method: 'PATCH'}], myFetch)

    let dtUser
    if(dataUser) dtUser = dataUser?.data[currentUser.info.id] as IUser

    return (
        <div className={`p-5`}>
            <div className={`my-r gap-3`}>
                <div className={`bg-[#27292c] px-2 py-2 text-sm font-bold cursor-pointer select-none`}
                     style={{color: red1}}>Thông tin
                </div>
                <div className={`text-[#888f99]  text-sm font-bold cursor-pointer select-none`}>Album</div>
            </div>

            <div className={`mt-10 ml-5 my-r cursor-pointer`}>
                <div className={`w-16`}>
                    <img src={`${BASE_URL}/file/path?path=${dtUser?.avatar}`} className={`rounded-lg size-16`}
                         alt=""/>
                </div>

                <div className='text-sm ml-5'>
                    <div className={`text-sm font-bold`} style={{color: red1}}>Thay Đổi</div>
                    <div className={`text-[#90858d]`}>JPG, GIF OR PPNG, &lt;5 MB.</div>
                </div>
            </div>

            <div className='mt-10'>
                <div className='text-[#979da3] font-bold text-sm'>TÊN HIỂN THỊ</div>
                <input
                    className="w-full lg:w-[45%] mt-2 rounded border border-stroke bg-[#333638] py-3 pl-3 pr-4.5 text-black border-none text-gray focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="value"/>
            </div>
            <div className='mt-6'>
                <div className='text-[#979da3] font-bold text-sm'>NHẬP URL RÚT GỌN, KHÔNG DẤU (CHỈ ĐƯỢC TẠO 1 LẦN)</div>
                <input
                    className="w-full lg:w-[45%] mt-2 rounded border border-stroke bg-[#333638] py-3 pl-3 pr-4.5 text-black border-none text-gray focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="value"/>
            </div>
            <div className='mt-6'>
                <div className='text-[#979da3] font-bold text-sm'>TIÊU ĐỀ</div>
                <input
                    className="w-full lg:w-[45%] mt-2 rounded border border-stroke bg-[#333638] py-3 pl-3 pr-4.5 text-black border-none text-gray focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="value"/>
            </div>
            <div className='mt-6'>
                <div className='text-[#979da3] font-bold text-sm'>SỐ ĐIỆN THOẠI</div>
                <input
                    type={"number"}
                    className="w-full lg:w-[45%] mt-2 rounded border border-stroke bg-[#333638] py-3 pl-3 pr-4.5 text-black border-none text-gray focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="value"/>
            </div>
        </div>
    )
}
