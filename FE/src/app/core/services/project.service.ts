import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Project {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projects: Project[] = [
   
  ];
  private projectSubject = new BehaviorSubject<Project[]>(this.projects);
  private projectIdCounter = 4;
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Projects`;

  constructor(private toastr: ToastrService) {}
  loadProjects(): void {
    this.http.get<Project[]>(this.baseUrl).subscribe({
      next: (projects) => {
        this.projectSubject.next(projects); 
        this.projects = projects;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.toastr.error('Failed to load projects', 'Error');
      }
    });
  }
  getProjectList(): Observable<Project[]> {
    return this.projectSubject.asObservable();
  }

  addProject(project: Omit<Project, 'id'>): Observable<any> {
    return this.http.post(this.baseUrl, project);
    
  }

  updateProject(id: number, updatedProject: Project): Observable<any> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, updatedProject);
    
  }

  deleteProject(id: number, name: string): Observable<void>  {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
   
  }

  getProjectById(id: number): Project | undefined {
    console.log(this.projects)
    return this.projects.find((p) => p.id === id);
  }
}
