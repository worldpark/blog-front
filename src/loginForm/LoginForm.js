import {Box, Button, createTheme, Dialog, DialogTitle, FormLabel, TextField, ThemeProvider} from "@mui/material";
import {grey} from "@mui/material/colors";
import {useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";

const LoginForm = (props) => {

    const {onClose, open} = props;

    const [userId, setUserId] = useState('');
    const [userPW, setUserPW] = useState('');

    const serverUrl = useSelector((state)=> state.serverUrl.value);

    const theme = createTheme({
        palette: {
            buttonColor: {
                main: grey[900],
                light: grey[900],
                dark: grey[600],
                contrastText: '#fff'
            }
        }
    })

    const login = () => {
        let loginParam = {
            username: userId,
            password: userPW
        }

        axios({
            method: 'POST',
            url: serverUrl.url + '/login/login-proc',
            data: loginParam,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            withCredentials: true
        }).then(() => {
            onClose();
            document.location.reload();

        }).catch((error) => {
            try{
                alert(error.response.data.detail);
            }catch (err){
                alert('오류가 발생하였습니다.');
            }
        })
    }

    return(
        <Dialog open={open} onClose={onClose}>
            <Box display="flex" flexDirection={'column'} sx={{mx: '70px'}}>
                <DialogTitle>Login Form</DialogTitle>

                <Box display="flex" flexDirection={'column'}>
                    <FormLabel>ID</FormLabel>
                    <TextField id="outlined-basic" variant="outlined" size='small' sx={{width: '400px'}} value={userId} onChange={(event) => setUserId(event.target.value)}/>
                </Box>

                <Box display="flex" flexDirection={'column'} sx={{mb: '30px'}}>
                    <FormLabel style={{marginTop: '20px'}}>PW</FormLabel>
                    <TextField id="outlined-basic" type="password" variant="outlined" size='small' sx={{width: '400px'}} value={userPW} onChange={(event) => setUserPW(event.target.value)}/>
                </Box>

                <ThemeProvider theme={theme}>
                    <Button variant="contained" color='buttonColor' disableElevation sx={{my: '30px'}} size='large' onClick={() => login()}>
                        Login
                    </Button>
                </ThemeProvider>

            </Box>

        </Dialog>
    )
}

export default LoginForm;