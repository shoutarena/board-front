import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css'
import {Board, CommentList, FavoriteList} from "types/interface";
import Favorite from "components/Favorite";
import FavoriteListMock from "mocks/favorite-list.mock";
import CommentListMock from "mocks/comment-list.mock";
import Comment from "components/Comment";
import Pagination from 'components/Pagination';
import defaultProfileImage from 'assets/image/icon/default-profile-image.png';
import {useLoginUserStore} from "stores";
import {useNavigate, useParams} from "react-router-dom";
import {BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH} from "constant";
import {getBoardRequest, increaseViewCountRequest} from "../../../apis";
import {ResponseDto} from "../../../apis/response";
import { GetBoardResponseDto } from 'apis/response/board';
import {IncreaseViewCountResponseDto} from "../../../apis/response/board";


// * Component : Board Detail Display Component
export default function BoardDetail() {

    // * state : 게시물 번호 path variable 상태
    const { boardIdx } = useParams();
    // * state : 로그인 유저 상태
    const { loginUser } = useLoginUserStore();
    // * function : 네비게이트 함수
    const navigator = useNavigate();

    // * Component : Board Detail Top Component
    const BoardDetailTop = () => {

        // * state : 작성자 여부 상태
        const [isWriter, setWriter] = useState<boolean>(false);
        const [board, setBoard] = useState<Board | null>();

        // * state : more button state
        const [showMore, setShowMore] = useState<boolean>(false);

        // * event handler : nickname click event handler
        const onNicknameClickHandler = () => {
            if(!board) return;
            navigator(USER_PATH(board.writerEmail))
        }
        // * event handler : more button event handler
        const onMoreButtonClickHandler = () => {
            setShowMore(!showMore);
        }
        // * event handler : update button event handler
        const onUpdateButtonClickHandler = () => {
            if(!board || !loginUser) return;
            if(loginUser.email !== board.writerEmail) return;
            navigator(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(board.boardIdx));
        }
        // * event handler : delete button event handler
        const onDeleteButtonClickHandler = () => {
            if(!board || !loginUser) return;
            if(loginUser.email !== board.writerEmail) return;
            // TODO : Delete Request
            navigator(MAIN_PATH());
        }
        // * function : get board response process function
        const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'NB') alert('존재하지 않는 게시물입니다.');
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') {
                navigator(MAIN_PATH());
                return;
            }
            const board: Board = {...responseBody as GetBoardResponseDto};
            setBoard(board);
            if(!loginUser) {
                setWriter(false);
                return;
            }
            const isWriter = loginUser.email === board.writerEmail;
            setWriter(isWriter);
        }
        // * effect : 게시물 번호 path variable 이 바뀔때 마다 게시물 불러오기
        useEffect(() => {
            if(!boardIdx){
                navigator(MAIN_PATH());
                return;
            }
            getBoardRequest(boardIdx).then(getBoardResponse);
            // setShowMore(loginUser?.email === board?.writerEmail)
        }, [boardIdx]);
        if(!board) return <></>;
        return (
            <div id='board-detail-top'>
                <div className='board-detail-top-header'>
                    <div className='board-detail-title'>{board.title}</div>
                    <div className='board-detail-top-sub-box'>
                        <div className='board-detail-write-info-box'>
                            <div className='board-detail-writer-profile-image' style={{ backgroundImage: `url(${board.writerProfileImage ? board.writerProfileImage : defaultProfileImage})` }}></div>
                            <div className='board-detail-writer-nickname' onClick={onNicknameClickHandler}>{board.writerNickname}</div>
                            <div className='board-detail-info-divider'>{`\|`}</div>
                            <div className='board-detail-write-date'>{board.regDt}</div>
                        </div>
                        {isWriter &&
                            <div className='icon-button' onClick={onMoreButtonClickHandler}>
                                <div className='icon more-icon'></div>
                            </div>
                        }
                        {showMore &&
                            <div className='board-detail-more-box'>
                                <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
                                <div className='divider'></div>
                                <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
                            </div>
                        }
                    </div>
                </div>
                <div className='divider'></div>
                <div className='board-detail-top-main'>
                    <div className='board-detail-main-text'>{board.content}</div>
                    {board.boardImageList.map(image => <img className='board-detail-main-image' src={image} />)}

                </div>
            </div>
        );
    }
    // * Component : Board Detail Bottom Component
    const BoardDetailBottom = () => {

        // * state : 댓글 textarea 참조 상태
        const commentRef = useRef<HTMLTextAreaElement | null>(null);
        // * state : favorite list state
        const [favoriteList, setFavoriteList] = useState<FavoriteList[]>();
        // * state : comment list state
        const [commentList, setCommentList] = useState<CommentList[]>();
        // * state : favorite state
        const [isFavorite, setFavorite] = useState<boolean>(false);
        // * state : show list favorite state
        const [showFavorite, setShowFavorite] = useState<boolean>(false);
        // * state : show list comment state
        const [isShowComment, setShowComment] = useState<boolean>(false);
        // * state : comment state
        const [comment, setComment] = useState<string>('');

        // * event handler : favorite click handler
        const onFavoriteButtonClickHandler = () => {
            setFavorite(!isFavorite);
        }
        // * event handler : show favorite click handler
        const onShowFavoriteOpenClickHandler = () => {
            setShowFavorite(!showFavorite);
        }
        // * event handler : show comment click handler
        const onShowCommentClickHandler = () => {
            setShowComment(!isShowComment);
        }
        // * event handler : comment modify event handler
        const onCommentChangeHandler = (event:ChangeEvent<HTMLTextAreaElement>) => {
            const { value } = event.target;
            setComment(value);
            if(!commentRef.current) return;
            commentRef.current.style.height = 'auto';
            commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
        }
        // * event handler : 댓글 작성 event handler
        const onCommentSubmitClickHandler = () => {
            if(!comment) return;
        }

        // * effect : 게시물 번호 path variable 이 바뀔때 마다 실행 좋아요 및 댓글 리스트 불러오기
        useEffect(() => {
            setFavoriteList(FavoriteListMock);
            setCommentList(CommentListMock);
        }, [boardIdx]);

        return (
            <div id='board-detail-bottom'>
                <div className='board-detail-bottom-button-box'>
                    <div className='board-detail-bottom-button-group'>
                        <div className='icon-button' onClick={onFavoriteButtonClickHandler}>
                            <div className={`icon ${isFavorite ? 'favorite-fill-icon' : 'favorite-light-icon'}`}></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`좋아요 ${favoriteList?.length}`}</div>
                        <div className='icon-button' onClick={onShowFavoriteOpenClickHandler}>
                                <div className={`icon ${showFavorite ? 'up-light-icon' : 'down-light-icon'}`}></div>
                        </div>
                    </div>
                    <div className='board-detail-bottom-button-group'>
                        <div className='icon-button'>
                            <div className='icon comment-icon'></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`댓글 ${commentList?.length}`}</div>
                        <div className='icon-button' onClick={onShowCommentClickHandler}>
                            <div className={`icon ${isShowComment ? 'up-light-icon': 'down-light-icon'}`}></div>
                        </div>
                    </div>
                </div>
                {showFavorite &&
                    <div className='board-detail-bottom-favorite-box'>
                        <div className='board-detail-bottom-favorite-container'>
                            <div className='board-detail-bottom-favorite-title'>{'좋아요 '}<span className='emphasis'>{favoriteList?.length}</span></div>
                            <div className='board-detail-bottom-favorite-contents'>
                                {favoriteList?.map(item => <Favorite favoriteList={item} />)}
                            </div>
                        </div>
                    </div>
                }
                {isShowComment &&
                    <div className='board-detail-bottom-comment-box'>
                        <div className='board-detail-bottom-comment-container'>
                            <div className='board-detail-bottom-comment-title'>{'댓글 '}<span
                                className='emphasis'>{commentList?.length}</span></div>
                            <div className='board-detail-bottom-comment-list-container'>
                                {commentList?.map(item => <Comment commentList={item}/>)}
                            </div>
                        </div>
                        <div className='divider'></div>
                        <div className='board-detail-bottom-comment-pagination-box'>
                            <Pagination/>
                        </div>
                        <div className='board-detail-bottom-comment-input-box'>
                            <div className='board-detail-bottom-comment-input-container'>
                                <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeHandler}/>
                                <div className='board-detail-bottom-comment-button-box'>
                                    <div className={comment === '' ? 'disable-button' : 'black-button'} onClick={onCommentSubmitClickHandler}>{'댓글달기'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }

    // * function : increase view count response process function
    const increaseViewCountResponse = (responseBody: IncreaseViewCountResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'NB') alert('존재하지 않는 게시물입니다.');
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
    }
    // * effect : 게시물 번호 path variable 바뀔때 마다 게시물 조회수 증가
    let effectFlag = true;
    useEffect(() => {
        if(!boardIdx) return;
        if(effectFlag){
            effectFlag = false;
            return;
        }
        increaseViewCountRequest(boardIdx).then(increaseViewCountResponse);


    }, [boardIdx]);

    // * Render: Board Detail Display Rendering
    return (
       <div id='board-detail-wrapper'>
           <div className='board-detail-container'>
               <BoardDetailTop />
               <BoardDetailBottom />
           </div>
       </div>
    );
}
