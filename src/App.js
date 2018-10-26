import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Checkbox from '@material-ui/core/Checkbox';
import firebase from './firebase';
import logo from './logo.svg';
import * as _ from 'lodash';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Task  from './Components/Task';
import './App.css';



const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const convertTaskToArray = (tasks) => {
  return _.sortBy(_.map(tasks, (task, id) => {
    return {...task, id};
  }), "order")
}

class App extends Component {

  state={
    newTaskName: '',
    newTaskDone: false,
    searchValue: '',
    filterTask: 'all',
  }

  componentDidMount(){
    const starCountRef = firebase.database().ref('tasks');
    starCountRef.on('value',(snapshot) => {
      this.setState({
        tasks: convertTaskToArray(snapshot.val())
      })
    });
  }

  saveOrderToFirebase = () => {
      _.forEach(this.state.tasks, ({id}, index) =>{
      firebase.database().ref('tasks/' + id).update({
        order: index,
      });
    })
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const tasks = reorder(
      this.state.tasks,
      result.source.index,
      result.destination.index
    );


    this.setState({
      tasks,
    }, this.saveOrderToFirebase);
  }

  newTaskNameOnChange = (e) => {
    this.setState({
      newTaskName: e.target.value
    })
  }

  newTaskStatusOnChange = (e, checked) => {
    this.setState({
      newTaskDone: checked
    })
  }

  taskStatusOnChange = (id) => (e, checked) => {
    firebase.database().ref('tasks/' + id).update({
      done: checked
    });
  }

  CreateTask = () => {
    const newTaskKey = firebase.database().ref().child('tasks').push().key;
    firebase.database().ref('tasks/' + newTaskKey).set({
      name: this.state.newTaskName,
      done: this.state.newTaskDone
    });
  }

  taskDelete = (id) => () => {
    firebase.database().ref('tasks/' + id).remove();
    console.log('is deleted id = ' + id)
  }

  taskRename = (id) => (e) => {
    firebase.database().ref('tasks/' + id).update({
      name: e.target.value
    });
  }

  searchValueOnChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }

  renderTaskCreator() {
    return <div className="task-wrapper">
      <div className="check-button"><Checkbox checked={this.state.TaskIsDone} onChange={this.newTaskStatusOnChange}/></div>
      <input className="task-input" placeholder="Create a new task" value={this.state.newTaskName} onChange={this.newTaskNameOnChange}/>
      <div className="create-button" onClick={this.CreateTask}>Create</div>
    </div>
  }

  render() {
    const tasksComponent = _.map(this.state.tasks, (task, index) => {
      return <Draggable
                key={task.id}
                draggableId={task.id}
                index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                    <Task
                      taskRename={this.taskRename(task.id)}
                      taskDelete={this.taskDelete(task.id)}
                      taskStatusOnChange = {this.taskStatusOnChange(task.id)}
                      taskIsDone={task.done}
                      taskName={task.name}
                      key={task.id}/>
                    </div>
                  )}
            </Draggable>
    })

    return (
      <div className="app-wrapper">
        <div className="main-block">
          <div className="header">
            TODO
          </div>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} className="main-content">
                  {this.renderTaskCreator()}
                  {tasksComponent}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }
}

export default App;
