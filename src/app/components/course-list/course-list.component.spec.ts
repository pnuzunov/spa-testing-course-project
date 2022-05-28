import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoursesService } from 'src/app/services/courses.service';

import { CourseListComponent } from './course-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Course } from 'src/app/models/course.model';
import { Observable, of } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export class CoursesMockService {

  static coursesCount = 3;

  courses = [
    {
      id: 1,
      title: 'mock course 1',
      description: 'mock desc 1'
    },
    {
      id: 2,
      title: 'mock course 2',
      description: 'mock desc 2'
    },
    {
      id: 3,
      title: 'mock course 3',
      description: 'mock desc 3'
    }
  ]

  getCourses$(): Observable<Course[]> {
    return of(this.courses);
  }

  deleteCourse$(id: number): Observable<undefined> {
    this.courses = this.courses.filter((course) => course.id !== id);
    return of(undefined);
  }

}

@Component({
  selector: 'app-course-list-item',
  template: ''
})
export class CourseMockListItem {
  @Input() course!: Course;
  @Output() deleted = new EventEmitter<number>();
}

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
        CommonModule
      ],
      declarations: [ CourseListComponent, CourseMockListItem ],
      providers: [ {
        provide: CoursesService,
        useClass: CoursesMockService
      } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no courses if ngOnInit() is not called', () => {
    expect(component.courses).toHaveSize(0);
  })

  it('should load courses on ngOnInit() call', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const elements = fixture.nativeElement.querySelectorAll('app-course-list-item');
    const courses = Array.from(elements);

    expect(component.courses).toHaveSize(CoursesMockService.coursesCount);
    expect(courses).toHaveSize(component.courses.length);
  })

  it('should delete course with the right id', () => {
    component.ngOnInit();
    fixture.detectChanges();

    component.onItemDeleted(1);
    expect(component.courses).toHaveSize(CoursesMockService.coursesCount - 1);
    expect(component.courses.find((course) => course.id == 1)).toBeUndefined();
  })

});
