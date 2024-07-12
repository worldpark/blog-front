import {
    Box, Button,
    createSvgIcon,
    Divider,
    Link,
    Tooltip,
    useMediaQuery
} from "@mui/material";
import './MenuCSS.css';
import axios from "axios";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons";

const HomeSideMenu = () => {

    const isScreenDiv = useMediaQuery('(min-width:1200px)');
    const [hashTags, setHashTags] = useState([]);

    const loginInfo = useSelector((state) => state.loginInfo.value);

    const [createHashTagForm, setCreateHashTagForm] = useState(false);
    const [hashTagInput, setHashTagInput] = useState('');

    const [visibleContent, setVisibleContent] = useState(false);

    const getHashTagList = () => {
        axios({
            method: "POST",
            url: "http://localhost:8080/getHashTagList"
        }).then((response) => {
            setHashTags(response.data);

        }).catch((error) => {

            alert(error.response.data.detail);
        });
    }

    useEffect(() => {
        getHashTagList();

    }, []);

    useEffect(() => {
        if(loginInfo.status && loginInfo.auths.includes("ROLE_ADMIN")){
            setVisibleContent(true);
        }else{
            setVisibleContent(false);
        }

    }, [loginInfo]);

    const PlusHashTag = createSvgIcon(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
        </svg>,
        'Plus',
    );

    const openCreateHashTag = () => {
        setCreateHashTagForm(true);
    }

    const createHashTag = () => {

        let data = {
            hash_label: hashTagInput
        }

        axios({
            method: 'POST',
            url: 'http://localhost:8080/setHashTag',
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            withCredentials: true
        }).then(() => {
            getHashTagList();
            setHashTagInput('');

        }).catch((error) => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("해당 권한이 없습니다.");
            } else {
                console.log(error);
            }
        })
        setCreateHashTagForm(false);

    }

    const deleteHashTag = (hashId) => {

        let data = {
            hashId: hashId
        }

        axios({
            method: 'DELETE',
            url: "http://localhost:8080/hashTag",
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            withCredentials: true
        }).then((response) => {

            if (response.data.code === '200') {
                getHashTagList();

            } else {
                console.log(response.data);
            }

        }).catch((error) => {
            alert(error.response.data.message);
        })

    }

    return (
        <>
            <Box display="flex" flexDirection={isScreenDiv ? "column" : "row"}>
                {
                    isScreenDiv ?
                        <>
                            <div>
                                <span style={{fontSize: '20pt'}}>
                                    <Link href="/"
                                          sx={{
                                              textDecoration: 'none',
                                              color: 'inherit',
                                              transition: 'color 0.3s ease',
                                              mt: 1,
                                              '&:hover': {
                                                  color: 'primary.main'
                                              }
                                          }}>
                                        태그목록
                                    </Link>
                                </span>
                                {
                                    visibleContent ?
                                        <Tooltip title="태그 추가">
                                            <PlusHashTag sx={{ml: 1}} style={{cursor: "pointer"}}
                                                         onClick={() => openCreateHashTag()}/>
                                        </Tooltip> :
                                        <></>
                                }
                            </div>
                            <Divider sx={{
                                my: 2,
                                mr: 20
                            }}/>
                        </>
                        :
                        <></>
                }

                {
                    createHashTagForm ?
                        <div style={{margin: '2px 0'}}>

                            <input type='text' style={{width: '70px'}} value={hashTagInput}
                                   onChange={(event) => setHashTagInput(event.target.value)}/>
                            <Button onClick={() => createHashTag()}>추가</Button>

                        </div> :
                        <></>
                }

                {
                    hashTags.map((data, index) => {
                        return (
                            <div key={index} style={{margin: '4px 0'}}>
                                <Link href={"/hashtag/" + data.hashLabel}
                                      sx={{
                                          textDecoration: 'none',
                                          color: 'inherit',
                                          transition: 'color 0.3s ease',
                                          mt: 1,
                                          '&:hover': {
                                              color: 'primary.main'
                                          }
                                      }}>
                                    {data.hashLabel}
                                </Link>
                                {
                                    visibleContent ?
                                        <FontAwesomeIcon style={{marginLeft: '8px', cursor: "pointer"}} icon={faMinus}
                                                         onClick={() => deleteHashTag(data.hashId)}/> :
                                        <></>
                                }
                            </div>
                        )
                    })
                }
            </Box>
        </>
    )
}

export default HomeSideMenu;