import {Divider} from "@mui/material";
import {useEffect, useRef} from "react";
import content from "../content/Content";


const BoardView = () => {

    const contentDiv = useRef();

    const createPost = (contentData) => {
        const postElement = document.createElement('div');

        if(contentData.content_type === 'text'){
            const textContent = document.createElement('p');
            textContent.textContent = contentData.board_content;
            postElement.appendChild(textContent);

        }else if(contentData.content_type === 'image'){
            const imgContent = document.createElement('img');
            imgContent.src = "http://localhost:8080/boardImage/" + contentData.image_path + ".jpg";
            postElement.appendChild(imgContent);
        }

        return postElement;
    }

    useEffect(() => {

    }, []);

    return(
        <>
            <div>
                <p style={{fontSize: '30px'}}>게시글 제목</p>
                <Divider sx={{
                    my: 5
                }}/>
                <div ref={contentDiv}>
                </div>
            </div>
        </>
    )
}

export default BoardView;