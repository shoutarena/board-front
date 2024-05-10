import React from 'react';
import { CommentList } from 'types/interface';
import defaultProfileImage from 'assets/image/icon/default-profile-image.png'
import './style.css';
import dayjs from 'dayjs';

// * interface: Comment Component Properties
interface Props {
    commentList: CommentList;
}

// * Compponent: Comment List Component
export default function Comment({commentList}: Props) {

    // * State: Properties
    const { nickname, profileImage, content, regDt } = commentList;

    // * function : 작성일 경과시간 함수
    const getElapsedTime = () => {
        const now = dayjs().add(9, 'hour');
        const writeTime = dayjs(regDt);
        const gap = now.diff(writeTime, 's');
        if(gap < 60) return `${gap}초 전`;
        if(gap < 3600) return `${Math.floor(gap / 60)}분 전`;
        if(gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;
        return `${Math.floor(gap / 86400)}일 전`
    }

    // * Render: Comment List Rendering
    return (
       <div className='comment-list-item'>
           <div className='comment-list-item-top'>
               <div className='comment-list-item-profile-box'>
                   <div  className='comment-list-item-profile-image' style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
               </div>
               <div className='comment-list-item-nickname'>{nickname}</div>
               <div className='comment-list-item-divider'>{`\|`}</div>
               <div className='comment-list-item-time'>{getElapsedTime()}</div>
           </div>
           <div className='comment-list-item-main'>
               <div className='comment-list-item-content'>{content}</div>
           </div>
       </div>
    );
}
