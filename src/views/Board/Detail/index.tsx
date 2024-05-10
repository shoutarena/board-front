import React, {useEffect, useState} from 'react';
import './style.css'
import {CommentList, FavoriteList} from "../../../types/interface";
import Favorite from "../../../components/Favorite";
import FavoriteListMock from "mocks/favorite-list.mock";
import CommentListMock from "../../../mocks/comment-list.mock";
import Comment from "../../../components/Comment";
import Pagination from 'components/Pagination';
// * Component : Board Detail Display Component
export default function BoardDetail() {

    // * Component : Board Detail Top Component
    const BoardDetailTop = () => {

        return (
            <div id='board-detail-top'>
                <div className='board-detail-top-header'>
                    <div className='board-detail-title'>{`오늘 점심 뭐먹지?`}</div>
                    <div className='board-detail-top-sub-box'>
                        <div className='board-detail-write-info-box'>
                            <div className='board-detail-writer-profile-image'></div>
                            <div className='board-detail-writer-nickname'>{`Lamie`}</div>
                            <div className='board-detail-info-divider'>{`\|`}</div>
                            <div className='board-detail-write-date'>{`2022. 05. 12.`}</div>
                        </div>
                        <div className='icon-button'>
                            <div className='icon more-icon'></div>
                        </div>
                        <div className='board-detail-more-box'>
                            <div className='board-detail-update-button'>{'수정'}</div>
                            <div className='divider'></div>
                            <div className='board-detail-delete-button'>{'삭제'}</div>
                        </div>
                    </div>
                </div>
                <div className='divider'></div>
                <div className='board-detail-top-main'>
                    <div className='board-detail-main-text'>{`오늘 뭐 먹을지 고민된다...ㅠㅠ오늘 뭐 먹을지 고민된다...ㅠㅠ오늘 뭐 먹을지 고민된다...ㅠㅠ오늘 뭐 먹을지 고민된다...ㅠㅠ오늘 뭐 먹을지 고민된다...ㅠㅠ`}</div>
                    <div className='board-detail-main-image'></div>
                </div>
            </div>
        );
    }
    // * Component : Board Detail Bottom Component
    const BoardDetailBottom = () => {

        const [favoriteList, setFavoriteList] = useState<FavoriteList[]>();
        const [commentList, setCommentList] = useState<CommentList[]>();

        useEffect(() => {
            setFavoriteList(FavoriteListMock);
            setCommentList(CommentListMock);
        }, [])
        return (
            <div id='board-detail-bottom'>
                <div className='board-detail-bottom-box'>
                    <div className='board-detail-bottom-button-group'>
                        <div className='icon-button'>
                            <div className='icon favorite-fill-icon'></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`좋아요 ${12}`}</div>
                        <div className='icon-button'>
                            <div className='icon up-light-icon'></div>
                        </div>
                    </div>
                    <div className='board-detail-bottom-button-group'>
                        <div className='icon-button'>
                            <div className='icon comment-icon'></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`댓글 ${12}`}</div>
                        <div className='icon-button'>
                            <div className='icon up-light-icon'></div>
                        </div>
                    </div>
                </div>
                <div className='board-detail-bottom-favorite-box'>
                    <div className='board-detail-bottom-favorite-container'>
                        <div className='board-detail-bottom-favorite-title'>{'좋아요'}<span className='emphasis'>{'12'}</span></div>
                        <div className='board-detail-bottom-favorite-contents'>
                            {favoriteList?.map(item => <Favorite favoriteList={item} />)}
                        </div>
                    </div>
                </div>
                <div className='board-detail-bottom-comment-box'>
                    <div className='board-detail-bottom-comment-container'>
                        <div className='board-detail-bottom-comment-title'>{'댓글'}<span className='emphasis'>{'12'}</span></div>
                        <div className='board-detail-bottom-comment-list-container'>
                            {commentList?.map(item => <Comment commentList={item} />)}
                        </div>
                    </div>
                    <div className='divider'></div>
                    <div className='board-detail-bottom-comment-pagination-box'>
                        <Pagination />
                    </div>
                    <div className='board-detail-bottom-comment-input-container'>
                        <div className='board-detail-bottom-comment-input-container'>
                            <textarea className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' />
                            <div className='board-detail-bottom-comment-button-box'>
                                <div className='disable-button'>{'댓글달기'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
