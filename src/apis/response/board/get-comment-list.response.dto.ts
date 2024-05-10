import ResponseDto from "../response.dto";
import {CommentList} from "types/interface";

export default interface GetCommentListResponseDto extends ResponseDto{
    commentList: CommentList[]
}
