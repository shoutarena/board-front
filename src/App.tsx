import React, {useState}  from 'react';
import './App.css';
import Board from 'components/Board';
import Top3 from 'components/Top3';
import Comment from 'components/Comment';
import Favorite from 'components/Favorite';
import InputBox from 'components/InputBox';
import { latestBoardListMock, top3BoardListMock, commentListMock, favoriteListMock } from 'mocks';

function App() {

    const [value, setValue] = useState<string>('');

    return (
        <>
            <InputBox label='이메일' type='text' placeholder='이메일 주소를 입력해 주세요' value={value} error={true} setValue={setValue} message='aaa' />
            {/*<div style={{ display: 'flex', columnGap: '30px', rowGap: '20px' }}>*/}
            {/*    { favoriteListMock.map( favoriteList => <Favorite favoriteList={favoriteList} /> ) }*/}
            {/*</div>*/}
            {/*<div style={{ padding: '0 20px', display:'flex', flexDirection: 'column', gap: '30px' }}>*/}
            {/*    {commentListMock.map(commentList => <Comment commentList={commentList} /> )}*/}
            {/*</div>*/}
            
            {/*<div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>*/}
            {/*    {top3BoardListMock.map(top3List => <Top3 top3List={top3List} />)}*/}
            {/*</div>*/}
            {/*{latestBoardListMock.map(boardList => <Board boardList={boardList} />)}*/}

        </>
    );
}

export default App;
