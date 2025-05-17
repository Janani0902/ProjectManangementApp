

import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { ProjectListComponent } from "./components/project-list/project-list.component";
import { authGuard } from './core/guards/auth.guard';
import { ProjectFormComponent } from "./components/project-form/project-form.component";
import { NgModule } from "@angular/core";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Project Management' },
  { path: 'projects', component: ProjectListComponent, canActivate: [authGuard], title: 'Projects' },
  { path: 'project-form', component: ProjectFormComponent, canActivate: [authGuard], title: 'Create Project' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
