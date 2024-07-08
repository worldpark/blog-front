import axios from "axios";
import {useEffect, useState} from "react";
import {Chip, Divider} from "@mui/material";


const Content = () => {

    const [boardList, setBoardList] = useState([]);

    const getBoardList = () => {

        let hashTagName = '';

        axios({
            method: "GET",
            url: "http://localhost:8080/board/getBoardList?hashTagName=" + hashTagName,
            withCredentials: true
        }).then((response) => {
            setBoardList(response.data);

        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        getBoardList();

    }, [])


    return(
        <div>
            {
                boardList.map((element, index) => {
                    return(
                        <div key={index}>
                            <h2>{element.boardTitle}</h2>
                            <p>
                                {element.boardContent}
                            </p>
                            {
                                element.hashTagList.map((tagElement, index) => {
                                    return(
                                        <Chip key={index} sx={{mx: 1}} label={tagElement}/>
                                    )
                                })
                            }
                            <Divider sx={{
                                my: 5
                            }}/>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Content;