import React from 'react'
import {Button, Checkbox, Form, Header, Input, Modal, Select, TextArea} from 'semantic-ui-react'
import {DatetimeInput} from 'react-datetime-inputs'
import moment from 'moment'


class TaskEditor extends React.PureComponent {

    defaultState = {
        task: {
            title: '',
            description: '',
            importance: 'normal',
            todo_date: undefined,
            done_date: undefined,
            done: false
        },
        modalOpen: false
    };

    constructor(props) {
        super(props);
        this.state = {...this.defaultState}
    }

    handleOpen = () => this.setState({modalOpen: true});

    handleClose = () => this.setState({modalOpen: false});

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && this.props.data == null) {
            const newState = {
                task: {...nextProps.data}
            };
            if (newState.task.todo_date === null) newState.task.todo_date = undefined;
            if (newState.task.done_date === null) newState.task.done_date = undefined;
            this.setState(newState)
        } else if (nextProps.data == null) {
            this.setState(this.defaultState)
        }
    }

    handleFieldChange = (field) => {
        return (ev, data) => {
            if (ev) {
                ev.preventDefault()
            }
            this.setState({
                task: {
                    ...this.state.task,
                    [field]: data.checked !== undefined ? data.checked : data.value,
                }
            })
        }
    };

    handleTimeChange = (field, change) => {
        this.setState({
            task: {
                ...this.state.task,
                [field]: moment(change).toISOString(),
            }
        })
    };

    handleCheckBoxChange = (change) => {
        if (change.checked === true) {
            this.setState({
                task: {
                    ...this.state.task,
                    done: true,
                    done_date: moment().toISOString(),
                }
            })
        } else {
            this.setState({
                task: {
                    ...this.state.task,
                    done: false,
                    done_date: undefined,
                }
            })
        }
    };

    render() {
        const options = [
            {key: 'normal', value: 'normal', text: 'Обычная'},
            {key: 'high', value: 'high', text: 'Важная'},
            {key: 'ultra', value: 'ultra', text: 'Очень важная'}
        ];
        const {show, onClose, data, onSaveTask, onDeleteTask} = this.props;
        const {task: {title, description, importance, todo_date, done}, task} = this.state;
        return <Modal open={show} onClose={onClose} size={"large"} closeIcon>
            <Modal.Header>
                {data ? 'Редактировать задачу' : 'Добавить задачу'}
            </Modal.Header>
            <Modal.Content scrolling>
                <Form className="ui form">
                    <Form.Field>
                        <label>Название</label>
                        <Input
                            fluid
                            placeholder={!data ? 'Введите название' : null}
                            onChange={this.handleFieldChange('title')}
                            value={title}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Описание</label>
                        <TextArea
                            fluid={"true"}
                            placeholder={!data ? 'Введите описание' : null}
                            style={{width: "100%"}}
                            autoHeight={true}
                            rows={4}
                            onChange={this.handleFieldChange('description')}
                            value={description}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Степень важности</label>
                        <Select
                            style={{width: "100%"}}
                            options={options}
                            value={importance}
                            onChange={this.handleFieldChange('importance')}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Когда нужно выполнить</label>
                        <DatetimeInput
                            datetime={moment(todo_date)}
                            onChange={(change) => this.handleTimeChange('todo_date', change)}
                            allowClear={true}
                        >
                        </DatetimeInput>
                    </Form.Field>
                    <br/>
                    <br/>
                    <br/>
                    <Form.Field>
                        <Checkbox
                            label={"Выполнено"}
                            toggle={true}
                            style={{width: "100%"}}
                            onChange={(ev, data) => this.handleCheckBoxChange(data)}
                            checked={done}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                {!data ?
                    <Button
                        basic
                        color={"green"}
                        icon={"save"}
                        content={"Добавить"}
                        onClick={() => {
                            onSaveTask(task);
                            onClose()
                        }}
                    />
                    :
                    <div>
                        <Button
                            basic
                            color={"green"}
                            icon={"save"}
                            content={"Сохранить"}
                            onClick={() => {
                                onSaveTask(task);
                                onClose()
                            }}
                        />
                        <Modal
                            trigger={
                                <Button
                                    basic
                                    negative
                                    content={"Удалить"}
                                    icon={"trash"}
                                    onClick={this.handleOpen}
                                />}
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            basic
                            data={data}
                            size='small'>
                            <Header icon='browser' content='Подтвердите удаление'/>
                            <Modal.Content>
                                <h3>Вы действительно хотите удалить приложение {task.title}?</h3>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button
                                    negative
                                    icon={"trash"}
                                    onClick={() => {
                                        onDeleteTask(task);
                                        this.handleClose();
                                        onClose()
                                    }}
                                    inverted
                                />
                            </Modal.Actions>
                        </Modal>
                    </div>
                }
            </Modal.Actions>
        </Modal>
    }
}

export default TaskEditor