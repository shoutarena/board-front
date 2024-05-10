export default interface Board {
    boardIdx: number;
    title: string;
    content: string;
    boardImageList: string[];
    regDt: string;
    writerEmail: string;
    writerNickname: string;
    writerProfileImage: string | null;
}
