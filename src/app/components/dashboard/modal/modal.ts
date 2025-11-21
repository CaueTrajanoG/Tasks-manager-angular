import { Component, signal, Input, inject, EventEmitter, Output } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { SeedTasks, Task } from '../../../services/seed-tasks';

@Component({
  selector: 'app-modal',
  imports: [FormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  protected seed = inject(SeedTasks);
  visible = signal(false);
  creating = signal(true);

  oldTask:Task | null = null;
  currentTask:Task | null = null;
  

  @Input() dadosTask: any= null;
  //Evento para comunicar ao Dashboard
  @Output() saveTask = new EventEmitter<any>();
  @Output() updateTask = new EventEmitter<any>();
  

  showModal(dadosTask?:Task){
    if(dadosTask){
      this.dadosTask =  { ...dadosTask}
      this.currentTask = { ...dadosTask}
      this.creating.set(false);
    }else{
      this.creating.set(true);
    }    
    this.visible.set(true);    
  }

  hiddenModal(){
    this.visible.set(false);
    this.dadosTask = { id: null, title: '', description: '', status: 'todo' };
  }

  savingTask(){
    if(this.creating()){
      this.seed.addTask(this.dadosTask);    

    }else{      
      this.seed.updateTask(this.dadosTask.id,this.comparer(this.currentTask, this.dadosTask));   
      this.creating.set(true);
    }
    this.hiddenModal()
  }

  
  comparer<Task>(oldTask: Task, editedTask: Task): Partial<Task>{
    const changes: Partial<Task> = {};
    for(let key of Object.keys(editedTask!) as (keyof Task)[]){ 
      if(editedTask[key] as string !== oldTask[key]){ //varre e compara os dois
        changes[key] = editedTask![key];
      }
    }
    return changes;
  }  
}
