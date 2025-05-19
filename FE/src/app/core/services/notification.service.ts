import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from './project.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  constructor(private toastr: ToastrService, private ProjectService: ProjectService) {}

  startConnection(token: string) {
    if (this.hubConnection) {
      return
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7222/projectHub', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('Error while starting connection:', err));

    
    this.hubConnection.off('ProjectCreated');
    this.hubConnection.off('ProjectUpdated');
    this.hubConnection.off('ProjectDeleted');

    this.hubConnection.on('ProjectCreated', (project) => {
      this.ProjectService.loadProjects();
      this.toastr.success(`Project "${project.name}" was created`);
    });

    this.hubConnection.on('ProjectUpdated', (project) => {
 this.ProjectService.loadProjects();
      console.log("Event Received:", project.name);
      this.toastr.info(`Project "${project.name}" was updated`);
    });

    this.hubConnection.on('ProjectDeleted', (project) => {
 this.ProjectService.loadProjects();
      this.toastr.error(`Project with ID "${project.name}" was deleted`);
    });

    this.hubConnection.onclose(() => {
      console.warn("SignalR Disconnected. Attempting to reconnect...");
      setTimeout(() => this.startConnection(token), 5000); 
    });
  }
}
