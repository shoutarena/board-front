import {useEffect, useState} from "react";

const usePagination = <T>(pageSize: number) => {
    // * state : total object list state
    const [totalList, setTotalList] = useState<T[]>();
    // * state : view object list state
    const [viewList, setViewList] = useState<T[]>();
    // * state : current page number state
    const [currentPage, setCurrentPage] = useState<number>(1);
    // * state : total page list state
    const [totalPageList, setTotalPageList] = useState<number[]>([1]);
    // * state : view page number list state
    const [viewPageList, setViewPageList] = useState<number[]>([1]);
    // * state : current section state
    const [currentSection, setCurrentSection] = useState<number>(1);
    // * state : total section state
    const [totalSection, setTotalSection] = useState<number>(1);

    // * function : 보여줄 객체 리스트 추출 함수
    const setView = () => {
        if(!totalList) return;
        const FIRST_INDEX = pageSize * (currentPage - 1);
        const LAST_INDEX = totalList.length > pageSize * currentPage ? pageSize * currentPage : totalList.length;
        const viewList = totalList?.slice(FIRST_INDEX, LAST_INDEX);
        setViewList(viewList);
    }
    // * function : 보여줄 페이지 리스트 추출 함수
    const setViewPage = () => {
        const FIRST_INDEX = 10 * (currentSection - 1);
        const LAST_INDEX = totalPageList.length > 10 * currentSection ? 10 * currentSection : totalPageList.length;
        const viewPageList = totalPageList.slice(FIRST_INDEX, LAST_INDEX);
        setViewPageList(viewPageList);
    }

    // * effect : total list 변경 될대 마다 실행할 작업
    useEffect(() => {
        if(!totalList) return;

        const totalPage = Math.ceil(totalList.length / pageSize);

        // const totalPageList: number[] = Array.apply(null, Array(totalPage)).map((_, i) => i + 1);
        const totalPageList = [];
        for(let page = 1; page <= totalPage; page ++) totalPageList.push(page);
        setTotalPageList(totalPageList);

        const totalSection = Math.ceil( totalList.length / (pageSize * 10) );
        setTotalSection(totalSection);

        setCurrentPage(1);
        setCurrentSection(1);

        setView();
        setViewPage();

    }, [totalList]);

    // * effect : current page 가 변경될때 마다 실행할 작업
    useEffect(setView, [currentPage]);
    // * effect : current section이 변경될때 마다 실행할 작업
    useEffect(setViewPage, [currentPage]);

    return {
        currentPage,
        setCurrentPage,
        currentSection,
        setCurrentSection,
        viewList,
        viewPageList,
        totalSection,
        setTotalList
    }
}

export default usePagination;
