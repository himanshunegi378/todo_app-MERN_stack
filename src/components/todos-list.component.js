import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { List, Button, Descriptions, Table, Divider, Tag, Tooltip, Icon, Checkbox } from 'antd';
import './style.css'

import CreateTask from './create-todo.component'

const Todo = props => (
    <List.Item className="list-item"
        actions={[
            <Tooltip title="Remove Todo">
                <Button type="danger" onClick={() => props.delete(props.todo._id)}>
                    <Icon type="delete" />
                </Button>
            </Tooltip>
        ]}
    >
        <div className="todo-item">
            <Tooltip
                title={props.todo.todo_completed ? "Mark as uncompleted" : "Mark as completed"}
            >
                <Checkbox
                    defaultChecked={props.todo.todo_completed}
                    onChange={() => props.toggle(props.todo._id)}
                />
            </Tooltip>

            <Tag color={props.todo.todo_completed ? "green" : "volcano"} className="todo-tag">
                {props.todo.todo_completed ? <Icon type="check" /> : "-"}
            </Tag>

            <div className="todo-name">
                {props.todo.todo_completed ? <del>{props.todo.todo_description}</del> : props.todo.todo_description}
            </div>
        </div>

    </List.Item>
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
        this.onToggleComplete = this.onToggleComplete.bind(this)
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

    // update the state with row with the matching id removed and then send same id to the backend to remove from the database 
    deleteTodoItem(id) {
        let newState = this.state
        newState.todos = newState.todos.filter(x => x._id !== id)

        this.setState({ newState }, () => {
            axios.post('http://localhost:4000/todos/delete/' + id);
        })
    }
    // toggle todo_completed state of todoItem with matching id and then send the id to the backend to do the same in database
    onToggleComplete(id) {
        let newState = this.state
        newState.todos = newState.todos.map((currentTodo) => {
            if (currentTodo._id === id)
            {
                currentTodo.todo_completed = !currentTodo.todo_completed
            }
            return currentTodo
        })
        this.setState({ newState }, () => {
            axios.post('http://localhost:4000/todos/toggleComplete/' + id)
        })
    }

    //passed as props to "CreateTask" component. It will be called by the "CreateTask" Component when user creates and submit the new task
    addTodoItem(todoItem) {
        this.setState(prevState => {
            const newState = prevState
            newState.todos.unshift(todoItem)
            return newState
        })
    }

    // create an array of Todo components from this.state object
    todoList() {
        return this.state.todos.map((currentTodo) => {
            return <Todo todo={currentTodo} key={currentTodo._id} toggle={this.onToggleComplete} delete={this.deleteTodoItem} />;
        })
    }

    render() {
        return (
            <div>
                <CreateTask addItem={this.addTodoItem} />
                <List
                    header={<div>Todo List</div>}
                    bordered
                    dataSource={this.todoList()}
                    renderItem={item => (item)}
                />
            </div>
        )
    }
}