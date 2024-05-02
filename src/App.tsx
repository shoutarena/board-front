import React from 'react';
import './App.css';
import Board from 'components/Board'
import { latestBoardListMock } from 'mocks';

function App() {
    return (
        <>
            {latestBoardListMock.map(boardList => <Board boardList={boardList} />)}

        </>
    );
}

export default App;
