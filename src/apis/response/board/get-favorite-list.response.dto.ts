import ResponseDto from "../response.dto";
import {FavoriteList} from "../../../types/interface";

export default interface GetFavoriteListResponseDto extends ResponseDto{
    favoriteList: FavoriteList[]
}
