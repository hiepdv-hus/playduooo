// @flow
import AvaTrend from "../../images/navbar/ava-trend.png";
import {CusDivider} from "../CusDivider.tsx";
import {Link} from "react-router-dom";
import {red1} from "../../common/utils/Styles.tsx";
import StoriesDetail from "../Stories/StoriesDetail.tsx";
import {useState} from "react";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";


interface ITags {
    code: string;
    message: string;
    data: {
        [key: string]: {
            id: string;
            name: string;
            description: string;
        }
    };
    links: null;
    relationships: null;
    timestamp: Date;
}




export function TrendingStories() {
    const [isOpenStrDetail, setIsOpenStrDetail] = useState(false)
    const {data: dataTags} = useSWRImmutable(['/tags'], {revalidateIfStale: false})

    const renTags = []
    if(dataTags && dataTags.data ){
        const dt = (dataTags as ITags).data
        for (const i in dt){
            renTags.push(
                <div
                    key={`tag-${dt[i]?.id}`}
                    className='cursor-pointer hov-style-1 bg-[#454545] rounded-[8px] text-white  text-sm w-max py-1 px-2'>
                    {dt[i]?.name}
                </div>
            )
        }
    }


    return (
        <div className=''>

            {/*<div className='md:mt-5 mt-0'>*/}
            {/*    <div  className='flex items-center md:items-start md:overflow-hidden md:flex-col flex-row overflow-auto py-4 md:py-0 gap-4 md:gap-1'>*/}
            {/*        {[...Array(9).keys()].map((_, ii) =>*/}
            {/*            <div className={`my-r gap-2  select-none cursor-pointer `} key={`player1-${ii}`}>*/}
            {/*                <img src={AvaTrend} alt="" onClick={() =>{setIsOpenStrDetail(true)}} className='md:hidden block min-w-18 hover:opacity-70 rounded-full hov-style-1'/>*/}
            {/*                <img src={AvaTrend} alt="" onClick={() =>{setIsOpenStrDetail(true)}} className='md:block hidden w-10 '/>*/}
            {/*                <Link to={'/user/1'} className='text-white hover:text-[#e05844] text-sm hidden md:block'>Rolnado</Link>*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className='md:block hidden'>
                <CusDivider cls={{background: '#646464'}}/>
            </div>

            <div className="my-10">
                <div className='mt-5 font-bold text-white'>
                    Hashtags
                </div>

                <div className='flex flex-wrap gap-2 mt-3'>
                    {/*{["#Oncam", "#Sexy", "#Cosplay", "Tayto"].map((i, ii) =>*/}
                    {/*    <div*/}
                    {/*        key={`trending1-${ii}`}*/}
                    {/*        className='cursor-pointer hov-style-1 bg-[#454545] rounded-[8px] text-white  text-sm w-max py-1 px-2'>*/}
                    {/*        {i}*/}
                    {/*    </div>)}*/}
                    {/*{renTags}*/}
                </div>
            </div>

            {/*{isOpenStrDetail && <StoriesDetail infoStr={{}} setIsOpen={setIsOpenStrDetail}/>}*/}

        </div>
    );
}