import { Component, signal, Input, inject, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
      this.oldTask = structuredClone({...dadosTask});
      this.dadosTask =  { ...dadosTask}
      this.creating.set(false);
    }else{
      this.dadosTask = { id: null, title: '', description: '', status: 'todo' };
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
      this.currentTask = this.dadosTask
      //this.seed.updateTask(this.dadosTask.id, this.comparer<Task>(this.oldTask,this.currentTask));
      this.creating.set(true);
    }
    this.hiddenModal()
  }

  
  comparer<T extends object>(oldTask: T| null, editedTask: T|null): Partial<T>{
    const changes: Partial<T> = {};

    for(let key of Object.keys(editedTask!) as (keyof T)[]){
      if(editedTask![key] !== oldTask![key]){
          changes[key] = editedTask![key];
      }
    }
    console.log("alterações: "+ changes)
    return changes;
  }  
}
