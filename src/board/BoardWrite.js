import {Button, Chip, createTheme, Divider, Popover, TextField, ThemeProvider, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import './Board.css';


const BoardWrite = () => {

    const contentDiv = useRef();
    const [hashTag, setHashTag] = useState('');
    const [hashTagList, setHashTagList] = useState([]);
    const [title, setTitle] = useState('');

    const contentList = () => {

        const elements = contentDiv.current.childNodes;
        const result = [];
        let order = 1;

        elements.forEach((element) => {
            let tagType = element.tagName;
            let data = {};
            data.content_order = order;

            if(tagType.toLowerCase() === 'div'){
                data.content_type = 'text';
                data.board_content = element.textContent;
                console.log(element.textContent);
            }else if(tagType.toLowerCase() === 'img'){

                data.content_type = 'image';
                data.image_path = element.getAttribute('src');
                console.log(element.getAttribute('src'));
            }
            order += 1;
            result.push(data);
        })

        console.log(result);
        return result;
    }

    const test2 = () => {

        const testImg = document.createElement('img');
        testImg.width = 500;
        testImg.src = "http://localhost:8080/boardImage/test1.jpg";

        contentDiv.current.appendChild(testImg);

    }

    const theme = createTheme({
        palette:{
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

        if(copy.includes(hashTag)){
            popoverOpen(event);
        }else{
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

    useEffect(() => {
        contentDiv.current.addEventListener('input', (event) => {
            /*
            const div = event.target;
            const children = Array.from(div.childNodes);

            if (children.length === 0 || children[0].nodeName !== 'DIV') {
                const newDiv = document.createElement('div');
                while (div.firstChild) {
                    newDiv.appendChild(div.firstChild);
                }
                div.appendChild(newDiv);
            }


            children.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                    const newDiv = document.createElement('div');
                    newDiv.textContent = child.textContent;
                    div.replaceChild(newDiv, child);
                }
            });

             */

        });

        contentDiv.current.innerHTML = '<div><br></div>';

    }, [])

    return (
        <div>
            <div>
                <Button onClick={() => contentList()}>
                    test1
                </Button>
                <Button onClick={() => test2()}>
                    test2
                </Button>
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
            <div ref={contentDiv} className='content-div' contentEditable="true" placeholder='내용을 입력하세요.'>
            </div>

            <div style={{margin: '20px 0'}}>
                <input type='text' placeholder='해시태그' value={hashTag} onChange={(e) => setHashTag(e.target.value)}/>
                <input type='button'
                       style={{marginLeft: '5px'}}
                       value='추가'
                       onClick={(event) => pushHashTag(event)}/>
                <div style={{width: '100%'
                        , marginTop:'5px'
                        , borderRadius: '5px'
                        , minHeight: '34px'
                }}>
                    {
                        hashTagList.map((tag, index) => {
                            return(
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
                    >
                        작성 완료
                    </Button>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default BoardWrite;