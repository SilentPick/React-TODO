import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

class Task extends Component {
  render() {
    return (
      <div className="task-wrapper">
        <div className="check-button"><Checkbox checked={this.props.taskIsDone} onChange={this.props.taskStatusOnChange}/></div>
        <input className="task-input" value={this.props.taskName} onChange={this.props.taskRename}/>
        <div className="delete-button" onClick={this.props.taskDelete}>✕</div>
      </div>
    );
  }
}

export default Task;
