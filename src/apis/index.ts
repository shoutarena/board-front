import axios from "axios";
import {SignInRequestDto, SignUpRequestDto} from "./request/auth";
import {SignInResponseDto, SignUpResponseDto} from "./response/auth";
import ResponseDto from "./response/response.dto";
import GetSignInUserResponseDto from "./response/user/get-sign-in-user.response.dto";
import {PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto} from "./request/board";
import {
    DeleteBoardResponseDto,
    GetFavoriteListResponseDto,
    IncreaseViewCountResponseDto, PatchBoardResponseDto,
    PostBoardResponseDto,
    PutFavoriteResponseDto
} from "./response/board";
import GetBoardResponseDto from "./response/board/get-board.response.dto";
import GetCommentListResponseDto from "./response/board/get-comment-list.response.dto";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import PostCommentResponseDto from "./response/board/post-comment.response.dto";

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: String) => {
    return { headers : {Authorization: `Bearer ${accessToken}`} };
}

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

export const signInRequest = async (requestBody: SignInRequestDto) => {
    return await axios.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            const responseBody: SignInResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(response => {
            const responseBody: SignUpResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/member`;

export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.reponse) return null;
            const responseBody: ResponseDto = error.reponse.data;
            return responseBody;
        })
    return result;
}

const GET_BOARD_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}`;
const INCREASE_VIEW_COUNT_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardIdx: number| string) => `${API_DOMAIN}/board/${boardIdx}/comment-list`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const PATCH_BOARD_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}`;
const DELETE_BOARD_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}`;
const PUT_FAVORITE_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}/favorite`
const POST_COMMENT_URL = (boardIdx: number | string) => `${API_DOMAIN}/board/${boardIdx}/comment`

export const getBoardRequest = async (boardIdx: number | string) => {
    const result = await axios.get(GET_BOARD_URL(boardIdx))
        .then(response => {
            const responseBody: GetBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })

    return result;
}

export const increaseViewCountRequest = async (boardIdx: number | string) => {
    const result = await axios.patch(INCREASE_VIEW_COUNT_URL(boardIdx))
        .then(response => {
            const responseBody: IncreaseViewCountResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getFavoriteListRequest = async (boardIdx: number | string) => {
    const result = await axios.get(GET_FAVORITE_LIST_URL(boardIdx))
        .then(response => {
            const responseBody: GetFavoriteListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getCommentListRequest = async (boardIdx: number | string) => {
    const result = await  axios.get(GET_COMMENT_LIST_URL(boardIdx))
        .then(response => {
            const responseBody: GetCommentListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const deleteBoardRequest = async (boardIdx: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_URL(boardIdx), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
    const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const patchBoardRequest = async (requestBody: PatchBoardRequestDto, boardIdx:number | string, accessToken: string, ) => {
    const result = await axios.patch(PATCH_BOARD_URL(boardIdx), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const putFavoriteRequest = async (boardIdx: number | string, accessToken: string) => {
    const result = await axios.put(PUT_FAVORITE_URL(boardIdx), authorization(accessToken))
        .then(response => {
            const responseBody: PostBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}
export const postCommentRequest = async (requestBody: PostCommentRequestDto, boardIdx:number | string, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_URL(boardIdx), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostCommentResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;

const multipartFormData = { headers : { 'Content-Type' : 'multipart/form-data' } };

export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
    return result;
}
