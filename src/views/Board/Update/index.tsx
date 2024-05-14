import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './style.css'
import {useBoardStore, useLoginUserStore} from "../../../stores";
import {useNavigate, useParams} from "react-router-dom";
import {MAIN_PATH} from "../../../constant";
import {useCookies} from "react-cookie";
import {getBoardRequest} from "../../../apis";
import {GetBoardResponseDto} from "../../../apis/response/board";
import {ResponseDto} from "../../../apis/response";
import {Board, User} from "../../../types/interface";
import {convertUrlsToFile} from "../../../utils";

// * Component : Board update Display Component
export default function BoardUpdate() {

    // * state : 제목 영역 요소 참조 상태
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    // * state : 본문 영역 요소 참조 상태
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    // * state : 이미지 입력 요소 참조 상태
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    // * state : 게시물 번호 path variable 상태
    const { boardIdx } = useParams();

    // * function : 네비게이트 함수
    const navigator = useNavigate();

    // * state : 게시물 상태
    const { title, setTitle } = useBoardStore();
    const { content, setContent } = useBoardStore();
    const { boardImageFileList, setBoardImageFileList } = useBoardStore();

    // * state : 로그인 유저 상태
    const { loginUser } = useLoginUserStore();

    // * state : 쿠키 상태
    const [cookies, setCookies] = useCookies();

    // * state : 게시물 이미지 미리보기 url 상태
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    // * event handler : 제목 변경 event handler
    const onTitleChangeHandler = (event:ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setTitle(value);
        if(!titleRef.current) return;
        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
    // * event handler : 콘텐츠 변경 event handler
    const onContentChangeHandler = (event:ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setContent(value);
        if(!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
    // * event handler : 이미지 업로드 버튼 클릭 event handler
    const onImageUploadButtonClickHandler = () => {
        if(!imageInputRef.current) return;
        imageInputRef.current.click();
    }
    // * event handler: 이미지 변경 event handler
    const onImageChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files || !event.target.files.length) return;

        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        const newImageUrls = [...imageUrls, imageUrl];
        setImageUrls(newImageUrls);

        const newBoardImageFileList = [...boardImageFileList, file];
        setBoardImageFileList(newBoardImageFileList);
        if(!imageInputRef.current) return;
        imageInputRef.current.value = '';
    }
    // * event handler : 이미지 제거 버튼 클릭 event handler
    const onImageCloseButtonClickHandler = (deleteIndex: number) => {
        const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
        setImageUrls(newImageUrls);
        const newBoardImageFileList = boardImageFileList.filter((file, index) => index !== deleteIndex);
        setBoardImageFileList(newBoardImageFileList);
    }

    // * function : get board response function
    const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'NB') alert('존재하지 않는 게시물입니다.');
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code === 'NB' || code === 'DBE' || code !== 'SU'){
            navigator(MAIN_PATH());
            return;
        }
        const { title, content, boardImageList, writerEmail } = responseBody as GetBoardResponseDto;
        if(!loginUser || loginUser.email !== writerEmail){
            navigator(MAIN_PATH());
            return;
        }
        setTitle(title);
        setContent(content);
        convertUrlsToFile(boardImageList)
            .then(boardImageFileList => setBoardImageFileList(boardImageFileList));
        setImageUrls(boardImageList);
        if(!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }

    // * effect : 마운트시 실행할 effect
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if(!accessToken) {
            navigator(MAIN_PATH());
            return;
        }
        if(!boardIdx) return;
        getBoardRequest(boardIdx).then(getBoardResponse);
    }, [boardIdx]);

    // * Render: Board update Display Rendering
    return (
       <div id='board-update-wrapper'>
           <div className='board-update-container'>
               <div className='board-update-box'>
                   <div className='board-update-title-box'>
                       <textarea ref={titleRef} className='board-update-title-textarea' rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler} />
                   </div>
                   <div className='divider'></div>
                   <div className='board-update-content-box'>
                       <textarea ref={contentRef} className='board-update-content-textarea' placeholder='본문을 작성해주세요.' value={content} onChange={onContentChangeHandler} />
                       <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
                           <div className='icon image-box-light-icon'></div>
                       </div>
                       <input ref={imageInputRef} type='file' accept='image/*' className='display-none' onChange={onImageChangeHandler} />
                   </div>
                   <div className='board-update-images-box'>
                       {imageUrls.map((imageUrl, index) =>
                           <div className='board-update-image-box'>
                               <img className='board-update-image' src={imageUrl} />
                               <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                                   <div className='icon close-icon'></div>
                               </div>
                           </div>
                       )}
                   </div>
               </div>
           </div>
       </div>
    );
}
