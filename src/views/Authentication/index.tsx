import React, {useState, KeyboardEvent, useRef, ChangeEvent, useEffect} from 'react';
import './style.css'
import InputBox from "../../components/InputBox";
import {useNavigate} from "react-router-dom";
import {MAIN_PATH} from "../../constant";
import {SignInRequestDto, SignUpRequestDto} from "../../apis/request/auth";
import {signInRequest, signUpRequest} from "../../apis";
import {SignInResponseDto, SignUpResponseDto} from "../../apis/response/auth";
import ResponseDto from 'apis/response/response.dto';
import {useCookies} from "react-cookie";
import {Address, useDaumPostcodePopup} from "react-daum-postcode";

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

        // * Ref State : email refer state
        const emailRef = useRef<HTMLInputElement | null>(null);
        // * Ref State : password state
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

        // * Ref State : email refer state
        const emailRef = useRef<HTMLInputElement>(null);
        // * Ref State : password refer state
        const passwordRef = useRef<HTMLInputElement>(null);
        // * Ref State : password check refer state
        const passwordCheckRef = useRef<HTMLInputElement>(null);

        // * Ref State : nickname refer state
        const nicknameRef = useRef<HTMLInputElement>(null);
        // * Ref State : tel number check refer state
        const telNumberRef = useRef<HTMLInputElement>(null);
        // * Ref State : address check refer state
        const addressRef = useRef<HTMLInputElement>(null);
        // * Ref State : address detail check refer state
        const addressDetailRef = useRef<HTMLInputElement>(null);

        // * State : Page Number State
        const [page, setPage] = useState<1 | 2>(1);
        // * State : email state
        const [email, setEmail] = useState<string>('');
        // * State : password state
        const [password, setPassword] = useState<string>('');
        // * State : password check state
        const [passwordCheck, setPasswordCheck] = useState<string>('');
        // * State : password Type state
        const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
        // * State : password checkType state
        const [passwordCheckType, setPasswordCheckType] = useState<'text' | 'password'>('password');
        // * State : email error state
        const [isEmailError, setEmailError] = useState<boolean>(false);
        // * State : password error state
        const [isPasswordError, setPasswordError] = useState<boolean>(false);
        // * State : password check error state
        const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
        // * State : email error message state
        const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
        // * State : password error message state
        const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
        // * State : password check error message state
        const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');

        // * State : nickname error state
        const [isNicknameError, setNicknameError] = useState<boolean>(false);
        // * State : tel number message state
        const [isTelNumberError, setTelNumberError] = useState<boolean>(false);
        // * State : address error state
        const [isAddressError, setAddressError] = useState<boolean>(false);
        // * State : nickname error message state
        const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
        // * State : tel number error message state
        const [telNumberErrorMessage, setTelNumberErrorMessage] = useState<string>('');
        // * State : address error message state
        const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');


        // * State : password button icon state
        const [passwordButtonIcon, setPasswordButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');
        // * State : password check button icon state
        const [passwordCheckButtonIcon, setPasswordCheckButtonIcon] = useState<'eye-light-off-icon' | 'eye-light-on-icon'>('eye-light-off-icon');

        // * State : nickname state
        const [nickname, setNickname] = useState<string>('');
        // * State : tel number state
        const [telNumber,setTelNumber] = useState<string>('');
        // * State : address state
        const [address, setAddress] = useState<string>('');
        // * State : address detail state
        const [addressDetail, setAddressDetail] = useState<string>('');

        // * State : agreed personal state
        const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);
        // * State : agreed personal error state
        const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);

        // * Function : daum post search popup open function
        const postOpen = useDaumPostcodePopup();
        // * Function : sign up response process function
        const signUpResponse = (responseBody: SignUpResponseDto | ResponseDto | null) => {
            if(!responseBody) {
                alert('네트워크 이상입니다.')
                return;
            }

            const { code } = responseBody;
            switch(code){
                case 'DE':
                    setEmailError(true);
                    setEmailErrorMessage('중복되는 이메일 주소입니다.');
                    break;
                case 'DN':
                    setNicknameError(true);
                    setNicknameErrorMessage('중복되는 닉네임 입니다.')
                    break;
                case 'DT':
                    setTelNumberError(true);
                    setTelNumberErrorMessage('중복되는 핸드폰 번호입니다.');
                    break;
                case 'VF':
                    alert('모든 값을 입력하세요.');
                    break;
                case 'DBE':
                    alert('데이터 베이스 오류입니다.');
                    break;
                default:
                    break;
            }
            if(code !== 'SU') return;

            setView('sign-in');
        }

        // * Event Handler : email modify Event Handler
        const onEmailChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setEmail(value);
            setEmailError(false);
            setEmailErrorMessage('');
        }
        // * Event Handler : password modify Event Handler
        const onPasswordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setPassword(value);
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
        // * Event Handler : passwordCheck modify Event Handler
        const onPasswordCheckChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setPasswordCheck(value);
            setPasswordCheckError(false);
            setPasswordCheckErrorMessage('');
        }
        // * Event Handler : password button Event Handler
        const onPasswordButtonClickHandler = () => {
            if(passwordButtonIcon === 'eye-light-off-icon'){
                setPasswordButtonIcon('eye-light-on-icon');
                setPasswordType('text');
            }else{
                setPasswordButtonIcon('eye-light-off-icon');
                setPasswordType('password');
            }
        }
        // * Event Handler : password check button Event Handler
        const onPasswordCheckButtonClickHandler = () => {
            if(passwordCheckButtonIcon === 'eye-light-off-icon'){
                setPasswordCheckButtonIcon('eye-light-on-icon');
                setPasswordCheckType('text');
            }else{
                setPasswordCheckButtonIcon('eye-light-off-icon');
                setPasswordCheckType('password');
            }
        }
        // * event handler : email key down event handler
        const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            if(!passwordRef.current) return;
            passwordRef.current.focus();
        }
        // * event handler : password key down event handler
        const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            if(!passwordCheckRef.current) return;
            passwordCheckRef.current.focus();
        }
        // * event handler : password check key down event handler
        const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            onNextButtonClickHandler();
        }
        // * event handler : next button click evnet handler
        const onNextButtonClickHandler = () => {
            signUp1PhaseValidation();

            setPage(2);
        }

        // * event handler : nickname change event handler
        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setNickname(value);
            setNicknameError(false);
            setNicknameErrorMessage('');
        }
        // * event handler : tel number change event handler
        const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setTelNumber(value);
            setTelNumberError(false);
            setTelNumberErrorMessage('');
        }
        // * event handler : address change event handler
        const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setAddress(value);
            setAddressError(false);
            setAddressErrorMessage('');
        }
        // * event handler : address detail change event handler
        const onAddressDetailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setAddressDetail(value);
        }
        // * event handler : agreed personal check box event handler
        const onAgreedPersonalClickHandler = () => {
            setAgreedPersonal(!agreedPersonal);
            setAgreedPersonalError(false);
        }
        // * event handler : login link click event handler
        const onLoginLinkClickHandler = () => {
            setView('sign-in');
        }
        // * event handler : address button click event handler
        const onAddressButtonClickHandler = () => {
            postOpen({ onComplete : onPostComplete });
        }
        // * event handler : daum post search complete event handler
        const onPostComplete = (data: Address) => {
            const { address } = data;
            setAddress(address);
            setAddressError(false);
            setAddressErrorMessage('');
            if(!addressDetailRef.current) return;
            addressDetailRef.current.focus();

        }

        // * event handler : nickname key down event handler
        const onNicknameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            if(!telNumberRef.current) return;
            telNumberRef.current.focus()
        }
        // * event handler : tel number key down event handler
        const onTelNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            onAddressButtonClickHandler();
        }
        // * event handler : address key down event handler
        const onAddressKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            if(!addressDetailRef.current) return;
            addressDetailRef.current.focus()
        }
        // * event handler : address Detail key down event handler
        const onAddressDetailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if(event.key !== 'Enter') return;
            onSignUpButtonClickHandler();
        }

        // * event handler : sign up button click event handler
        const onSignUpButtonClickHandler = () => {

            signUp1PhaseValidation();

            const hasNickname = nickname.trim().length > 0;
            if(!hasNickname){
                setNicknameError(true);
                setNicknameErrorMessage('닉네임을 입력해주세요.');
            }
            const telNumberPattern = /^[0-9]{11,13}$/;
            const isTelNumberPattern = telNumberPattern.test(telNumber);
            if(!isTelNumberPattern){
                setTelNumberError(true);
                setTelNumberErrorMessage('숫자만 입력해주세요.');
            }
            const hasAddress = address.trim().length > 0;
            if(!hasAddress){
                setAddressError(true);
                setAddressErrorMessage('주소를 선택해주세요.');
            }
            if(!agreedPersonal) setAgreedPersonalError(true);

            if(!hasNickname || !isTelNumberPattern || !hasAddress || !agreedPersonal) return;

            const requestBody: SignUpRequestDto = {
                email, password, nickname, telNumber, address, addressDetail, agreedPersonal
            };

            signUpRequest(requestBody).then(signUpResponse);

        }
        const signUp1PhaseValidation = () => {
            const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
            const isEmailPattern = emailPattern.test(email);
            if(!isEmailPattern){
                setEmailError(true);
                setEmailErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
            }
            const isCheckedPassword = password.trim().length >= 8;
            if(!isCheckedPassword){
                setPasswordError(true);
                setPasswordErrorMessage('비밀번호는 8자 이상 입력해주세요.');
            }
            const isEqualPassword = password === passwordCheck;
            if(!isEqualPassword){
                setPasswordCheckError(true);
                setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
            }
            if(!isEmailPattern || !isCheckedPassword || !isEqualPassword) {
                if(page === 2) setPage(1);
                return;
            }
        }

        useEffect(() => {
            if(page === 2){
                if(!nicknameRef.current) return;
                nicknameRef.current.focus();
            }
        }, [page]);

        // * Render: Sign Up card Rendering
        return (
            <div className='auth-card'>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{`회원가입`}</div>
                            <div className='auth-card-page'>{`${page}/2`}</div>
                        </div>
                        {page === 1 && (
                            <>
                                <InputBox ref={emailRef} label='이메일 주소*' type='text' error={isEmailError}
                                          placeholder='이메일 주소를 입력해주세요.' value={email}
                                          onChange={onEmailChangeHandler}
                                          message={emailErrorMessage}
                                          onKeyDown={onEmailKeyDownHandler}/>
                                <InputBox ref={passwordRef} label='비밀번호*' type={passwordType} error={isPasswordError}
                                          placeholder='비밀번호를 입력해 주세요.' value={password}
                                          onChange={onPasswordChangeHandler}
                                          message={passwordErrorMessage} icon={passwordButtonIcon}
                                          onButtonClick={onPasswordButtonClickHandler}
                                          onKeyDown={onPasswordKeyDownHandler} />
                                <InputBox ref={passwordCheckRef} label='비밀번호 확인*' type={passwordCheckType} error={isPasswordCheckError}
                                          placeholder='비밀번호를 다시 입력해주세요.' value={passwordCheck}
                                          onChange={onPasswordCheckChangeHandler} message={passwordCheckErrorMessage} icon={passwordCheckButtonIcon}
                                          onButtonClick={onPasswordCheckButtonClickHandler}
                                          onKeyDown={onPasswordCheckKeyDownHandler} />
                            </>
                        )}
                        {page === 2 && (
                            <>
                                <InputBox ref={nicknameRef} label='닉네임*' type='text' error={isNicknameError}
                                          placeholder='닉네임을 입력해주세요.' value={nickname}
                                          onChange={onNicknameChangeHandler}
                                          message={nicknameErrorMessage}
                                          onKeyDown={onNicknameKeyDownHandler} />
                                <InputBox ref={telNumberRef} label='휴대 폰번호*' type='text' error={isTelNumberError}
                                          placeholder='핸드폰 번호를 입력해주세요.' value={telNumber}
                                          onChange={onTelNumberChangeHandler}
                                          message={telNumberErrorMessage}
                                          onKeyDown={onTelNumberKeyDownHandler} />
                                <InputBox ref={addressRef} label='주소*' type='text' error={isAddressError}
                                          placeholder='우편번호 찾기' value={address} onChange={onAddressChangeHandler}
                                          message={addressErrorMessage} icon='expand-right-light-icon' onButtonClick={onAddressButtonClickHandler}
                                          onKeyDown={onAddressKeyDownHandler}/>
                                <InputBox ref={addressDetailRef} label='상세 주소' type='text' error={false}
                                          placeholder='상세 주소를 입력해주세요.' value={addressDetail} onChange={onAddressDetailChangeHandler}
                                          onKeyDown={onAddressDetailKeyDownHandler}/>
                            </>
                        )}
                    </div>
                    <div className='auth-card-bottom'>
                        {page === 1 && (
                            <div className='black-large-full-button' onClick={onNextButtonClickHandler}>{`다음 단계`}</div>
                        )}
                        {page === 2 && (
                            <>
                                <div className='auth-consent-box'>
                                    <div className='auth-check-box' onClick={onAgreedPersonalClickHandler}>
                                        <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}`}></div>
                                    </div>
                                    <div className={isAgreedPersonalError ? 'auth-consent-title-error' : 'auth-consent-title' }>{'개인정보동의'}</div>
                                    <div className='auth-consent-link'>{`더보기 >`}</div>
                                </div>
                                <div className='black-large-full-button' onClick={onSignUpButtonClickHandler}>{`회원가입`}</div>
                            </>
                        )}
                        <div className='auth-description-box'>
                            <div className='auth-description'>{`이미 계정이 있으신가요? `}<span className='auth-description-link' onClick={onLoginLinkClickHandler}>{`로그인`}</span></div>
                        </div>
                    </div>
                </div>
            </div>
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
