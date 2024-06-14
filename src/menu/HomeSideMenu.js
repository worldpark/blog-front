import {Box, Divider, Link, useMediaQuery} from "@mui/material";
import './MenuCSS.css';

const HomeSideMenu = () => {
    const isScreenDiv = useMediaQuery('(min-width:1200px)');

    return (
        <>
            <Box display="flex" flexDirection={isScreenDiv ? "column" : "row"}>
                {
                    isScreenDiv ?
                        <>
                            <div>태그목록</div>
                            <Divider sx={{
                                my: 2,
                                mr: 20
                            }}/>
                        </>
                        :
                        <div></div>
                }

                <Link href="#"
                    sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'color 0.3s ease',
                        mt: 1,
                        '&:hover':{
                            color: 'primary.main'
                        }
                    }}>
                    menu1
                </Link>

                <Link href="#"
                      sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'color 0.3s ease',
                          mt: 1,
                          '&:hover':{
                              color: 'primary.main'
                          }
                      }}>
                    menu2
                </Link>

                <Link href="#"
                      sx={{
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'color 0.3s ease',
                          mt: 1,
                          '&:hover':{
                              color: 'primary.main'
                          }
                      }}>
                    menu3
                </Link>
            </Box>
        </>
    )
}

export default HomeSideMenu;