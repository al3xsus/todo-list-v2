import React, {Component, Fragment} from 'react';
import {Button, Checkbox, Container, Header, Icon, Select, Table} from 'semantic-ui-react'
import moment from 'moment'

import TaskEditor from '../components/TaskEditor';

const API = process.env.REACT_APP_API || 'http://localhost:3001';

const style = {
    h1: {
        marginTop: '3em',
    },
    h2: {
        margin: '4em 0em 2em',
    },
    h3: {
        marginTop: '2em',
        padding: '2em 0em',
    },
    last: {
        marginBottom: '300px',
    },
};

class TasksManager extends Component {
    state = {
        loading: true,
        tasks: [],
        modalState: {show: false, data: null},
        filter: 'all'
    };

    componentDidMount() {
        this.getTasks();
    }

    fetch = async (method, endpoint, body) => {
        try {
            const response = await fetch(`${API}${endpoint}`, {
                method,
                body: body && JSON.stringify(body),
                headers: {
                    'content-type': 'application/json',
                    accept: 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    getTasks = async () => {
        this.setState({loading: false, tasks: await this.fetch('get', '/tasks')});
    };

    saveTask = async (task) => {
        if (task.id) {
            let newTask = task;
            if (task.todo_date === undefined) newTask.todo_date = null;
            if (task.done_date === undefined) newTask.done_date = null;
            await this.fetch('put', `/tasks/${task.id}`, newTask);
        } else {
            await this.fetch('post', '/tasks', task);
        }

        this.props.history.goBack();
        this.getTasks();
    };

    deleteTask = async (task) => {
        // if (window.confirm(`Are you sure you want to delete "${task.title}"`)) {
        //     await this.fetch('delete', `/tasks/${task.id}`);
        //     this.getTasks();
        // }
        await this.fetch('delete', `/tasks/${task.id}`);
        this.getTasks();
    };

    showModal = (task) => {
        this.setState({modalState: {show: true, data: task}})
    };

    hideModal = () => {
        this.setState({modalState: {show: false, data: null}})
    };

    compareDates = (task) => {
        if (task.todo_date) {
            if (task.done_date && moment(task.done_date) > moment(task.todo_date)) return true;
            else if (moment() > moment(task.todo_date)) return true;
            return false
        } else return false
    };

    generateList = () => {
        const {tasks, filter} = this.state;
        let filtered_tasks = [];
        if (filter === 'all') filtered_tasks = tasks;
        else filtered_tasks = tasks.filter(function (task) {
            return task.importance === filter;
        });
        return filtered_tasks.map((task, i) =>
            <Table.Row key={`tr-key-${i}`} error={this.compareDates(task)}>
                <Table.Cell>{task.title}</Table.Cell>
                <Table.Cell>
                    {task.description.length > 20 ? task.description.slice(0, 20) + ' ...' : task.description}
                </Table.Cell>
                <Table.Cell>{this.showImportance(task)}</Table.Cell>
                <Table.Cell>
                    {moment(task.todo_date).format("DD/MM/YYYY, HH:mm")}
                </Table.Cell>
                <Table.Cell>
                    <Checkbox readOnly={true} toggle={true} checked={task.done}/>
                </Table.Cell>
                <Table.Cell>
                    {task.done_date !== null ? moment(task.done_date).format("DD/MM/YYYY, HH:mm") : ''}
                </Table.Cell>
                <Table.Cell>
                    <Button
                        color={"blue"}
                        basic={true}
                        icon={"pencil"}
                        content={'Редактировать'}
                        onClick={() => this.showModal(task)}
                        floated={"right"}
                    />
                </Table.Cell>
            </Table.Row>
        )
    };

    onFilterChange = (change) => {
        this.setState({filter: change.value})
    };

    showImportance = (task) => {
        if (task.importance === 'normal') return <Icon className={'attention'}/>;
        else if (task.importance === 'high') return <div>
            <Icon className={'attention'}/>
            <Icon className={'attention'}/>
        </div>;
        else return <div>
                <Icon className={'attention'}/>
                <Icon className={'attention'}/>
                <Icon className={'attention'}/>
            </div>
    };

    render() {
        const options = [
            {key: 'all', value: 'all', text: 'Все задачи'},
            {key: 'normal', value: 'normal', text: 'Обычной важности'},
            {key: 'high', value: 'high', text: 'Высокой важности'},
            {key: 'ultra', value: 'ultra', text: 'Очень высокой важности'}
        ];
        return (
            <Fragment>
                <Header as='h2' content='Список дел v2' style={style.h2} textAlign='center'/>
                <Header as='h3' textAlign='center' style={style.h3} content='Текущие задачи'/>
                <Container>
                    <Table singleLine selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Название</Table.HeaderCell>
                                <Table.HeaderCell>Описание</Table.HeaderCell>
                                <Table.HeaderCell>Важность</Table.HeaderCell>
                                <Table.HeaderCell>Когда нужно выполнить</Table.HeaderCell>
                                <Table.HeaderCell>Выполнено</Table.HeaderCell>
                                <Table.HeaderCell>Когда было выполнено</Table.HeaderCell>
                                <Table.HeaderCell textAlign={"right"}>Действия</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.generateList()}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='7'>
                                    <Select
                                        options={options}
                                        value={this.state.filter}
                                        onChange={(ev, change) => this.onFilterChange(change)}
                                    />
                                    <Button
                                        basic={true}
                                        icon={"add"}
                                        color={"green"}
                                        content={"Добавить"}
                                        onClick={() => this.showModal(null)}
                                        floated={"right"}
                                    />
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </Container>

                <TaskEditor
                    show={this.state.modalState.show}
                    onClose={this.hideModal}
                    data={this.state.modalState.data}
                    onSaveTask={this.saveTask}
                    onDeleteTask={this.deleteTask}
                />
            </Fragment>
        );
    }
}

export default TasksManager;
