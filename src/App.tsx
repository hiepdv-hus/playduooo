import {useEffect, useState} from 'react';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import Home from "./pages/Home/Home.tsx";
import './app.scss'
import Stories from "./pages/Stories/Stories.tsx";
import PlayerDetail from "./pages/PlayerDetail";
import Admin from "./pages/Admin";
import Info from "./pages/Info";
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {inputTheme} from "./components/theme/input.ts";
import { useRecoilState } from 'recoil'
import {CookiesProvider} from "react-cookie";
import NotFound from "./pages/NotFound";
import {SWRConfig} from "swr";
import {BASE_URL} from "./common/utils/useReq.ts";
import {currentUserState} from "./hooks/store.ts";
import {bg3} from "./common/utils/Styles.tsx";
import {textAreaTheme} from "./components/theme/textArea.ts";
import 'font-awesome/css/font-awesome.min.css';


const theme = extendTheme(
    {
        components: {
            Input: inputTheme,
            Select: inputTheme,
            InputGroup: inputTheme,
            Textarea: textAreaTheme
        },
        styles: {
            global: () => ({
                body: {

                    background: bg3
                    // bg: mode('blue.50', 'blue.900'),
                    // color: mode('blue.900', 'blue.50')
                }
            })
        }
    }
)

function App() {
    const [loading, setLoading] = useState<boolean>(true);
    const {pathname} = useLocation();
    const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
    const navi = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });
    }, []);

    return loading ? (
        <Loader/>
    ) : (
        <CookiesProvider defaultSetOptions={{path: '/'}}>
            <SWRConfig value={{
                fetcher: async (params: any) => {
                    const [url, headers, ops] = params;
                    const res = await fetch(`${BASE_URL}${url}`, {
                        method: 'GET',
                        headers: {'accept': 'application/json',
                            'Authorization': `Bearer ${currentUser?.accessToken} || ''`,
                            ...headers},
                        ...ops
                    });

                    const resp = await res?.json()

                    if (!res.ok) {
                        if(resp?.code == "AUTH0006" || resp?.code == "AUTH0005"){
                            setCurrentUser({})
                            navi('/')
                        }
                    }
                    return resp;
                },
            }}>
                <ChakraProvider theme={theme}>
                    <DefaultLayout>
                        <Routes>
                            <Route
                                index
                                element={
                                    <>
                                        <PageTitle title="Demo..."/>
                                        <Home/>
                                    </>
                                }
                            />
                            <Route
                                path="/stories/:id?"
                                element={
                                    <>
                                        <PageTitle title="Stories"/>
                                        < Stories/>
                                    </>
                                }
                            />
                            <Route
                                path="/user/:id"
                                element={
                                    <>
                                        <PageTitle title="Player detail"/>
                                        < PlayerDetail/>
                                    </>
                                }
                            />


                            <Route
                                path="/admin"
                                element={
                                    <>
                                        <PageTitle title="Admin"/>
                                        < Admin/>
                                    </>
                                }
                            />

                            <Route
                                path="/info"
                                element={
                                    <>
                                        <PageTitle title="Info"/>
                                        < Info/>
                                    </>
                                }
                            />
                            <Route
                                path="*"

                                element={
                                    <>
                                        <PageTitle title="Home"/>
                                        <NotFound/>
                                    </>
                                }
                            />


                        </Routes>
                    </DefaultLayout>
                </ChakraProvider>
            </SWRConfig>
        </CookiesProvider>

    );
}

export default App;
