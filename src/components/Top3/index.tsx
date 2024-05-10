import React from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/icon/default-profile-image.png';
import { BoardList } from 'types/interface';
import { useNavigate } from 'react-router-dom';

// * interface: Top3 Component Properties
interface Props {
    top3List: BoardList
}

// * Component: Top 3 List Item Component
export default function Top3({ top3List }: Props) {

    // * State: Properties
    const { boardIdx, title, content, boardTitleImage } = top3List;
    const { favoriteCount, commentCount, viewCount } = top3List;
    const { regDt, nickname, profileImage } = top3List;

    // * Function: 네비게이트 함수
    // const navigator = useNavigate();

    // * Event Handler : 게시물 아이템 클릭 이벤트 처리 함수
    const onClickHandler = () => {
        // navigator(boardIdx);
    }

    // * Render: Top 3 List Item Rendering
    return (
       <div className='top-3-list-item' style={{ backgroundImage: `url(${boardTitleImage})`}} onClick={onClickHandler}>
           <div className='top-3-list-item-main-box'>
               <div className='top-3-list-item-top'>
                   <div className='top-3-list-item-profile-box'>
                       <div className='top-3-list-item-profile-image' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
                   </div>
                   <div className='top-3-list-item-writer-box'>
                       <div className='top-3-list-item-nickname'>{nickname}</div>
                       <div className='top-3-list-item-write-date'>{regDt}</div>
                   </div>
               </div>
               <div className='top-3-list-item-middle'>
                   <div className='top-3-list-item-title'>{title}</div>
                   <div className='top-3-list-item-content'>{content}</div>
               </div>
               <div className='top-3-list-item-bottom'>
                   <div className='top-3-list-item-counts'>
                       {`댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}`}
                   </div>
               </div>
           </div>

       </div>
    );
}
