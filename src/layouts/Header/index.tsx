import {AUTH_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import React, {useRef, useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import './style.css'
import {useLoginUserStore} from "../../stores";
import loginUserStore from "../../stores/login-user.store";

// * Component : Header Component
export default function Header() {

    // * State : Login User State
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

    // * State : Cookie State
    const [cookies, setCookies] = useCookies();
    // * State : Login State
    const [isLogin, setLogin] = useState<boolean>(false);

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

    // * Component : Login or Mypage Button Component
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
                   <SearchButton />
                   <MyPageButton />
               </div>
           </div>
       </div>
    );
}
