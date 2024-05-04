import React, {useState, KeyboardEvent, useRef, ChangeEvent} from 'react';
import './style.css'
import InputBox from "../../components/InputBox";
import {useNavigate} from "react-router-dom";
import {AUTH_PATH, MAIN_PATH} from "../../constant";
import {SignInRequestDto} from "../../apis/request/auth";
import {signInRequest} from "../../apis";
import {SignInResponseDto} from "../../apis/response/auth";
import ResponseDto from 'apis/response/response.dto';
import {useCookies} from "react-cookie";

// * Component : Authentication Display Component
export default function Authentication() {

    // * State : Display State
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');
    // * State : Cookie State
    const [cookies, setCookie] = useCookies();

    // * Function: Navigate function
    const navigator = useNavigate();

    // * Component : Sign In Card Component
    const SignInCard = () => {

        // * State : email refer state
        const emailRef = useRef<HTMLInputElement | null>(null);
        // * State : password state
        const passwordRef = useRef<HTMLInputElement | null>(null);
        // * State : email state
        const [email, setEmail] = useState<string>('');
        // * State : password state
        const [password, setPassword] = useState<string>('');
        // * State : password Type state
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
        // * State : password Button Icon state
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
        // * State : error state
        const [error, setError] = useState<boolean>(false);


        // * EventHandler : email change event handler
        const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const value = event.target.value;
            setEmail(value);
        }
        // * EventHandler : password change event handler
        const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setError(false);
            const value = event.target.value;
            setPassword(value);
        }

        // * Function : Sign In Response Process Function
        const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
            if(!responseBody){
                alert('네트워크 이상입니다.');
                return;
            }

            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류 입니다.');
            if(code === 'SF' || code === 'VF') setError(true);
            if(code !== 'SU') return;

            const { token, expirationTime } = responseBody as SignInResponseDto;
            const now = new Date().getTime();
            const expires = new Date(now + expirationTime * 1000);
            setCookie('accessToken', token, { expires, path: MAIN_PATH() });
            navigator(MAIN_PATH());

        }

        // * EventHandler : login button click event handler
        const onLoginButtonClickHandler = () => {
            const requestBody: SignInRequestDto = { email, password };
            signInRequest(requestBody).then((response: SignInResponseDto | ResponseDto | null) => signInResponse(response));
        }
        // * EventHandler : sign up link click event handler
        const onSignUpLinkButtonClickHandler = () => {
            setView('sign-up');
        }

        // * EventHandler : password button click event handler
        const onPasswordButtonClickHandler = () => {
            if(passwordType === 'text'){
                setPasswordType('password');
                setPasswordButtonIcon('eye-light-off-icon');
            }else{
                setPasswordType('text');
                setPasswordButtonIcon('eye-light-on-icon');
            }
        }
        // * EventHandler : email input key down event handler
        const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            if(!passwordRef.current) return;
            passwordRef.current?.focus();
        }
        // * EventHandler : password input key down event handler
        const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            onLoginButtonClickHandler();
        }

        // * Render: Sign In Card Rendering
        return (
            <div className='auth-card'>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{`로그인`}</div>
                        </div>
                        <InputBox ref={emailRef} label='이메일 주소' type='text' error={error} placeholder='이메일 주소를 입력해주세요.' value={email} onChange={onEmailChangeHandler} onKeyDown={onEmailKeyDownHandler} />
                        <InputBox ref={passwordRef} label='패스워드' type={passwordType} error={error} placeholder='비밀번호를 입력해 주세요.' value={password} onChange={onPasswordChangeHandler} icon={passwordButtonIcon} onButtonClick={onPasswordButtonClickHandler} onKeyDown={onPasswordKeyDownHandler} />
                    </div>

                    <div className='auth-card-bottom'>
                        {error &&
                            <div className='auth-sign-in-error-box'>
                                <div className='auth-sign-in-error-message'>
                                    {`이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해 주세요.`}
                                </div>
                            </div>
                        }
                        <div className='black-large-full-button' onClick={onLoginButtonClickHandler}>{`로그인`}</div>
                        <div className='auth-description-box'>
                            <div className='auth-description'>
                                {`신규 사용자이신가요? `}
                                <span className='auth-description-link' onClick={onSignUpLinkButtonClickHandler}>{`회원가입`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // * Component : Sign Up Card Component
    const SignUpCard = () => {

        // * Render: Sign Up card Rendering
        return (
            <div className='auth-card'></div>
        )
    }

    // * Render: Authentication Display Rendering
    return (
       <div id='auth-wrapper'>
           <div className='auth-container'>
               <div className='auth-jumbotron-box'>
                   <div className='auth-jumbotron-content'>
                       <div className='auth-logo-icon'></div>
                       <div className='auth-jumbotron-text-box'>
                           <div className='auth-jumbotron-text'>{`환영합니다.`}</div>
                           <div className='auth-jumbotron-text'>{`Kei's Board 입니다.`}</div>
                       </div>
                   </div>
               </div>
               { view === 'sign-in' && <SignInCard /> }
               { view === 'sign-up' && <SignUpCard /> }
           </div>
       </div>
    );
}
