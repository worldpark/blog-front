import {Button, Divider, TextField} from "@mui/material";
import {useEffect, useRef} from "react";


const BoardWrite = () => {

    const contentDiv = useRef();
    //const divText = useRef();

    const test = () => {

        //const elements = document.querySelectorAll('div[name], img[name]');
        const elements = document.getElementsByName('divText');


        elements.forEach((element) => {
            let tagType = element.tagName;

            if(tagType.toLowerCase() === 'div'){
                console.log(element.textContent);
            }else if(tagType.toLowerCase() === 'img'){
                console.log(element.getAttribute('src'));
            }
        })
    }

    const test2 = () => {

        const testDiv = document.createElement('div');
        testDiv.setAttribute("name", "divText");
        testDiv.innerText = 'asas';

        contentDiv.current.appendChild(testDiv);

    }

    useEffect(() => {
    }, [])

    return (
        <div>
            <div>
                <Button onClick={() => test()}>
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
                />
            </div>
            <Divider sx={{
                my: 2
            }}/>
            <div ref={contentDiv}>
                <img name='divText' src="http://localhost:8080/"/>
            </div>
        </div>
    )
}

export default BoardWrite;