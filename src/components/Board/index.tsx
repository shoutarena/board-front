import React from 'react';
import './style.css';
import { BoardList } from 'types/interface'
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from 'assets/image/default-profile-image.png'

// * interface: Board Component Properties
interface Props {
    boardList: BoardList
}

/**
 * * component : Board List Compponent
 */
export default function Board({boardList} : Props) {

    // * * State: Properties
    const { boardIdx, title, content, boardTitleImage} = boardList;
    const { favoriteCount, commentCount, viewCount} = boardList;
    const { regDt, nickname, profileImage } = boardList;

    // * function: 네비게이트 함수
    // * const navigator = useNavigate();

    // * event handler: 게시물 아이템 클릭 이벤트
    const onClickHandler = () => {
        // * navigator(boardIdx);
    }

    // * render: Board List 컴포넌트 렌더링
    return (
        <div className='board-list-item'>
            <div className='board-list-item-main-box'>
                <div className='board-list-item-top'>
                    <div className='board-list-item-profile-box'>
                        <div className='board-list-item-profile-image' style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
                    </div>
                    <div className='board-list-item-write-box'>
                        <div className='board-list-item-nickname'>{nickname}</div>
                        <div className='board-list-item-write-date'>{regDt}</div>
                    </div>
                </div>
                <div className='board-list-item-middle'>
                    <div className='board-list-item-title'>{title}</div>
                    <div className='board-list-item-content'>{content}</div>
                </div>
                <div className='board-list-item-bottom'>
                    <div className='board-list-item-counts'>{`댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}`}</div>
                </div>
            </div>
            {boardTitleImage !== null && (
                <div className='board-list-item-image-box'>
                    <div className='board-list-item-image' style={{backgroundImage: `url(${boardTitleImage})`}}></div>
                </div>
            )}
        </div>
    );
}
