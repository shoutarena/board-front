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
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import './style.css'
import {useBoardStore, useLoginUserStore} from "../../stores";

// * Component : Header Component
export default function Header() {

    // * State : Login User State
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    // * State : path State
    const { pathname } = useLocation();
    // * State : Cookie State
    const [cookie, setCookie] = useCookies();
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
    const navigate = useNavigate();

    // * Event Handler: 로고 클릭 Event Handler
    const onLogoClick = () => {
        navigate(MAIN_PATH());
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
            navigate(SEARCH_PATH(word))
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
                <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={searchWord} 
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
            navigate(USER_PATH(email));
        }
        // * Event Handler : Sign Out Button Click Event Handler
        const onSignOutButtonClickHandler = () => {
            resetLoginUser();
            setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() });
            navigate(MAIN_PATH());
        }
        // * Event Handler : Login Button Click Event Handler
        const onSignInButtonEventHandler = () => {
            navigate(AUTH_PATH());
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

        // * State : Board State
        const { title, content, boardImageFileList, resetBoard } = useBoardStore();

        // * Event Handler : Upload Button Click Event Handler
        const onUploadButtonClickHandler = () => {

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
