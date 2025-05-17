import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent {
  projectForm: FormGroup;
  isEditMode = false;
  projectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id'] ? +params['id'] : null;
      this.isEditMode = this.projectId !== null;
      if (this.isEditMode && this.projectId !== null) {
        const project = this.projectService.getProjectById(this.projectId);
        console.log("project", project)
        if (project) {
          this.projectForm.patchValue(project);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      if (this.isEditMode && this.projectId !== null) {
        this.projectService.updateProject(this.projectId, this.projectForm.value).subscribe(res => {});
      } else {
        this.projectService.addProject(this.projectForm.value).subscribe(res => {});
      }

      this.router.navigate(['/projects']);
    } else {
      console.log('Invalis project details')
    }
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.projectForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
