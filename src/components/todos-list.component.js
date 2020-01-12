import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import CreateTask from './create-todo.component'

const Todo = props => (
    <tr>
        <td>{props.todo.todo_description}</td>
        <td>{props.todo.todo_responsible}</td>
        <td>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/" + props.todo._id}>Edit</Link>
        </td>
        <td>
            <input type='button' value="delete" onClick={() => props.delete(props.todo._id)} />
        </td>
    </tr>
);

export default class TodosList extends Component {
    constructor(props) {
        super(props);
        // initialize the state with an empty todos array
        this.state = {
            todos: []
        }

        this.deleteTodoItem = this.deleteTodoItem.bind(this);
        this.addTodoItem = this.addTodoItem.bind(this)
    }

    // To retrieve the todos data from the database --> use the componentDidMount lifecycle method
    componentDidMount() {
        axios.get('http://localhost:4000/todos/')
            .then(response => {
                // Update states of the component with the data received from the backend
                this.setState(prevState => {
                    let newState = { ...prevState }
                    newState.todos = [...response.data]
                    return newState;
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    // update the state with row with the id removed and then send an id to the backend to remove from the database 
    deleteTodoItem(id) {
        let newState = this.state
        newState.todos = newState.todos.filter(x => x._id !== id)

        this.setState({ newState }, () => {
            axios.post('http://localhost:4000/todos/delete/' + id);
        })



    }

    //passed as props to "CreateTask" component. It will be called by the "CreateTask" Component when user creates and submit the new task
    addTodoItem(todoItem) {
        this.setState(prevState=>{
            const newState = prevState
            newState.todos.unshift(todoItem)
            return newState
        })
    }

    // create an array of Todo components from this.state object
    todoList() {
        return this.state.todos.map((currentTodo) => {
            return <Todo todo={currentTodo} key={currentTodo._id} delete={this.deleteTodoItem} />;
        })
    }

    render() {
        return (
            <div>
                <CreateTask addItem={this.addTodoItem} />
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Responsible</th>
                            <th>Priority</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.todoList()}
                    </tbody>
                </table>
            </div>
        )
    }
}