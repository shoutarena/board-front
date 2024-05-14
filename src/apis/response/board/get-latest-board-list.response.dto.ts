import ResponseDto from "../response.dto";
import {Board, BoardList} from "../../../types/interface";

export default interface GetLatestBoardListResponseDto extends ResponseDto{
    latestList: BoardList[];
}
