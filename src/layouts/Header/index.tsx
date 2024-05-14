import {
    AUTH_PATH,
    BOARD_DETAIL_PATH, BOARD_PATH,
    BOARD_UPDATE_PATH,
    BOARD_WRITE_PATH,
    MAIN_PATH,
    SEARCH_PATH,
    USER_PATH
} from 'constant';
import React, {useRef, useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {Form, useLocation, useNavigate, useParams} from 'react-router-dom';
import './style.css'
import {useBoardStore, useLoginUserStore} from "../../stores";
import {fileUploadRequest, patchBoardRequest, postBoardRequest} from "../../apis";
import {PatchBoardRequestDto, PostBoardRequestDto} from "../../apis/request/board";
import {PatchBoardResponseDto, PostBoardResponseDto} from "../../apis/response/board";
import {ResponseDto} from "../../apis/response";

// * Component : Header Component
export default function Header() {

    // * State : Login User State
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    // * State : path State
    const { pathname } = useLocation();
    // * State : Cookie State
    const [cookies, setCookies] = useCookies();
    // * State : Login State
    const [isLogin, setLogin] = useState<boolean>(false);

    // const isAuthPage = pathname.startsWith(AUTH_PATH());
    // const isMainPage = pathname === MAIN_PATH();
    // const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
    // const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
    // const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
    // const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
    // const isUserPage = pathname.startsWith(USER_PATH(''));

    // * State : Auth Page State
    const [isAuthPage, setAuthPage] = useState<boolean>(false);
    // * State : Main Page State
    const [isMainPage, setMainPage] = useState<boolean>(false);
    // * State : Search Page State
    const [isSearchPage, setSearchPage] = useState<boolean>(false);
    // * State : Board Detail Page State
    const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
    // * State : Board Write Page State
    const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
    // * State : Board Update Page State
    const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
    // * State : User Page State
    const [isUserPage, setUserPage] = useState<boolean>(false);

    // * Function: 네비게이트 함수
    const navigator = useNavigate();

    // * Event Handler: 로고 클릭 Event Handler
    const onLogoClick = () => {
        navigator(MAIN_PATH());
    }
    
    // * Component : Search Button Component
    const SearchButton = () => {

        // * State : Search Button Element Reference State
        const searchButtonRef = useRef<HTMLInputElement | null>(null);
        // * State : Search Button State
        const [status, setStatus] = useState<boolean>(false);
        // * State : Search Word State
        const [word, setWord] = useState<string>('');
        // * State : Search Word Path Variable State
        const { searchWord } = useParams();

        // * Event Handler : Search Word Change Event Handler
        const onSearchWordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setWord(value);
        }
        // * Event Handler : Search Key Event Handler
        const onSearchWordKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            if(!searchButtonRef.current) return;
            searchButtonRef.current.click();
        }
        // * Event Handler : Search Button Click Event Handler
        const onSearchButtonHandler = () => {
            if(!status){
                setStatus(!status);
                return;
            }
            navigator(SEARCH_PATH(word))
        }
        
        // * Effect : 검색어  path variable 변경 될때 마다 실행될 함수
        useEffect(() => {
            if(searchWord){
                setWord(searchWord);
                setStatus(true);
            }
        }, [searchWord]);

        // * Render : SearchButton Rendering(Click False State)
        if(!status){
            return (
                <div className='icon-button' onClick={onSearchButtonHandler}>
                    <div className='icon search-light-icon'></div>
                </div>
            )
        }
        // * Render : SearchButton Rendering(Click True State)
        return (
            <div className='header-search-input-box'>
                <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word}
                       onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
                <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonHandler}>
                    <div className='icon search-light-icon'></div>
                </div>
            </div>
        )

    }

    // * Component : Mypage Button Component
    const MyPageButton = () => {

        // * State : user Email path variable State
        const { userEmail } = useParams();

        // * Event Handler : MyPage Button Click Event Handler
        const onMyPageButtonClickHandler = () => {
            if(!loginUser){
                return;
            }
            const { email } = loginUser;
            navigator(USER_PATH(email));
        }
        // * Event Handler : Sign Out Button Click Event Handler
        const onSignOutButtonClickHandler = () => {
            resetLoginUser();
            setCookies('accessToken', '', { path: MAIN_PATH(), expires: new Date() });
            navigator(MAIN_PATH());
        }
        // * Event Handler : Login Button Click Event Handler
        const onSignInButtonEventHandler = () => {
            navigator(AUTH_PATH());
        }

        // * Render :  Logout Button Rendering
        if(isLogin && userEmail === loginUser?.email) {
            return (
                <div className='white-button' onClick={onSignOutButtonClickHandler}>{`로그아웃`}</div>
            );
        }

        // * Render :  Mypage Button Rendering
        if(isLogin){
            return (
                <div className='white-button' onClick={onMyPageButtonClickHandler}>{`마이페이지`}</div>
            );
        }

        // * Render :  Login Button Rendering
        return (
            <div className='black-button' onClick={onSignInButtonEventHandler}>{`로그인`}</div>
        );
    }

    // * Component : Upload Button Component
    const UploadButton = () => {

        // * state : board idx state
        const { boardIdx } = useParams();
        // * State : Board State
        const { title, content, boardImageFileList, resetBoard } = useBoardStore();

        // * function : post board response 처리 함수
        const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {

            if(!responseBody) return;

            const { code } = responseBody;
            if(code === 'AF' || code === 'NM') navigator(AUTH_PATH());
            if(code === 'VF') alert('제목과 내용은 필수 입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            resetBoard();

            if(!loginUser) return;
            const { email } = loginUser;
            navigator(USER_PATH(email));
        }

        // * function : patch board response
        const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'AF' || code === 'NM' || code === 'NB' || code === 'NP') navigator(AUTH_PATH());
            if(code === 'VF') alert('제목과 내용은 필수 입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            if(!boardIdx) return;
            navigator(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardIdx));

        }

        // * Event Handler : Upload Button Click Event Handler
        const onUploadButtonClickHandler = async () => {

            const accessToken = cookies.accessToken;

            if(!accessToken) return;

            const boardImageList: string[] = [];

            for(const file of boardImageFileList){
                const data = new FormData();
                data.append('file', file);
                const url = await fileUploadRequest(data);
                if(url) boardImageList.push(url);
            }

            if(isBoardWritePage){
                const requestBody: PostBoardRequestDto = {
                    title: title,
                    content: content,
                    boardImageList: boardImageList
                };

                postBoardRequest(requestBody, accessToken).then(postBoardResponse);
                return;
            }

            if(isBoardUpdatePage){
                if(!boardIdx) return;
                const requestBody: PatchBoardRequestDto = {
                    title: title,
                    content: content,
                    boardImageList: boardImageList
                };

                patchBoardRequest(requestBody, boardIdx, accessToken).then(patchBoardResponse);
                return;
            }


        }

        // * Render :  Upload Button Rendering
        if(title && content){
            return(
                <div className='black-button' onClick={onUploadButtonClickHandler}>{`업로드`}</div>
            )
        }

        // * Render :  Upload Disabled Button Rendering
        return(
            <div className='disable-button'>{`업로드`}</div>
        )
    }

    // * Effect : path modify Effect
    useEffect(() => {
        const isAuthPage = pathname.startsWith(AUTH_PATH());
        const isMainPage = pathname === MAIN_PATH();
        const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
        const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
        const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
        const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
        const isUserPage = pathname.startsWith(USER_PATH(''));
        setAuthPage(isAuthPage);
        setMainPage(isMainPage);
        setSearchPage(isSearchPage);
        setBoardDetailPage(isBoardDetailPage);
        setBoardWritePage(isBoardWritePage);
        setBoardUpdatePage(isBoardUpdatePage);
        setUserPage(isUserPage);
    }, [pathname]);

    // * Effect : login user
    useEffect(() => {
        setLogin(loginUser !== null);
    }, [loginUser])

    // * Render : Header Rendering
    return (
       <div id='header'>
           <div className='header-container'>
               <div className='header-left-box' onClick={onLogoClick}>
                   <div className='icon-box'>
                       <div className='icon logo-dark-icon'></div>
                   </div>
                   <div className='header-logo'>{`Kei's Board`}</div>
               </div>
               <div className='header-right-box'>
                   { ( isAuthPage || isMainPage || isSearchPage || isBoardDetailPage ) && <SearchButton /> }
                   { ( isMainPage || isSearchPage || isBoardDetailPage || isUserPage ) && <MyPageButton /> }
                   { ( isBoardWritePage || isBoardUpdatePage) && <UploadButton /> }
               </div>
           </div>
       </div>
    );
}
