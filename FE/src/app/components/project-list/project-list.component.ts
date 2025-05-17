import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Project, ProjectService } from '../../core/services/project.service';
import { RouterModule, Router, ActivatedRoute  } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [...this.projects];

  // injects
  authService = inject(AuthService);
  projectService = inject(ProjectService);


  ngOnInit(): void {
    
    this.route.params.subscribe(() => {
      this.refresh();
    });
    this.refresh();
    const userToken = sessionStorage.getItem('token') || "";
    this.notificationService.startConnection(userToken);
  }
  refresh(): void {
    this.projectService.loadProjects();
    this.projectService.getProjectList().subscribe((projects) => {
      this.projects = projects;
      this.filteredProjects = [...this.projects];
    });
    
  }
  filterProjects(searchQuery: string): void {
    this.filteredProjects = this.projects.filter(project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  constructor(private router: Router, private route: ActivatedRoute, private notificationService: NotificationService) { }
  deleteProject(id: number, name: string): void {
    this.projectService.deleteProject(id, name).subscribe((res: any) => {
      this.refresh();
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isViewer(): boolean {
    return this.authService.isViewer();
  }

  
}
