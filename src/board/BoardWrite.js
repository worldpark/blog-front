import {Button, Chip, createTheme, Divider, Popover, TextField, ThemeProvider, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import './Board.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


const BoardWrite = ({refresh}) => {

    const navigate = useNavigate();
    const contentDiv = useRef();
    const [hashTag, setHashTag] = useState('');
    const [hashTagList, setHashTagList] = useState([]);
    const [title, setTitle] = useState('');

    const imageFileInput = useRef();

    const loginInfo = useSelector((state) => state.loginInfo.value);
    const serverUrl = useSelector((state)=> state.serverUrl.value);

    useEffect(() => {
        if (!loginInfo.status || !loginInfo.auths.includes("ROLE_ADMIN")) {
            alert('접근 권한이 없습니다.');
            navigate('/');
        }

    }, [loginInfo]);

    const contentList = () => {

        const elements = contentDiv.current.childNodes;
        const result = [];
        let order = 1;

        elements.forEach((element) => {
            let tagType = element.tagName;
            let data = {};
            data.content_order = order;

            if (tagType === undefined) {
                data.content_type = 'text';
                data.board_content = element.data;
            } else if (tagType.toLowerCase() === 'div') {
                data.content_type = 'text';
                data.board_content = element.textContent;
            } else if (tagType.toLowerCase() === 'img') {

                data.content_type = 'image';
                data.image_path = element.getAttribute('name');
            } else {
                return;
            }
            order += 1;
            result.push(data);
        })

        return result;
    }

    let imageDataList = [];

    const readImage = (inputEvent) => {

        let image = inputEvent.target;

        if (image.files && image.files[0]) {
            imageDataList.push(image.files[0]);

            const uploadImage = document.createElement('img');
            uploadImage.width = 500;
            uploadImage.style.display = 'block';
            let imageData = image.files[0];

            uploadImage.setAttribute("name", image.files[0].name);

            let reader = new FileReader();
            reader.readAsDataURL(imageData);

            reader.onload = () => {
                uploadImage.src = reader.result;
            };

            contentDiv.current.appendChild(uploadImage);
        }

    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#000'
            }
        }
    });

    const [duplicationBool, setDuplicationBool] = useState(null);
    const open = Boolean(duplicationBool);
    const id = open ? 'simple-popover' : undefined;

    const pushHashTag = (event) => {
        let copy = [...hashTagList];

        if (copy.includes(hashTag)) {
            popoverOpen(event);
        } else {
            copy.push(hashTag);
            setHashTag('');
            setHashTagList(copy);
        }

    }

    const deleteHashTag = (index) => {
        let copy = [...hashTagList];
        copy.splice(index, 1);
        setHashTagList(copy);

    }

    const popoverOpen = (event) => {
        setDuplicationBool(event.currentTarget);
    }
    const popoverClose = () => {
        setDuplicationBool(null);
    }

    const createBoard = () => {

        const contents = contentList();

        let data = {
            "board_title": title,
            'board_content_list': contents,
            'hash_tags': hashTagList
        }

        axios({
            method: 'POST',
            url: serverUrl.url + '/board/insertBoard',
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            data: data
        }).then((response) => {

            if (imageDataList.length > 0) {
                const imageForm = new FormData();

                imageDataList.map((data) => {
                    imageForm.append('boardImage', data);
                });
                imageForm.append('boardId', response.data);

                axios({
                    method: 'POST',
                    url: serverUrl.url + '/board/uploadImage',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true,
                    data: imageForm

                }).then(() => {
                    refresh();
                    navigate('/');
                }).catch((error) => {
                    try{
                        alert(error.response.data.detail);
                    }catch (err){
                        alert('오류가 발생하였습니다.');
                    }
                })
            } else {
                refresh();
                navigate('/');
            }

        }).catch((error) => {
            try{
                alert(error.response.data.detail);
            }catch (err){
                alert('오류가 발생하였습니다.');
            }
        })

    };

    return (
        <div>
            <div>
                <input type='file' ref={imageFileInput} style={{display: 'none'}}
                       accept="image/jpg, image/JPG, image/jpeg" onChange={(event) => readImage(event)}/>
                <TextField
                    required
                    id="outlined-required"
                    fullWidth
                    placeholder="글 제목"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>
            <Divider sx={{
                my: 2
            }}/>

            <Button onClick={() => imageFileInput.current.click()}>
                이미지 업로드
            </Button>

            <div ref={contentDiv} className='content-div' contentEditable="true" placeholder='내용을 입력하세요.'>
            </div>

            <div style={{margin: '20px 0'}}>
                <input type='text' placeholder='해시태그' value={hashTag} onChange={(e) => setHashTag(e.target.value)}/>
                <input type='button'
                       style={{marginLeft: '5px'}}
                       value='추가'
                       onClick={(event) => pushHashTag(event)}/>
                <div style={{
                    width: '100%'
                    , marginTop: '5px'
                    , borderRadius: '5px'
                    , minHeight: '34px'
                }}>
                    {
                        hashTagList.map((tag, index) => {
                            return (
                                <>
                                    <Chip sx={{mx: 1}} label={tag} onDelete={() => deleteHashTag(index)}/>
                                </>
                            )
                        })
                    }
                </div>

                <Popover open={open}
                         id={id}
                         anchorEl={duplicationBool}
                         onClose={popoverClose}
                         anchorOrigin={{
                             vertical: 'bottom',
                             horizontal: 'left'
                         }}
                >
                    <Typography sx={{p: 0.7}}>중복 태그는 등록 할 수 없습니다.</Typography>
                </Popover>
            </div>
            <div style={{display: 'flex'}}>
                <ThemeProvider theme={theme}>
                    <Button
                        style={{fontSize: 'calc(5px + 1vmin)'}}
                        variant="contained"
                        onClick={() => createBoard()}
                    >
                        작성 완료
                    </Button>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default BoardWrite;