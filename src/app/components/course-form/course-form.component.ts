import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, Subject, switchMap, takeUntil } from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['../../app.component.scss', './course-form.component.scss']
})
export class CourseFormComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;

  course: Course;

  destroy$ = new Subject<boolean>();

  errorMessage: string;



  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {
    this.formGroup = this.fb.group({});
    this.course = {title: "", description: ""};

    this.errorMessage = "";
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params) => {
        const id = params['id'];
        
        if(!id) {
          return of(null);
        }

        return this.coursesService.getCourse$(id);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (course) => {
        if(course)
          this.course = course;
        this.buildForm();
      }
    });

    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.formGroup.invalid) {

      const errorControl = this.formGroup.get('title')?.errors ? 'title' : 'description';
      const errorsForControl = this.formGroup.get(errorControl)?.errors;

      const errorObject = {
        control: errorControl,
        errors:  errorsForControl
      }

      if(errorObject.errors) {
        if(errorObject.errors['required']) {
          this.errorMessage = `The ${errorObject.control} field is required.`;
        }
        else if(errorObject.errors['minlength']) {
          this.errorMessage = `The ${errorObject.control} field requires at least ${errorObject.errors['minlength']['requiredLength']} characters.`;
        }
        else if(errorObject.errors['maxlength']) {
          this.errorMessage = `The ${errorObject.control} field must be below ${errorObject.errors['maxlength']['requiredLength']} characters.`;
        }
      }

      return;
    }

    this.coursesService.saveCourse$(this.formGroup.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      }
    });
  }

  private buildForm(): void {
    this.formGroup = this.fb.group({
      id: this.course?.id,
      title: [this.course?.title, [Validators.required, Validators.minLength(3)]],
      description: [this.course?.description, [Validators.required, Validators.minLength(10), Validators.maxLength(100)]]
    });
  }
}
