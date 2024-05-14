import React, {useEffect, useState} from 'react';
import './style.css'
import {useNavigate, useParams} from "react-router-dom";
import Board from "../../components/Board";
import {usePagination} from "../../hooks";
import {BoardList} from "../../types/interface";
import {SEARCH_PATH} from "../../constant";
import {getRelationWordListRequest, getSearchBoardListRequest} from "../../apis";
import {GetSearchBoardListResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";
import {GetRelationListResponseDto} from "../../apis/response/search";
import Pagination from 'components/Pagination';

// * Component : Search Display Component
export default function Search() {

    // * state : 검색어 path variable 상태
    const { searchWord } = useParams<string>();
    // * state : 이전 검색어 상태
    const [preSearchWord, setPreSearchWord] = useState<string>('');
    // * state : 검색 게시물 개수 상태
    const [count, setCount] = useState<number>(0);

    // * pagination hook
    const {currentPage, setCurrentPage, currentSection, setCurrentSection, viewList, viewPageList, totalSection, setTotalList} = usePagination<BoardList>(5);

    // * function : navigator
    const navigator = useNavigate();
    // * state : 관련 검색어 리스트 상태
    const [relationWordList, setRelationWordList] = useState<string[]>([]);

    // * event handler : 관련 검색어 클릭 이벤트 처리
    const onRelationWordClickHandler = (word: string) => {
        navigator(SEARCH_PATH(word));
    }

    // * function : get Search Board List Response
    const getSearchBoardListResponse = (responseBody: GetSearchBoardListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;
        if(!searchWord) return;
        const { searchList } = responseBody as GetSearchBoardListResponseDto;
        setTotalList(searchList);
        setCount(searchList.length);
        setPreSearchWord(searchWord);
    }

    // * function : get Search Board List Response
    const getRelationWordListResponse = (responseBody: GetRelationListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;
        const { relativeWordList } = responseBody as GetRelationListResponseDto;
        setRelationWordList(relativeWordList);
    }

    useEffect(() => {
        if(!searchWord) return;
        getSearchBoardListRequest(searchWord, preSearchWord).then(getSearchBoardListResponse);
        getRelationWordListRequest(searchWord).then(getRelationWordListResponse);
    }, [searchWord]);

    // * Render: Search Display Rendering
    return (
       <div id='search-wrapper'>
           <div className='search-container'>
               <div className='search-title-box'>
                   <div className='search-title'><span className='search-title-emphasis'>{searchWord}</span>{'에 대한 검색결과 입니다.'}</div>
                   <div className='search-count search-title-emphasis'>{count}</div>
               </div>
               <div className='search-contents-box'>
                   {count > 0 ?
                       <div className='search-contents'>{viewList?.map(board => <Board key={board.boardIdx} boardList={board} />)}</div> :
                       <div className='search-contents-nothing'>{'검색 결과가 없습니다.'}</div>
                   }
                   <div className='search-relation-box'>
                       <div className='search-relation-card'>
                           <div className='search-relation-card-container'>
                               <div className='search-relation-card-title'>{'관련 검색어'}</div>
                               {relationWordList.length > 0 ?
                                   <div className='search-relation-card-contents'>{relationWordList.map((word,index) => <div className='word-badge' key={index} onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}</div> :
                                   <div className='search-relation-card-contents-nothing'>{'관련 검색어가 없습니다.'}</div>
                               }
                           </div>
                       </div>
                   </div>
               </div>
               <div className='search-pagination-box'>
                   {count > 0 && <Pagination currentSection={currentSection} setCurrentSection={setCurrentSection} currentPage={currentPage} setCurrentPage={setCurrentPage} totalSection={totalSection} viewPageList={viewPageList} />}
               </div>
           </div>
       </div>
    );
}
