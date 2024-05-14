import React, {useEffect, useState} from 'react';
import './style.css'
import Top3 from "../../components/Top3";
import Board from "../../components/Board";
import { BoardList } from 'types/interface';
import {latestBoardListMock, top3BoardListMock } from 'mocks';
import Pagination from 'components/Pagination';

// * Component : Main Display Component
export default function Main() {

    // component : 메인 화면 상단 컴포넌트
    const MainTop = () => {

        // * state : 주간 top 3 게시물 리스트 상태
        const [top3BoardList, setTop3BoardList] = useState<BoardList[]>([]);

        // * effect : 첫 마운트 시 실행될 함수
        useEffect(() => {
            setTop3BoardList(top3BoardListMock);
        }, [])
        return (
            <div id='main-top-wrapper'>
                <div className='main-top-container'>
                    <div className='main-top-title'>{'Kei\'s Board에서\n다양한 이야기를 나눠보세요'}</div>
                    <div className='main-top-contents-box'>
                        <div className='main-top-contents-title'>{'주간 TOP 3 게시글'}</div>
                        <div className='main-top-contents'>
                            {top3BoardList.map(top3Board => <Top3 top3List={top3Board} />)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // component : 메인 하단 상단 컴포넌트
    const MainBottom = () => {

        // * state : 최신 게시물 리스트 상태
        const [currentBoardList, setCurrentBoardList] = useState<BoardList[]>([]);
        // * state : 인기 검색어 리스트 상태
        const [popularWordList, setPopularWordList] = useState<string[]>([]);
        // * effect : 첫 마운트 시 실행될 함수
        useEffect(() => {
            setCurrentBoardList(latestBoardListMock);
            setPopularWordList(['안녕', '잘가', '또봐']);
        }, []);
        return (
            <div id='main-bottom-wrapper'>
                <div className='main-bottom-container'>
                    <div className='main-bottom-title'>{'최신 게시물'}</div>
                    <div className='main-bottom-contents-box'>
                        <div className='main-bottom-current-contents'>
                            {currentBoardList.map(board => <Board boardList={board} />)}
                        </div>
                        <div className='main-bottom-popular-box'>
                            <div className='main-bottom-popular-card'>
                                <div className='main-bottom-popular-card-container'>
                                    <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                                    <div className='main-bottom-popular-card-contents'>
                                        {popularWordList.map(word => <div className='word-badge'>{word}</div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='main-bottom-pagination-box'>
                        {/*<Pagination viewPageList={} totalSection={} setCurrentSection={} setCurrentPage={} currentSection={} currentPage={} />*/}
                    </div>
                </div>
            </div>
        )
    }

    // * Render: Main Display Rendering
    return (
       <>
           <MainTop />
           <MainBottom />
       </>
    );
}
