import React, {useEffect, useState} from 'react';
import './style.css'
import Top3 from "../../components/Top3";
import Board from "../../components/Board";
import { BoardList } from 'types/interface';
import {latestBoardListMock, top3BoardListMock } from 'mocks';
import Pagination from 'components/Pagination';
import {useNavigate} from "react-router-dom";
import {SEARCH_PATH} from "../../constant";
import {getLatestBoardListRequest, getPopularWordListRequest, getTop3BoardListRequest} from "../../apis";
import {GetLatestBoardListResponseDto, GetTop3BoardListResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {GetPopularListResponseDto} from "../../apis/response/search";
import {usePagination} from "../../hooks";

// * Component : Main Display Component
export default function Main() {

    // function : navigator function
    const navigator = useNavigate();

    // component : 메인 화면 상단 컴포넌트
    const MainTop = () => {

        // * state : 주간 top 3 게시물 리스트 상태
        const [top3BoardList, setTop3BoardList] = useState<BoardList[]>([]);

        // * function : get top3 board list response
        const getTop3BoardListResponse = (responseBody: GetTop3BoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;
            const { top3List } = responseBody as GetTop3BoardListResponseDto;
            setTop3BoardList(top3List);
        }

        // * effect : 첫 마운트 시 실행될 함수
        useEffect(() => {
            getTop3BoardListRequest().then(getTop3BoardListResponse);
        }, [])
        return (
            <div id='main-top-wrapper'>
                <div className='main-top-container'>
                    <div className='main-top-title'>{'Kei\'s Board에서\n다양한 이야기를 나눠보세요'}</div>
                    <div className='main-top-contents-box'>
                        <div className='main-top-contents-title'>{'주간 TOP 3 게시글'}</div>
                        <div className='main-top-contents'>
                            {top3BoardList.map(top3Board => <Top3 key={top3Board.boardIdx} top3List={top3Board} />)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // component : 메인 하단 상단 컴포넌트
    const MainBottom = () => {

        // * state: pagination 관련 상태
        const {currentPage, setCurrentPage, currentSection, setCurrentSection, viewList, viewPageList, totalSection, setTotalList} = usePagination<BoardList>(5);
        // // * state : 최신 게시물 리스트 상태
        // const [currentBoardList, setCurrentBoardList] = useState<BoardList[]>([]);
        // * state : 인기 검색어 리스트 상태
        const [popularWordList, setPopularWordList] = useState<string[]>([]);

        // * event handler : 인기 검색어 클릭 이벤트 처리
        const onPopularWordClickHandler = (word: string) => {
            navigator(SEARCH_PATH(word));
        }

        // * function : get latest board list response
        const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;
            const { latestList } = responseBody as GetLatestBoardListResponseDto;
            setTotalList(latestList);
        }
        // * function : get latest board list response
        const getPopularWordListResponse = (responseBody: GetPopularListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;
            const { popularWordList } = responseBody as GetPopularListResponseDto;
            setPopularWordList(popularWordList);
        }
        // * effect : 첫 마운트 시 실행될 함수
        useEffect(() => {
            getLatestBoardListRequest().then(getLatestBoardListResponse);
            getPopularWordListRequest().then(getPopularWordListResponse);
        }, []);
        return (
            <div id='main-bottom-wrapper'>
                <div className='main-bottom-container'>
                    <div className='main-bottom-title'>{'최신 게시물'}</div>
                    <div className='main-bottom-contents-box'>
                        <div className='main-bottom-current-contents'>
                            {viewList?.map(board => <Board key={board.boardIdx} boardList={board} />)}
                        </div>
                        <div className='main-bottom-popular-box'>
                            <div className='main-bottom-popular-card'>
                                <div className='main-bottom-popular-card-container'>
                                    <div className='main-bottom-popular-card-title'>{'인기 검색어'}</div>
                                    <div className='main-bottom-popular-card-contents'>
                                        {popularWordList.map((word, index) => <div key={index} className='word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='main-bottom-pagination-box'>
                        <Pagination viewPageList={viewPageList} totalSection={totalSection} setCurrentSection={setCurrentSection} setCurrentPage={setCurrentPage} currentSection={currentSection} currentPage={currentPage} />
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
