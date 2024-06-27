import {useEffect, useState} from "react";
import "./HeaderCSS.css";
import {Grid} from "@mui/material";
import LoginForm from "../loginForm/LoginForm";
import {useDispatch, useSelector} from "react-redux";
import {login, logout} from "../redux/features/loginSlice";
import axios from "axios";

const Header = () => {

    const [title, setTitle] = useState('개발자 블로그');
    const [loginPopup, setLoginPopup] = useState(false);

    const loginInfo = useSelector((state) => state.loginInfo.value);
    const dispatch = useDispatch();

    const loginPopupOpen = () => {
        setLoginPopup(true);
    }

    const logonPopupClose = () => {
        setLoginPopup(false);
    }

    useEffect(() => {
        let status;

        axios({
            url: 'http://localhost:8080/check-session',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then((response) => {
            status = {
                userId: response.data,
                status: true,
                code: ''
            }

            dispatch(login({
                userId: status.userId,
                status: status.status
            }));

        }).catch((error) => {
            let code = '';

            if (error.response.data.code === 'INVALID_SESSION') {
                code = error.response.data.code;
            } else {
                console.log(error);
            }

            status = {
                userId: '',
                status: false,
                code: code
            }

            dispatch(logout());

        })

    }, []);

    const logout = () => {
        axios({
            url: "http://localhost:8080/logout",
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then((response) => {
            console.log(response.data);
            dispatch(logout());

        }).catch((error) => {
            console.log(error);
        });
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
                            {
                                loginInfo.status ?
                                    <>
                                        <h4>사용자 : {loginInfo.userId}</h4>
                                        <h4 style={{cursor: 'pointer', display: 'inline', marginLeft: '20px'}} onClick={() => {logout() }}>Logout</h4>
                                    </> :
                                    <>
                                        <h4 style={{cursor: 'pointer', display: 'inline'}} onClick={() => {loginPopupOpen() }}>Owner Login</h4>
                                    </>
                            }
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