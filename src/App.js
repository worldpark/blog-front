import './App.css';
import {useState} from "react";
import {Box, Container, Grid, Link} from "@mui/material";

function App() {

    let [title, setTitle] = useState('개발자 블로그');


    return (
        <div>
            <div className="black-nav">
                <h4>{title}</h4>
            </div>
            <Container>
                <Grid container spacing={2}>
                    <Grid item lg={4} xs={12}>
                        <Box display="flex" flexDirection={"row"}>

                            <Link href="#">menu1</Link>
                            <Link href="#">menu2</Link>
                            <Link href="#">menu3</Link>
                        </Box>
                    </Grid>
                    <Grid item lg={8} xs={12}>
                        content
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default App;
