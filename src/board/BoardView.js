import {Button, Chip, createTheme, Divider, ThemeProvider} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";


const BoardView = () => {

    const navigate = useNavigate();

    const contentDiv = useRef();
    const {boardId} = useParams();

    const [boardData, setBoardData] = useState({});
    const [contentData, setContentData] = useState([]);
    const [hashTagData, setHashTagData] = useState([]);
    const [createTime, setCreateTime] = useState('');

    const createPost = (contentData) => {
        const postElement = document.createElement('div');

        if (contentData.board_type === 'text') {
            const textContent = document.createElement('p');
            textContent.style.height = '18px';
            textContent.textContent = contentData.board_content;
            postElement.appendChild(textContent);

        } else if (contentData.board_type === 'image') {
            const imgContent = document.createElement('img');
            imgContent.width = 500;
            imgContent.src = "http://localhost:8080/boardImage/" + contentData.image_path;
            postElement.appendChild(imgContent);
        }

        return postElement;
    }

    const getBoard = () => {

        axios({
            method: 'GET',
            url: 'http://localhost:8080/board/getBoardContent?boardId=' + boardId
        }).then((response) => {
            setBoardData(response.data);
            setContentData(response.data.board_content_list);
            setHashTagData(response.data.hashTags);

            let dateTime = new Date(response.data.create_time);
            setCreateTime(dateTime.toLocaleString());

        }).catch((error) => {
            alert(error.response.data.detail);

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
    }, []);

    const theme = createTheme({
        palette:{
            primary: {
                main: '#000'
            }
        }
    });

    return (
        <>
            <div>
                <p style={{fontSize: '30px', margin: '10px 0'}}>{boardData.board_title}</p>
                <div style={{display: 'flex'}}>
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
                        >
                            글 삭제
                        </Button>
                    </ThemeProvider>
                    <p style={{marginLeft: 'auto', fontSize: '10px'}}>생성일자 : {createTime}</p>
                </div>
                <Divider sx={{
                    mt: 2,
                    mb: 3
                }}/>
                <div ref={contentDiv}>
                </div>
                <div className='hash-tag-div' style={{margin: '40px, 0'}}>
                    {
                        hashTagData.map((element, index) => {

                            return (
                                <span key={index}>
                                    <Chip sx={{mx: 1}} label={element.hash_name}/>
                                </span>
                            )

                        })
                    }
                </div>
            </div>
        </>
    )
}

export default BoardView;