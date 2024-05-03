import React from 'react';
import './App.css';
import Board from 'components/Board';
import Top3 from 'components/Top3';
import Comment from 'components/Comment';
import Favorite from 'components/Favorite';
import InputBox from 'components/InputBox';
import Footer from 'layouts/Footer';
import { latestBoardListMock, top3BoardListMock, commentListMock, favoriteListMock } from 'mocks';
import {Route, Routes } from 'react-router-dom';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import User from 'views/User';
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

// * Component : Application Component
function App() {

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
                <Route path={USER_PATH(':userEmail')} element={<User />} />
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
