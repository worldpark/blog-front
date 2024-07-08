import './App.css';
import {Box, Container, Grid, Link} from "@mui/material";
import HomeSideMenu from "./menu/HomeSideMenu";
import Header from "./header/Header";
import Content from "./content/Content";

function App() {


    return (
        <div>
            <Header/>
            <Container sx={{pt:20}}>
                <Grid container spacing={2}>
                    <Grid item lg={4} xs={12}>
                        <HomeSideMenu/>
                    </Grid>
                    <Grid item lg={8} xs={12}>
                        <Content/>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default App;
