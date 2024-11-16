// @flow
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";



export function NotFound() {
    const navi = useNavigate()
    useEffect(() => {
        navi('/')
    }, [])
    return(
        <></>
    )

}