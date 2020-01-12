import React, { Component } from 'react'
import axios from 'axios';


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
            <div>
                <h3>Create New Todo</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Description: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.todo_description}
                            onChange={this.onChangeTodoDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label>Responsible: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.todo_responsible}
                            onChange={this.onChangeTodoResponsible}
                        />
                    </div>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio"
                                name="priorityOptions"
                                id="priorityLow"
                                value="Low"
                                checked={this.state.todo_priority === 'Low'}
                                onChange={this.onChangeTodoPriority}
                            />
                            <label className="form-check-label">Low</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio"
                                name="priorityOptions"
                                id="priorityMedium"
                                value="Medium"
                                checked={this.state.todo_priority === 'Medium'}
                                onChange={this.onChangeTodoPriority}
                            />
                            <label className="form-check-label">Medium</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio"
                                name="priorityOptions"
                                id="priorityHigh"
                                value="High"
                                checked={this.state.todo_priority === 'High'}
                                onChange={this.onChangeTodoPriority}
                            />
                            <label className="form-check-label">High</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Todo" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
