import React, { Component } from 'react'
import axios from 'axios';
import { Form, Icon, Input, Button, Card, Row, Col } from 'antd';
import './style.css'


export default class CreateTask extends Component {

    constructor(props) {
        super(props);
        // initialize the state with an empty todos array
        this.state = {
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_completed: false
        }
        this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
        this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
        this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    onChangeTodoDescription(e) {
        this.setState({
            todo_description: e.target.value
        });
    }


    onChangeTodoResponsible(e) {
        this.setState({
            todo_responsible: e.target.value
        });
    }


    onChangeTodoPriority(e) {
        this.setState({
            todo_priority: e.target.value
        });
    }

    /** Method to handle the submit event of the form **/
    onSubmit(e) {
        e.preventDefault(); //ensure that the default HTML form submit behaviour is prevented

        //Json Object that will be sent to backend
        const newTodo = {
            todo_description: this.state.todo_description,
            todo_responsible: this.state.todo_responsible,
            todo_priority: this.state.todo_priority,
            todo_completed: this.state.todo_completed
        };




        //Send the Json Object to the backend and then clear the value in the form
        axios.post('http://localhost:4000/todos/add', newTodo)
            .then(res => {
                this.setState(prevState => {
                    {

                        this.props.addItem(res.data.todo) //call this function to update the state of parent component "Todoslist" goto "Todoslist" for the implementation
                        let newState = {
                            todo_description: "",
                            todo_responsible: "",
                            todo_priority: "",
                            todo_completed: false
                        }
                        return newState
                    }
                })
            })
    }

    render() {
        return (
            <Form
                onSubmit={this.onSubmit}
                layout="horizontal"
                className="todo-form"
            >
                <Row gutter={20}>
                    <Col xs={24} sm={24} md={17} lg={19} xl={20}>
                        <Form.Item>
                            <Input
                                placeholder="description"
                                type="text"
                                value={this.state.todo_description}
                                onChange={this.onChangeTodoDescription}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={7} lg={5} xl={4}>
                        <Button type="primary" htmlType="submit" block>
                            <Icon type="plus-circle" />
                            Add
                         </Button>
                    </Col>
                </Row>
            </Form>


        )
    }
}
