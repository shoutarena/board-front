import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css'
import {useLoginUserStore} from "../../stores";
import {useNavigate, useParams} from "react-router-dom";
import {BoardList, User} from "../../types/interface";
import defaultProfileImage from 'assets/image/icon/default-profile-image.png';
import {
    fileUploadRequest,
    getUserBoardListRequest,
    getUserByEmailRequest,
    patchNicknameRequest,
    patchProfileImageRequest
} from "../../apis";
import {GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto} from "../../apis/response/user";
import {ResponseDto} from "../../apis/response";
import Board from "../../components/Board";
import Pagination from "../../components/Pagination";
import {usePagination} from "../../hooks";
import {GetUserBoardListResponseDto} from "../../apis/response/board";
import {BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH} from "../../constant";
import {PatchNicknameRequestDto, PatchProfileImageRequestDto} from "../../apis/request/user";
import {useCookies} from "react-cookie";

// * Component : User Display Component
export default function UserPage() {

    // * state : cookie state
    const [cookies, setCookies] = useCookies();
    // * state : 마이페이지 여부 상태
    const [isMyPage, setMyPage] = useState<boolean>(false);
    // * state : path variable 상태
    const { userEmail } = useParams();
    // * state : 로그인 유저 상태
    const { loginUser } = useLoginUserStore();
    // * navigator
    const navigator = useNavigate();

    // * Component : User Display Top Component
    const UserTop = () => {

        // * state : 닉네임 변경 여부 상태
        const [isNicknameChange, setNicknameChange] = useState<boolean>(false);
        // * state : 닉네임 상태
        const [nickname, setNickname] = useState<string>('');
        // * state : 변경닉네임 상태
        const [changeNickname, setChangeNickname] = useState<string>('');
        // * state : 프로필 이미지 상태
        const [profileImage, setProfileImage] = useState<string | null>(null);
        // * ref : 이미지 파일 ref
        const imageInputRef = useRef<HTMLInputElement | null>(null);

        // * event handler : 프로필 이미지 변경 버튼 닉네임 수정
        const onProfileBoxClickHandler = () => {
            if(!isMyPage) return;
            if(!imageInputRef.current) return;
            imageInputRef.current.click();
        }
        // * function : file upload response
        const fileUploadResponse = (profileImage: string | null) => {
            if(!profileImage) return;
            if(!cookies.accessToken) return;
            const requestBody: PatchProfileImageRequestDto = { profileImage };
            patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse);
        }
        // * function : patch Profile Image Response
        const patchProfileImageResponse = (responseBody: PatchProfileImageResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'AF') alert('인증에 실패했습니다.');
            if(code === 'NM') alert('존재하지 않는 유저입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;
            if(!userEmail) return;
            getUserByEmailRequest(userEmail).then(getUserByEmailResponse);
        }
        // * event handler : 프로필 이미지 변경 이벤트 처리
        const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if(!event.target.files || !event.target.files.length) return;
            const file = event.target.files[0];
            const data = new FormData();
            data.append('file', file);
            fileUploadRequest(data).then(fileUploadResponse);

        }
        // * event handler : 닉네임 변경 이벤트 처리
        const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setChangeNickname(value);
        }
        // * event handler : 닉네임 수정 버튼 클릭 이벤트 처리
        const onNicknameEditButtonClickHandler = () => {
            if(!isNicknameChange) {
                setChangeNickname(nickname);
                setNicknameChange(!isNicknameChange);
                return;
            }
            if(!cookies.accessToken) return;
            const requestBody: PatchNicknameRequestDto = { nickname: changeNickname };
            patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse);
        }
        // * function : patch Nickname Response
        const patchNicknameResponse = (responseBody: PatchNicknameResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'VF') alert('닉네임은 필수입니다.');
            if(code === 'AF') alert('인증에 실패했습니다.');
            if(code === 'DN') alert('중복되는 닉네임 입니다.');
            if(code === 'NM') alert('존재하지 않는 유저입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;
            if(!userEmail) return;
            getUserByEmailRequest(userEmail).then(getUserByEmailResponse);
            setNicknameChange(false);
        }

        // * function : get user by email response
        const getUserByEmailResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'NM') alert('존재하지 않는 유저입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') {
                navigator(MAIN_PATH());
                return;
            }
            const {email, nickname, profileImage} = responseBody as User;
            setNickname(nickname);
            setProfileImage(profileImage);
            if(!loginUser){
                setMyPage(false);
                return
            }
            setMyPage(email === loginUser.email);
        }
        // * effect : email path variable 변경시 실행 할 함수
        useEffect(() => {
            if(!userEmail) return;
            getUserByEmailRequest(userEmail).then(getUserByEmailResponse);
        }, [userEmail]);

        return (
            <div id='user-top-wrapper'>
                <div className='user-top-container'>
                    {isMyPage ?
                        <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
                            {profileImage !== null ?
                                <div className='user-top-profile-image' style={{backgroundImage: `url(${profileImage})`}}></div> :
                                <div className='icon-box-large'>
                                    <div className='icon image-box-white-icon'></div>
                                </div>
                            }
                            <input ref={imageInputRef} type='file' accept='image/*' className='display-none' onChange={onProfileImageChangeHandler} />
                        </div> :
                        <div className='user-top-profile-image-box' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
                    }
                    <div className='user-top-info-box'>
                        <div className='user-top-info-nickname-box'>
                            {isMyPage ?
                                <>
                                    {isNicknameChange ?
                                        <input className='user-top-info-nickname-input' type='text' size={nickname.length + 1} value={changeNickname} onChange={onNicknameChangeHandler} /> :
                                        <div className='user-top-info-nickname'>{nickname}</div>
                                    }
                                    <div className='icon-button' onClick={onNicknameEditButtonClickHandler}>
                                        <div className='icon edit-icon'></div>
                                    </div>
                                </> :
                                <div className='user-top-info-nickname'>{nickname}</div>
                            }
                        </div>
                        <div className='user-top-info-email'>{userEmail}</div>
                    </div>
                </div>
            </div>
        );
    };

    // * Component : User Display Bottom Component
    const UserBottom = () => {

        // * state : 게시물 count 상태
        const [count, setCount] = useState<number>(0);
        // * pagination hook
        const {currentPage, setCurrentPage, currentSection, setCurrentSection, viewList, viewPageList, totalSection, setTotalList} = usePagination<BoardList>(5);

        // * function : get user board list response
        const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;
            const { memberBoardList }  = responseBody as GetUserBoardListResponseDto;
            setTotalList(memberBoardList);
            setCount(memberBoardList.length);
        }
        // * event handler : on side card click handler
        const onSideCardClickHandler = () => {
            if(isMyPage) {
                navigator(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
                return;
            }
            if(!loginUser) return;
            navigator(USER_PATH(loginUser.email));
        }

        useEffect(() => {
            if(!userEmail) return;
            getUserBoardListRequest(userEmail).then(getUserBoardListResponse);
        }, [userEmail]);

        return (
            <div id='user-bottom-wrapper'>
                <div className='user-bottom-container'>
                    <div className='user-bottom-title'>{isMyPage ? '내 게시물 ' : '게시물 '}<span className='emphasis'>{count}</span></div>
                    <div className='user-bottom-contents-box'>
                        {count > 0 ?
                            <div className='user-bottom-contents'>
                                {viewList?.map(board => <Board key={board.boardIdx} boardList={board} />)}
                            </div> :
                            <div className='user-bottom-contents-nothing'>{'게시물이 없습니다.'}</div>
                        }
                        <div className='user-bottom-side-box'>
                            <div className='user-bottom-side-card'>
                                <div className='user-bottom-side-container'>
                                    {isMyPage ?
                                        <>
                                            <div className='icon-box'>
                                                <div className='icon edit-icon'></div>
                                            </div>
                                            <div className='user-bottom-side-text' onClick={onSideCardClickHandler}>{'글쓰기'}</div>
                                        </> :
                                        <>
                                            <div className='user-bottom-side-text' onClick={onSideCardClickHandler}>{'내 게시물로 가기'}</div>
                                            <div className='icon-box'>
                                                <div className='icon arrow-right-icon'></div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='user-bottom-pagination-box'>
                        {count > 0 && <Pagination currentSection={currentSection} setCurrentSection={setCurrentSection} currentPage={currentPage} setCurrentPage={setCurrentPage} totalSection={totalSection} viewPageList={viewPageList} />}
                    </div>
                </div>
            </div>
        );
    };

    // * Render: User Display Rendering
    return (
       <>
           <UserTop />
           <UserBottom />
       </>
    );
}
