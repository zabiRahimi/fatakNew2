import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as  Route , Switch} from "react-router-dom";
import Login from './login';
import Register from './register';



export default function Index() {

    return (
       
        <div className="container2">
            <Switch >
                <Route exact path="/user/login">
                    <Login />
                </Route>
                <Route exact path="/user/register">
                    <Register />
                </Route>
            </Switch>
        </div>
    
    )

}


