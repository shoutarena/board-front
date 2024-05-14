import ResponseDto from "../response.dto";
import {BoardList} from "../../../types/interface";

export default interface GetSearchBoardListResponseDto extends ResponseDto{
    searchList: BoardList[];
}
