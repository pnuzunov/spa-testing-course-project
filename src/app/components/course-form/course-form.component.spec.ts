import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CourseFormComponent } from './course-form.component';
import { CoursesService } from 'src/app/services/courses.service';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Course } from 'src/app/models/course.model';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('CourseFormComponent', () => {
  let component: CourseFormComponent;
  let fixture: ComponentFixture<CourseFormComponent>;
  let course: Course;
  let titleField: AbstractControl | null;
  let descField: AbstractControl | null;


  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        {
          path: 'edit/:id',
          component: CourseFormComponent
        }
      ]),
      ReactiveFormsModule
      ],
      declarations: [ CourseFormComponent ],
      providers: [ {
        provide: CoursesService,
        useClass: class {
          saveCourse$ = jasmine.createSpy('saveCourse$').and.returnValue(of(undefined))
        }
      }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;

    course = {
      id: 1,
      title: 'test course',
      description: 'test description'
    }
    fixture.detectChanges();

    titleField = component.formGroup.get('title');
    descField = component.formGroup.get('description');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start as invalid form', () => {

    expect(component.formGroup.invalid).toBeTrue();
  })

  it('should not submit on empty form', () => {
    component.onSubmit();

    expect(titleField?.valid).toBeFalse();
    expect(component.errorMessage).not.toBe('');
  })

  it('should not submit on empty title', () => {
    
    descField?.setValue(course.description);
    component.onSubmit();

    expect(titleField?.valid).toBeFalse();
    expect(descField?.valid).toBeTrue();
    expect(component.errorMessage).toContain('title');
    expect(component.errorMessage).toContain('required');
  })

  it('should not submit on empty description', () => {
    titleField?.setValue(course.title);
    component.onSubmit();

    expect(titleField?.valid).toBeTrue();
    expect(descField?.valid).toBeFalse();
    expect(component.errorMessage).toContain('description');
    expect(component.errorMessage).toContain('required');
  })

  it('should not submit on short title', () => {

    titleField?.setValue('1');
    component.onSubmit();

    expect(titleField?.valid).toBeFalse();
    expect(component.errorMessage).toContain('title');
    expect(component.errorMessage).toContain('at least');
  })

  it('should not submit on short description', () => {

    titleField?.setValue(course.title);
    descField?.setValue('123');
    component.onSubmit();

    expect(descField?.valid).toBeFalse();
    expect(component.errorMessage).toContain('description');
    expect(component.errorMessage).toContain('at least');
  })

  it('should not submit on long description', () => {

    let description = course.description;

    titleField?.setValue(course.title);
    for(let i = 0 ; i < 10; i++) {
      description = description.concat(description);
    }
    descField?.setValue(description);
    component.onSubmit();

    expect(descField?.valid).toBeFalse();
    expect(component.errorMessage).toContain('description');
    expect(component.errorMessage).toContain('below');
  })

  it('should submit on valid form', () => {

    titleField?.setValue(course.title);
    descField?.setValue(course.description);
    expect(component.formGroup.valid).toBeTrue();

    const router = TestBed.inject(Router);
    const spy = spyOn(router, 'navigate');
    component.onSubmit();

    expect(component.errorMessage).toBe('');
    expect(spy).toHaveBeenCalledWith(['/']);
  })

});
