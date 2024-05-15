import ResponseDto from "../response.dto";
import {BoardList} from "../../../types/interface";

export default interface GetUserBoardListResponseDto extends ResponseDto{
    memberBoardList: BoardList[];
}
