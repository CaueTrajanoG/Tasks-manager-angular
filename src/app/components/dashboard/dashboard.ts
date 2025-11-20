import { Component, OnInit, inject, ViewChild, Signal, computed} from '@angular/core';
import { Card } from "./card/card";
import { creatingTask, SeedTasks, Task } from '../../services/seed-tasks';
import { Modal } from "./modal/modal";
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataService } from '../../services/data-service';

//dash
@Component({
  selector: 'app-dashboard',
  imports: [Card, Modal, DragDropModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit{
    dataService = inject(DataService);
    // instanciando o service seedTask 
    private tasksService = inject(SeedTasks);
    tasks = computed(() => this.tasksService.allTasks());
    

    ngOnInit(): void {
      // popula as tasks iniciais se estiver vazio
      this.tasksService.seederTasks();      
    }

    getTasksByStatus(status: string): Task[]{
        return this.tasks().filter(t => t.status === status);        
    }
    
    @ViewChild(Modal) modal!: Modal;
    newTask(){
     this.modal.showModal();
    }

    // Chamado quando um card emite o evento (edit)
    onEditTask(task: Task) {
      this.modal.showModal(task);
    }
    onDeleteTask(task: Task){
      //vou refazer isso
      //this.tasksService.deleteTask(task.id);
    }

    generateId(){
      return this.tasksService.uid;
    }

    onDrop(event: CdkDragDrop<Task[]>, newStatus: Task['status']) {
      const draggedTask = event.previousContainer.data[event.previousIndex];

      if (draggedTask.status !== newStatus) {
        // Atualiza o status
        draggedTask.status = newStatus;

        // Atualiza no service (com signal)
        this.tasksService.updateTask(draggedTask);
      }

      // Atualiza visualmente entre colunas
      if (event.previousContainer !== event.container) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
  }
    
  }

