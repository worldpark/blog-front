import './App.css';
import {Container, Grid} from "@mui/material";
import HomeSideMenu from "./menu/HomeSideMenu";
import Header from "./header/Header";
import Content from "./content/Content";
import {Route, Routes} from "react-router-dom";
import BoardView from "./board/BoardView";
import BoardWrite from "./board/BoardWrite";
import {useRef} from "react";
import BoardUpdate from "./board/BoardUpdate";
import {useSelector} from "react-redux";

function App() {

    const sideMenuRef = useRef();

    const menuRefresh = () => {
        sideMenuRef.current.getHashTagList();
    }

    const loginInfo = useSelector((state) => state.loginInfo.value);

    return (
        <div>
            <Header/>
            <Container sx={{py:20}}>
                <Grid container spacing={2}>
                    <Grid item lg={4} xs={12}>
                        <div className={'user-status-div'}>
                            <div style={{width: '100%'}}>
                                <p>사용자</p>
                                <p>역할</p>
                            </div>
                            <div style={{width: '100%'}}>
                                <p>: {loginInfo.userId}</p>
                                <p>: {loginInfo.auths}</p>
                            </div>
                        </div>
                        <HomeSideMenu ref={sideMenuRef}/>
                    </Grid>
                    <Grid item lg={8} xs={12}>
                        <Routes>
                            <Route path="/" element={
                                <Content />
                            }/>

                            <Route path="/hashtag/:hashName" element={
                                <Content/>
                            }/>

                            <Route path="/boardView/:boardId" element={
                                <BoardView refresh={menuRefresh}/>
                            }/>

                            <Route path="/boardWrite" element={
                                <BoardWrite refresh={menuRefresh}/>
                            }/>

                            <Route path="/boardUpdate/:boardId" element={
                                <BoardUpdate refresh={menuRefresh}/>
                            }/>
                        </Routes>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default App;
