import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['../../app.component.scss', './course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  courses: Course[];

  constructor(private coursesService: CoursesService) {
    this.courses = [];
  }

  ngOnInit(): void {
    this.coursesService.getCourses$().subscribe({
      next: (result: Course[]) => {
        this.courses = result;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  onItemDeleted(id: number): void {
    this.coursesService.deleteCourse$(id).subscribe({
      next: () => {
        this.courses = this.courses.filter(courses => courses.id !== id);
      }
    });
  }

}
