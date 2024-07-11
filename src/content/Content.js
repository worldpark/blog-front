import axios from "axios";
import {useEffect, useState} from "react";
import {Divider} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";


const Content = () => {

    let navigate = useNavigate();

    const {hashName} = useParams();
    const [boardList, setBoardList] = useState([]);

    const getBoardList = () => {

        let hashTagName = '';

        if(hashName !== undefined){
            hashTagName = hashName;
        }

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
                            <div style={{height: "200px"}} onClick={() => navigate('/boardView/' + element.board_id)}>
                                <h2>{element.board_title}</h2>
                                <p>
                                    {element.preview_content}
                                </p>
                            </div>
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