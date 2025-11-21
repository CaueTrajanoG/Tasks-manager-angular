import { inject, Injectable, signal } from '@angular/core';
import { DataService } from './data-service';
const STORAGE_KEY = 'app_task_manager_tasks_v1'
let cont = 0; //id's

export interface Task {
  id?: number;
  title: string;
  due: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  status: 'todo' | 'doing' | 'done';
}

@Injectable({
  providedIn: 'root'
})

export class SeedTasks {
  data = inject(DataService);
  allTasks = signal<Task[]>([]);


  parseToJsonTask(tasks: Task[]) : void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }

  private saveToStorage(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  seederTasks(): void {
    this.data.getTasks().subscribe(tasks => {
      this.allTasks.set(tasks);
    });
  }

  addDaysISO(n:number){
    const d = new Date()
    d.setDate(d.getDate()+n)
    return d.toISOString().slice(0,10)
  }

  uid():number { return  cont++ }

  getTasks() {
    return this.allTasks.asReadonly(); // só leitura fora do service
  }
  
  addTask(newTask: Task) {
    this.data.postTasks(newTask).subscribe();
    this.seederTasks();
  }

  deleteTask(id: number) {
    //making...
    this.data.deleteTask(id).subscribe({
      next: () => console.log("Deletado!"),
      error: err => console.error(err)
    });
    this.seederTasks();
  }

  updateTask(id:number, partial: Partial<Task>) {
    this.data.pathTask(id, partial).subscribe();    
    this.seederTasks();
  }
  
  updatingTask(updatedTask: Task) {
    this.allTasks.update(tasks =>
      tasks.map(t => (t.id === updatedTask.id ? updatedTask : t))
    );
    this.parseToJsonTask(this.allTasks());
  }


}