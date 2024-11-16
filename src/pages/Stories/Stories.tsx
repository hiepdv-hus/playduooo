import BGStory from "../../images/stories/bg-stories.png";
import ViewCount from "../../images/stories/view-count.png";
import Cmt from "../../images/stories/cmt-count.png";
import Ava from "../../images/stories/img.png";
import IconLove from "../../images/icon/icon-love-1.svg";
import Love from "../../images/stories/love.png";
import IconChat from "../../images/icon/icon-chat-3.svg"
import Rank from "./Rank.tsx";
import StoriesDetail from "../../components/Stories/StoriesDetail.tsx";
import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {CusDivider} from "../../components/CusDivider.tsx";
import {TrendingStories} from "../../components/Sidebar/TrendingStories.tsx";
import AddStr from "../../images/navbar/add-str.png";
import {arFetcher, BASE_URL, getStaticFile, getStoryURL, myFetch} from "../../common/utils/useReq.ts";
import useSWRImmutable from "swr/immutable";
import useSWR from "swr";
import BGStories from "../../images/home/img-stories.png";
import EyeViewer from "../../images/home/eye-view.svg";
import UploadStories from "./UploadStories.tsx";
import {useRecoilState} from "recoil";
import {isLoginState, selUserState} from "../../hooks/store.ts";
import {visibleByCls} from "../../components/VisibleControl.tsx";
import {con1} from "../../common/utils/Styles.tsx";


export interface IStories {
    code: string;
    message: string;
    data: {
        [key: string]: {
            id: string;
            title: string;
            content: string;
            user_id: string;
            media_url: string;
            status: string;
            likes_count: number;
            comments_count: number;
            views_count: number;
        }
    };
    links: null;
    relationships: null;
    timestamp: Date;
}

const Stories = () => {
    const navi = useNavigate()
    const location = useLocation();
    const {pathname} = location;
    const [isOpenStrDetail, setIsOpenStrDetail] = useState(false)
    const [isLogin, _] = useRecoilState(isLoginState)
    const [selUser, setSelUser] = useRecoilState(selUserState)

    const [infoStr, setInfoStr] = useState({})
    const {data: dataStories, error: errorStories} = useSWR(['/stories'], myFetch)
    const urlArr = []
    const idUsers: {
        [key: string]: any;
    } = {}
    if(dataStories && dataStories.data) for(const i in dataStories.data) idUsers[dataStories.data[i].user_id] = 1
    if(idUsers) for (const i in idUsers) urlArr.push([`/users/user_id?user_id=${i}`, {}, {method: 'PATCH'}])

    const { data:dataUsers } = useSWRImmutable(urlArr.length ? urlArr : null, arFetcher, {revalidateIfStale: false});

    const objUsers: { [key: string]: any; } = {}
    if(dataUsers) {
        for(const i of dataUsers){
            for(const j in i.data){
                objUsers[j] = i.data[j]
            }
        }
    }


    const renStories = []
    if (dataStories && dataStories.data && Object.keys(objUsers).length) {
        const dt = dataStories.data
        for (const i in dt) {
            renStories.push(
                <div key={`p-st-${dt[i].id}`} className='flex flex-col gap-1.5 mb-5 min-w-40 md:min-w-55'>
                    <div
                        className="min-w-full h-[240px] md:h-[290px]  relative cursor-pointer rounded-lg hov-style-1"
                        onClick={() => {
                            setIsOpenStrDetail(true)
                            // setInfoStr({
                            //     media_url: `${BASE_URL}/file/path?path=${dt[i]?.media_url}`,
                            //     avatar: `${BASE_URL}/file/path?path=${objUsers[dt[i].user_id].avatar}`,
                            //     name: objUsers[dt[i].user_id].name,
                            //     user_id: dt[i].user_id,
                            //     story_id: i,
                            //     price: dt[i].price
                            // })

                            setInfoStr({
                                // media_url: dt[i]?.media_url,
                                avatar: `${getStaticFile(objUsers[dt[i]?.user_id]?.avatar)}`,
                                // name: objUsers[dt[i].user_id].name,
                                // user_id: dt[i].user_id,
                                story_id: i,
                                // price: dt[i].price
                            })
                            setSelUser(objUsers[dt[i]?.user_id] || {})
                            // navi(`/stories/${i}`)
                        }}>
                        <img
                            alt={''}
                            draggable={false}
                            className='absolute top-0 left-0 select-none rounded-lg h-full w-full hover:opacity-70'
                            src={getStaticFile(objUsers[dt[i]?.user_id]?.avatar)}/>

                        <div className='absolute bottom-4 left-.5 w-full my-r justify-between px-3'>
                            <div className='my-r gap-1'>
                                <img src={EyeViewer} alt="" className=' w-4 '/>
                                <div className="text-white text-sm">
                                    {dt[i]?.views_count || 0}
                                </div>
                            </div>
                            <div className='my-r gap-1'>
                                <img src={IconChat} alt="" className=' w-4'/>
                                <div className="text-white text-sm">
                                    {dt[i]?.comments_count || 0}
                                </div>
                            </div>
                            <div className='my-r gap-1'>
                                <img src={IconLove} alt="" className=' w-4 '/>
                                <div className="text-white text-sm">
                                    {dt[i]?.likes_count || 0}
                                </div>
                            </div>

                        </div>

                    </div>
                    <Link to={`/user/${dt[i].user_id}`} className='max-w-40 md:max-w-55 my-r h-12 pl-2 gap-2 cursor-pointer '>
                        <img src={`${getStaticFile(objUsers[dt[i]?.user_id]?.avatar)}`} alt=""
                             className=' size-12 rounded-[50%] bg-white p-0.5'/>
                        <div className='text-white text-sm hover:text-[#e05844] txt-clip max-h-[40px]'>{objUsers[dt[i]?.user_id]?.name || ''}</div>
                    </Link>
                </div>
            )
        }
    }

    useEffect(() => {
        const idStory = pathname.split('/')[2] || ""
        if(idStory.length){
            setIsOpenStrDetail(true)
            setInfoStr({

            })
        }
    }, [pathname])


    return (
        <div className={`md:py-10 py-2 px-5 h-full min-h-screen md:w-[calc(100vw-130px)]`}>
            {/*<CusDivider cls={{}}/>*/}
            <div className={`md:hidden block`}>
                {isLogin &&
                    <div className=' my-r my-3 gap-2 cursor-pointer select-none'
                         onClick={() => {visibleByCls('con-upload-str', con1)}}>
                        <img src={AddStr} alt="" className='w-8 hover:opacity-80'/>
                        <div className="text-white hover:text-[#e05844] text-sm">Đăng tin của bạn</div>
                    </div>}
                <TrendingStories/>
            </div>

            <div className='flex flex-wrap gap-3 mt-5 items-center justify-center'>
                {/*{[...Array(10).keys()].map((_, ii) =>*/}
                {/*    <CardStory1 key={`str-${ii}`}/>)}*/}
                {renStories}
            </div>

            {/*<div*/}
            {/*    className="bg-[#15202B] select-none mx-auto w-80 mt-10  py-1 rounded-[10px] text-center text-white cursor-pointer text-sm">*/}
            {/*    Xem thêm*/}
            {/*</div>*/}

            {isOpenStrDetail &&  <StoriesDetail setIsOpen={setIsOpenStrDetail}  infoStr={infoStr}/>}

            {isLogin && <UploadStories/>}

        </div>
    )

}

export default Stories