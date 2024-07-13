import {Chip, Divider} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";


const BoardView = () => {

    const contentDiv = useRef();
    const {boardId} = useParams();

    const [boardData, setBoardData] = useState({});
    const [contentData, setContentData] = useState([]);
    const [hashTagData, setHashTagData] = useState([]);

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
            imgContent.src = "http://localhost:8080/boardImage/" + contentData.image_path + ".jpg";
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

    return (
        <>
            <div>
                <p style={{fontSize: '30px'}}>{boardData.board_title}</p>
                <Divider sx={{
                    my: 5
                }}/>
                <div ref={contentDiv}>
                </div>
                <div className='hash-tag-div' style={{marginTop: '40px'}}>
                    {
                        hashTagData.map((element) => {

                            return (
                                <>
                                    <Chip sx={{mx: 1}} label={element.hash_name}/>
                                </>
                            )

                        })
                    }
                </div>
            </div>
        </>
    )
}

export default BoardView;