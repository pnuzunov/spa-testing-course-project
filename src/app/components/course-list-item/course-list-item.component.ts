import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from 'src/app/models/course.model';

@Component({
  selector: 'app-course-list-item',
  templateUrl: './course-list-item.component.html',
  styleUrls: ['../../app.component.scss', './course-list-item.component.scss']
})
export class CourseListItemComponent {

  @Input() course!: Course;
  @Output() deleted = new EventEmitter<number>();

  onDelete(): void {
    this.deleted.emit(this.course.id);
  }
}
