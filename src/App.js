import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import EditTodo from "./components/edit-todo.component";
import TodosList from "./components/todos-list.component";


class App extends Component {
  render() {
    return (
        <Router>
            <div className="container">
                <Route path="/" exact component={TodosList} />
                <Route path="/edit/:id" component={EditTodo} />
            </div>
        </Router>
    );
  }
}

export default App;
