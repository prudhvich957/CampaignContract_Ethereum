import React from "react";
import Header from "./header";
import { Container } from "semantic-ui-react";
import Head from 'next/head';   

const Layout =  (props) => {
    
    return(
        <Container>
            <Header/>
            <Head>
            <link async rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css" />
            </Head>
            {props.children}
        </Container>     
    );
}

export default Layout;