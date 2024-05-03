import React from 'react';
import './style.css'
import insta from 'assets/image/insta.png'
import logoLight from 'assets/image/logo-light.png'
import naverBlog from 'assets/image/naver-blog.png'

/**
 * * Component: Footer Layout
 */
export default function Footer() {

    // * Event Handler: 인스타 아이콘 버튼 클릭 이벤트 처리
    const onInstaIconButtonClickHandler = () => {
        window.open('https://www.instagram.com');
    }

    // * Event Handler: 네이버 블로그 버튼 클릭 이벤트 처리
    const onNaverBlogIconButtonClickHandler = () => {
        window.open('https://blog.naver.com');
    }

    // * Render: Footer Render
    return (
       <div id='footer'>
           <div className='footer-container'>
               <div className='footer-top'>
                   <div className='footer-logo-box'>
                       <div className='icon-box'>
                           <div className='icon logo-light-icon'></div>
                       </div>
                       <div className='footer-logo-text'>{`Kei's Board`}</div>
                   </div>
                   <div className='footer-link-box'>
                       <div className='footer-email-link'>{`flyskwon@naver.com`}</div>
                       <div className='icon-button' onClick={onInstaIconButtonClickHandler}>
                           <div className='icon insta-icon'></div>
                       </div>
                       <div className='icon-button' onClick={onNaverBlogIconButtonClickHandler}>
                           <div className='icon naver-blog-icon'></div>
                       </div>
                   </div>
               </div>
               <div className='footer-bottom'>
                   <div className='footer-copyright'>{`Copyright ⓒ 2024 Kei. All Rights Reserved.`}</div>
               </div>
           </div>
       </div>
    );
}
