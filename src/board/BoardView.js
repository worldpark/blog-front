import {Button, Chip, createTheme, Divider, ThemeProvider} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import './Board.css';


const BoardView = ({refresh}) => {

    const navigate = useNavigate();

    const contentDiv = useRef();
    const {boardId} = useParams();

    const [boardData, setBoardData] = useState({});
    const [contentData, setContentData] = useState([]);
    const [hashTagData, setHashTagData] = useState([]);
    const [createTime, setCreateTime] = useState('');

    const loginInfo = useSelector((state) => state.loginInfo.value);
    const serverUrl = useSelector((state) => state.serverUrl.value);
    const [visibleButton, setVisibleButton] = useState(false);

    const [commentContents, setCommentContents] = useState('');
    const [commentPassword, setCommentPassword] = useState('');
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
        if (loginInfo.status && loginInfo.auths.includes("ROLE_ADMIN")) {
            setVisibleButton(true);
        } else {
            setVisibleButton(false);
        }

    }, [loginInfo]);

    const createPost = (contentData) => {
        const postElement = document.createElement('div');

        if (contentData.board_type === 'text') {
            const textContent = document.createElement('p');
            textContent.style.minHeight = '18px';
            textContent.textContent = contentData.board_content;
            postElement.appendChild(textContent);

        } else if (contentData.board_type === 'image') {
            const imgContent = document.createElement('img');
            imgContent.width = 500;
            imgContent.src = serverUrl.url + "/boardImage/" + contentData.image_path;
            postElement.appendChild(imgContent);
        }

        return postElement;
    }

    const getBoard = () => {

        axios({
            method: 'GET',
            url: serverUrl.url + '/board/getBoardContent?boardId=' + boardId
        }).then((response) => {
            setBoardData(response.data);
            setContentData(response.data.board_content_list);
            setHashTagData(response.data.hashTags);

            let dateTime = new Date(response.data.create_time);
            setCreateTime(dateTime.toLocaleString());

        }).catch((error) => {
            try{
                alert(error.response.data.detail);
            }catch (err){
                alert('오류가 발생하였습니다.');
            }

        })
    }
    useEffect(() => {

        contentData.forEach((content) => {
            const contentElement = createPost(content);
            contentDiv.current.appendChild(contentElement);
        });

    }, [contentData]);

    useEffect(() => {
        getBoard();
        getComment();
    }, []);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#000'
            }
        }
    });

    const deleteBoard = () => {
        let data = {
            boardId: boardId
        }

        axios({
            method: 'DELETE',
            url: serverUrl.url + '/board/boardDelete',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            data: data
        }).then(() => {
            refresh();
            navigate('/');
        }).catch((error) => {
            try{
                alert(error.response.data.detail);
            }catch (err){
                alert('오류가 발생하였습니다.');
            }
        })
    }

    const getComment = () => {
        axios({
            method: "GET",
            url: serverUrl.url + "/board/getComment?boardId=" + boardId
        }).then((response) => {
            setCommentList(response.data);

        }).catch((error) => {
            try{
                alert(error.response.data.detail);
            }catch (err){
                alert('오류가 발생하였습니다.');
            }
        })
    }

    const setComment = (parentId = null) => {

        if(commentPassword === null || commentPassword === ''){
            alert('암호를 입력해주세요.');
            return;
        }

        let pushData = {
            boardId: boardId,
            parentId: parentId,
            commentContents: commentContents,
            commentPassword: commentPassword
        }

        axios({
            method: 'POST',
            url: serverUrl.url + '/board/insertComment',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            data: pushData
        }).then(() => {
            setCommentContents('');
            setCommentPassword('');
            getComment();

        }).catch((error) => {
            try{
                alert(error.response.data.detail);
            }catch (err){
                alert('오류가 발생하였습니다.');
            }
        })

    }

    const deleteComment = (commentId) => {

        let commentDeletePW = document.getElementById('commentDeletePW' + commentId);

        const pushData = {
            commentId: commentId,
            commentPassword: commentDeletePW.value
        }

        commentDeletePW.value = null;
        axios({
            method: 'DELETE',
            url: serverUrl.url + '/board/deleteComment',
            headers: {
                'Content-Type': 'application/json'
            },
            data: pushData
        }).then((response) => {
            if(response.data.code === '201'){
                alert(response.data.message);
            }else{
                getComment();
            }

        }).catch((error) => {
            try{
                alert(error.response.data.detail);
            }catch (err){
                alert('오류가 발생하였습니다.');
            }
        })
    }

    const blindComment = (commentId) => {

        const pushData = {
            commentId: commentId,
        }

        axios({
            method: 'PUT',
            url: serverUrl.url + '/board/blindComment',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            data: pushData
        }).then(() => {
            getComment();
        }).catch((error) => {
            try{
                alert(error.response.data.detail);
            }catch (err){
                alert('오류가 발생하였습니다.');
            }
        })
    }

    return (<>
        <div>
            <p style={{fontSize: '30px', margin: '10px 0'}}>{boardData.board_title}</p>
            <div style={{display: 'flex'}}>
                {visibleButton ? <>
                    <ThemeProvider theme={theme}>
                        <Button variant="contained"
                                color='primary'
                                style={{fontSize: 'calc(2px + 1vmin)'}}
                                size="small"
                                onClick={() => navigate('/boardUpdate/' + boardData.board_id)}
                        >
                            글 수정
                        </Button>
                        <Button variant="contained"
                                color='primary'
                                style={{fontSize: 'calc(2px + 1vmin)', marginLeft: '6px'}}
                                size="small"
                                onClick={() => deleteBoard()}
                        >
                            글 삭제
                        </Button>
                    </ThemeProvider>
                </> : <></>}
                <p style={{marginLeft: 'auto', fontSize: '10px'}}>생성일자 : {createTime}</p>
            </div>

            <Divider sx={{
                mt: 2, mb: 3
            }}/>
            <div ref={contentDiv}>
            </div>
            <div className='hash-tag-div' style={{margin: '40px, 0'}}>
                {hashTagData.map((element, index) => {

                    return (
                        <span key={index}>
                            <Chip sx={{mx: 1}} label={element.hash_name}/>
                        </span>
                    )

                })}
            </div>

            <div className={'comment-write-area'}>
                <div style={{whiteSpace: 'nowrap'}}>
                    <p>사용자</p>
                    <p>댓글</p>
                </div>
                <div style={{margin: '0 25px', border: '1px lightgray solid'}}>
                </div>
                <div style={{width: '100%'}}>
                    <p>{loginInfo.userId}</p>
                    <form>
                        <input style={{marginBottom: '16px'}} type={'password'} placeholder={'암호를 입력하세요.'} autoComplete="off"
                               value={commentPassword} onChange={(event) => setCommentPassword(event.target.value)}/>
                    </form>
                    <textarea className={'comment-textarea'} placeholder={'댓글을 작성하세요.'}
                              value={commentContents} onChange={(event) => setCommentContents(event.target.value)}/>
                    <Divider sx={{
                        my: 2
                    }}/>

                    <div style={{display: 'flex'}}>
                        <ThemeProvider theme={theme}>
                            <Button variant="contained"
                                    color='primary'
                                    style={{fontSize: 'calc(2px + 1vmin)', marginLeft: 'auto'}}
                                    size="small"
                                    onClick={()=>setComment()}
                            >
                                댓글 등록
                            </Button>
                        </ThemeProvider>
                    </div>
                </div>
            </div>

            <div className={'comment-view-area'}>

                {
                    commentList.map((comment, index) => {

                        if(comment.status == 'active'){

                            return(
                                <div key={index}>
                                    <div className={'comment-view'}>
                                        <div style={{whiteSpace: 'nowrap'}}>
                                            {comment.createId}
                                            <p style={{fontSize: '0.7rem'}}>{comment.ip}</p>
                                            <p style={{fontSize: '0.7rem'}}>{new Date(comment.createTime).toLocaleString()}</p>
                                        </div>
                                        <div style={{margin: '0 25px', border: '1px lightgray solid'}}/>
                                        <div style={{width: '100%'}}>
                                            <div style={{minHeight: '72px', whiteSpace: 'pre'}}>
                                                {comment.commentContents}
                                            </div>
                                            <div style={{display: 'flex', width: '100%', height: '28px', marginTop: '10px'}}>
                                                <div style={{marginLeft: 'auto', display: 'flex'}}>
                                                    <form>
                                                        <input type={'password'} placeholder={'암호를 입력하세요.'}
                                                               id={'commentDeletePW' + comment.commentId} autoComplete="off"/>
                                                    </form>

                                                    <ThemeProvider theme={theme}>
                                                        {
                                                            loginInfo.auths == 'ROLE_ADMIN' ?
                                                                <Button variant="contained"
                                                                        color='primary'
                                                                        sx={{ml: 2}}
                                                                        size="small"
                                                                        onClick={() => blindComment(comment.commentId)}
                                                                >
                                                                    블라인드
                                                                </Button> : <></>
                                                        }
                                                        <Button variant="contained"
                                                                color='primary'
                                                                sx={{ml: 2}}
                                                                size="small"
                                                                onClick={() => deleteComment(comment.commentId)}
                                                        >
                                                            댓글 삭제
                                                        </Button>
                                                    </ThemeProvider>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <Divider sx={{
                                        my: 2
                                    }}/>
                                </div>
                            )
                        }else if(comment.status === 'blind'){
                            return (
                                <div key={index}>
                                    <div className={'comment-view'}>
                                        블라인드된 댓글입니다.
                                    </div>

                                    <Divider sx={{
                                        my: 2
                                    }}/>
                                </div>
                            )
                        }
                    })
                }


            </div>
        </div>
    </>)
}

export default BoardView;