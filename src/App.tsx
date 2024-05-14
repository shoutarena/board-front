import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, Routes } from 'react-router-dom';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import UserP   from 'views/User';
import BoardUpdate from 'views/Board/Update';
import BoardDetail from 'views/Board/Detail';
import Search from 'views/Search';
import BoardWrite from 'views/Board/Write';
import Container from 'layouts/Container';
import { MAIN_PATH } from 'constant';
import { SEARCH_PATH } from 'constant';
import { USER_PATH } from 'constant';
import { AUTH_PATH } from 'constant';
import { BOARD_DETAIL_PATH } from 'constant';
import { BOARD_PATH } from 'constant';
import { BOARD_UPDATE_PATH } from 'constant';
import { BOARD_WRITE_PATH } from 'constant';
import { useCookies } from "react-cookie";
import { useLoginUserStore } from "./stores";
import { getSignInUserRequest } from "./apis";
import GetSignInUserResponseDto from "./apis/response/user/get-sign-in-user.response.dto";
import {ResponseDto} from "./apis/response";
import {User} from "./types/interface";

// * Component : Application Component
function App() {

    // * state : cookie state
    const [cookies, setCookie] = useCookies();
    // * state : login user general state
    const { setLoginUser, resetLoginUser} = useLoginUserStore();

    // * function : get sign in user response process function
    const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'AF' || code === 'NM' || code === 'DBE'){
            resetLoginUser();
            return;
        }
        const loginUser:User = { ...responseBody as GetSignInUserResponseDto };
        setLoginUser(loginUser);
    }

    // * Effect : access token cookie modify process function
    useEffect(() => {
        if(!cookies.accessToken){
            resetLoginUser();
            return;
        }
        getSignInUserRequest(cookies.accessToken)
            .then(getSignInUserResponse);
    }, [cookies.accessToken]);

    // * Render : Application Component Rendering
    /* * description 
     * * 메인 -> '/' - Main
     * * 로그인 + 회원가입 -> '/auth' - Authentication
     * * 검색 -> '/search/:searchWord' - Search
     * * 유저 -> '/user/:userEmail' - User
     * * 게시물 상세보기 -> '/board/detail/:boardIdx' - BoardDetail
     * * 게시물 작성 -> '/board/write' - BoardWrite
     * * 게시물 수정 -> '/board/update/:boardIdx' - BoardUpdate
     * */
    return (
        <Routes>
            <Route element={<Container />}>
                <Route path={MAIN_PATH()} element={<Main />} />
                <Route path={AUTH_PATH()} element={<Authentication />} />
                <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
                <Route path={USER_PATH(':userEmail')} element={<UserP />} />
                <Route path={BOARD_PATH()}>
                    <Route path={BOARD_DETAIL_PATH(':boardIdx')} element={<BoardDetail />} />
                    <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
                    <Route path={BOARD_UPDATE_PATH(':boardIdx')} element={<BoardUpdate />} />
                </Route>
                <Route path='*' element={<h1>404 Not Found</h1>} />
            </Route>
        </Routes>
    );
}

export default App;
