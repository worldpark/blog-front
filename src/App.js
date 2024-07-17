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

function App() {

    const sideMenuRef = useRef();

    const menuRefresh = () => {
        sideMenuRef.current.getHashTagList();
    }

    return (
        <div>
            <Header/>
            <Container sx={{pt:20}}>
                <Grid container spacing={2}>
                    <Grid item lg={4} xs={12}>
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
                                <BoardView/>
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
