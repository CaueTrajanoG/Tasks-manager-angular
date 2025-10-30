import { Component, signal, Input, inject, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeedTasks } from '../../../services/seed-tasks';

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
  
  @Input() dadosTask: any= null;
  //Evento para comunicar ao Dashboard
  @Output() saveTask = new EventEmitter<any>();
  @Output() updateTask = new EventEmitter<any>();
  

  showModal(dadosTask?:any){
    if(dadosTask){
      this.dadosTask =  { ...dadosTask}
      this.creating.set(false);
    }else{
      this.dadosTask = { id: null, title: '', desc: '', status: 'todo' };
      this.creating.set(true);
    }    
    this.visible.set(true);    
  }

  hiddenModal(){
    this.visible.set(false);
    this.dadosTask = { id: null, title: '', desc: '', status: 'todo' };
  }

  savingTask(){
    if(this.creating()){     
      this.seed.addTask(this.dadosTask);
    }else{
      this.seed.updateTask(this.dadosTask);
      this.creating.set(true);
    }
    this.hiddenModal()
  }
  
}
