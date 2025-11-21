import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from './seed-tasks';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private apiClient = inject(HttpClient);
  private readonly _apiUrl = 'https://veoumsjwfxjadzaosiqf.supabase.co/rest/v1/tasks';
  private readonly _apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlb3Vtc2p3ZnhqYWR6YW9zaXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzQxNzksImV4cCI6MjA3OTA1MDE3OX0.iBwcLxZC_zmSgUIPT1ti1LfgwLdJPWwYIsLpkQEDG5U';

  //simplificando os cabeçalhos da api
  private headers() {
    return {
      apikey: this._apiKey,
      Authorization: `Bearer ${this._apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    };
  }

  //Get para buscar lista de tasks
  getTasks(): Observable<Task[]> {
    return this.apiClient.get<Task[]>(this._apiUrl,
      {
        headers: this.headers()
      }).pipe(
        catchError(this.handleError)
      )
  }    
  //Post para criar novos registros
  postTasks(task: Task){
    delete task.id;
    return  this.apiClient.post(this._apiUrl, task, { 
      headers: this.headers() 
    })
    .pipe(
      catchError(this.handleError)
    )
  }
  //Patch para editar campos especificos
  pathTask(id:number, partial: Partial<Task>): Observable<Task[]>{
    const newUrl = `${this._apiUrl}?id=eq.${id}`;
    return this.apiClient.patch<Task[]>(newUrl, partial, {
      headers: this.headers()
    }).pipe(
      catchError(this.handleError)
    )
  }

  //Alterar status dos cards
  alterStatus(id:number, newStatus: string,partial:Partial<Task>): Observable<Task[]>{
    if(newStatus == 'todo'){
      partial = { status : 'todo'}
    }else if(newStatus == 'doing'){
      partial = { status : 'doing'}            
    }else{
      partial = { status : 'done'}           
    }
    const newUrl = `${this._apiUrl}?id=eq.${id}`;
    return this.apiClient.patch<Task[]>(newUrl, partial, {
      headers: this.headers()
    }).pipe(
      catchError(this.handleError)
    )
    
  }

  //Delete
  deleteTask(id:number){
    const newUrl = `${this._apiUrl}?id=eq.${id}`;
    return this.apiClient.delete<Task[]>(newUrl, {
      headers: this.headers()
    }).pipe(
      catchError(this.handleError)
    )
  }

  //Tratando erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error("ERRO NA API SUPABASE:");
    console.error("Status:", error.status);
    console.error("Mensagem:", error.message);
    console.error("Body:", error.error);
    console.error("Headers:", error.headers);

  return throwError(() => new Error(error.message || "Erro desconhecido"));
  }

}
