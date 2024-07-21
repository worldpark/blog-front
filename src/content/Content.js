import axios from "axios";
import {useEffect, useRef, useState} from "react";
import {Button, createTheme, Divider, ThemeProvider} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";


const Content = () => {

    let navigate = useNavigate();

    const {hashName} = useParams();
    const [boardList, setBoardList] = useState([]);
    const [observerVisible, setObserverVisible] = useState(true);
    const observerRef = useRef();

    const loginInfo = useSelector((state) => state.loginInfo.value);
    const [visibleButton, setVisibleButton] = useState(true);

    useEffect(() => {
        if(loginInfo.status && loginInfo.auths.includes("ROLE_ADMIN")){
            setVisibleButton(true);
        }else{
            setVisibleButton(false);
        }

    }, [loginInfo]);

    let [pageNumber, setPageNumber] = useState(0);

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

            if(response.data.length === 0 || response.data === undefined){
                setObserverVisible(false);
            }else{
                setObserverVisible(true);

                setBoardList((prevBoardList) => [
                    ...prevBoardList,
                    ...response.data
                ]);

                setPageNumber((prevPageNumber) => prevPageNumber + 1);
            }

        }).catch((error) => {
            if(error.response.data.code != undefined){
                alert(error.response.data.detail);
            }else{
                alert('오류가 발생하였습니다.');
            }
        })
    }

    const onIntersection = (entries) => {

        const firstEntry = entries[0];

        if(firstEntry.isIntersecting && observerVisible){
            getBoardList();
        }

    };
    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection);

        if(observerRef.current){
            observer.observe(observerRef.current);
        }

        return () => {
            if(observerRef.current){
                observer.unobserve(observerRef.current);
            }
        }

    }, [pageNumber])

    const theme = createTheme({
       palette:{
           primary: {
               main: '#000'
           }
       }
    });

    return(
        <div>
            {
                visibleButton ?
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
                    : <></>
            }
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
                observerVisible ? <div id='observerId' ref={observerRef}>...loading</div> : <></>
            }
        </div>
    )
}

export default Content;