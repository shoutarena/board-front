export default interface BoardList {
    boardIdx: number;
    title: string;
    content: string;
    boardTitleImage: string | null;
    favoriteCount: number;
    commentCount: number;
    viewCount: number;
    regDt: string;
    nickname: string;
    profileImage: string | null;
}
