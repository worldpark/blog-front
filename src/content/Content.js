import axios from "axios";
import {useEffect, useState} from "react";
import {Button, createTheme, Divider, ThemeProvider} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";


const Content = () => {

    let navigate = useNavigate();

    const {hashName} = useParams();
    const [boardList, setBoardList] = useState([]);
    const [observerVisible, setObserverVisible] = useState(true);

    let pageNumber = 0;
    const getBoardList = () => {

        let hashTagName = '';

        if(hashName !== undefined){
            hashTagName = hashName;
        }

        axios({
            method: "GET",
            url: "http://localhost:8080/board/getBoardList?hashTagName=" + hashTagName + "&pageNumber=" + pageNumber,
            withCredentials: true
        }).then((response) => {

            if(response.data == 0 || response.data == undefined){
                setObserverVisible(false);
            }

            let copy = [...boardList, ...response.data];
            setBoardList(copy);

        }).catch((error) => {
            alert(error.response.data.message);
        })
    }

    useEffect(() => {
        getBoardList();

    }, [])

    const theme = createTheme({
       palette:{
           primary: {
               main: '#000'
           }
       }
    });

    return(
        <div>
            <div>
                <ThemeProvider theme={theme}>
                    <Button variant="contained"
                            color='primary'
                            style={{fontSize: 'calc(5px + 1vmin)'}}
                            onClick={()=> navigate('/boardWrite')}
                    >
                        글 작성
                    </Button>
                </ThemeProvider>
            </div>
            {
                boardList.length > 0 ?
                boardList.map((element, index) => {
                    return(
                        <div key={index}>
                            <div style={{height: "200px", cursor: "pointer"}} onClick={() => navigate('/boardView/' + element.board_id)}>
                                <h2>
                                    {element.board_title}
                                </h2>
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
                : <div style={{marginTop: '20px'}}>게시글이 없습니다.</div>
            }
            {
                observerVisible ? <div>observer</div> : <></>
            }
        </div>
    )
}

export default Content;