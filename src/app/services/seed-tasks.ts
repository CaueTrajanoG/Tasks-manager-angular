import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'app_task_manager_tasks_v1'
let cont = 0; //id's
export interface Task {
  id: number;
  title: string;
  due: string;
  level: 'low' | 'medium' | 'high';
  desc: string;
  status: 'todo' | 'doing' | 'done';
}



@Injectable({
  providedIn: 'root'
})

export class SeedTasks {

  allTasks = signal<Task[]>([]);


  parseToJsonTask(tasks: Task[]) : void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }

  private saveToStorage(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  seederTasks(): Task[] {
    const tasks : Task[] = [
      { id: this.uid(), title: 'Ler capítulo 3 de Algoritmos', due: this.addDaysISO(2), level: 'high', desc: 'Priorizar exercícios 3.1-3.5',  status: 'todo' },
      { id: this.uid(), title: 'Resolver lista de TS', due: this.addDaysISO(5), level: 'medium', desc: 'Atenção a generics', status: 'doing' },
      { id: this.uid(), title: 'Revisão rápida: HTML/CSS', due: this.addDaysISO(10), level: 'low', desc: '30 minutos', status: 'done' }
    ]
    this.parseToJsonTask(tasks)
    this.allTasks.set(tasks)
    return tasks
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
  
  addTask(task: Task) {
    const novaTask = { ...task, id: this.uid() };
    this.allTasks.update(tasks => {
      const updated = [...tasks, novaTask];
      this.saveToStorage(updated);
      return updated;})
  }
  deleteTask(id: number) {
    this.allTasks.update(tasks => {
      const updated = tasks.filter(t => t.id !== id);
      this.saveToStorage(updated);
      console.log()
      return updated;
    });
  }
  updateTask(task: Task) {
    this.allTasks.update(tasks => {
      const updated = tasks.map(t => (t.id === task.id ? task : t));
      this.saveToStorage(updated);
      console.log(updated)
      return updated;
    });
  }
  updatingTask(updatedTask: Task) {
    this.allTasks.update(tasks =>
      tasks.map(t => (t.id === updatedTask.id ? updatedTask : t))
    );
    this.parseToJsonTask(this.allTasks());
  }


}