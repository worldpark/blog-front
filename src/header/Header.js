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

        axios({
            url: 'http://localhost:8080/check-session',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then((response) => {

            if(response.status === 200){

                if(response.data.code === '100' || response.data.code === '101'){
                    console.log(response.data.message);

                }else{
                    dispatch(login({
                        userId: response.data.userId,
                        auths: response.data.auths,
                        status: true
                    }));
                }

            }

        }).catch(() => {
            console.log('세션 체크 실패');
        })

    }, []);

    const logoutFunction = () => {
        axios({
            url: "http://localhost:8080/logout",
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then(() => {
            dispatch(logout());
            document.location.reload();

        }).catch(() => {
            alert('로그아웃에 실패하였습니다.');

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
                                        <h4 style={{cursor: 'pointer', display: 'inline', marginLeft: '20px'}} onClick={() => {logoutFunction() }}>Logout</h4>
                                    </> :
                                    <>
                                        <h4 style={{cursor: 'pointer', display: 'inline'}} onClick={() => {loginPopupOpen() }}>Login</h4>
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