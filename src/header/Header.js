import {useState} from "react";
import "./HeaderCSS.css";
import {Grid} from "@mui/material";
import LoginForm from "../loginForm/LoginForm";

const Header = () => {

    const [title, setTitle] = useState('개발자 블로그');
    const [loginPopup, setLoginPopup] = useState(false);

    const loginPopupOpen = () => {
        setLoginPopup(true);
    }

    const logonPopupClose = () => {
        setLoginPopup(false);
    }

    return (
        <>
            <div className="black-nav">
                <Grid container spacing={2}>
                    <Grid item xs={4} sx={{textAlign: 'center'}}>
                        <h4>{title}</h4>
                    </Grid>
                    <Grid item xs={8} sx={{textAlign: 'right', pr: '2vw'}}>
                        <div style={{height: '100%', display: 'flex', justifyContent: 'right'}}>
                            <h4 style={{cursor: 'pointer', display: 'inline'}} onClick={() => {loginPopupOpen() }}>owner login</h4>
                        </div>
                    </Grid>
                </Grid>
                <LoginForm
                    open={loginPopup}
                    onClose={logonPopupClose}
                />
            </div>
        </>
    )
}

export default Header;