import ResponseDto from "apis/response/response.dto";
import { User } from "types/interface";

export default interface GetSignInUserResponseDto extends ResponseDto, User {
}
