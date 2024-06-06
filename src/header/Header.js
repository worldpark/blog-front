import {useState} from "react";
import "./HeaderCSS.css";
import {Grid} from "@mui/material";
import HomeSideMenu from "../menu/HomeSideMenu";

const Header = () => {

    let [title, setTitle] = useState('개발자 블로그');

    return (
        <>
            <div className="black-nav">
                <Grid container spacing={2}>
                    <Grid item xs={4} sx={{textAlign: 'center'}}>
                        <h4>{title}</h4>
                    </Grid>
                    <Grid item xs={8} sx={{textAlign: 'right', pr: '2vw'}}>
                        <h4>login</h4>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default Header;