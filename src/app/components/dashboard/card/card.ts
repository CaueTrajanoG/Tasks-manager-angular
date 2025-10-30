import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Task } from '../../../services/seed-tasks';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() task!: Task;    

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  editTask() {
    this.edit.emit(this.task);
  }
  deleteTask(){
    this.delete.emit(this.task);
  }
}
