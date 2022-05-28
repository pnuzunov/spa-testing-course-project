import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Course } from "../models/course.model";

@Injectable({
    providedIn: 'root'
})

export class CoursesService {

    url = 'http://localhost:3000/courses';

    constructor(private http: HttpClient) {}

    getCourses$(): Observable<Course[]> {
        return this.http.get<Course[]>(this.url);
    }

    getCourse$(id: number): Observable<Course> {
        return this.http.get<Course>(`${this.url}/${id}`);
    }

    saveCourse$(course: Course): Observable<Course> {
        if(!course.id) {
            return this.createCourse$(course);
        }
        else {
            return this.updateCourse$(course);
        }
    }

    private createCourse$(course: Course): Observable<Course> {
        return this.http.post<Course>(this.url, course);
    }

    private updateCourse$(course: Course): Observable<Course> {
        return this.http.put<Course>(`${this.url}/${course.id}`, course);
    }

    deleteCourse$(id: number): Observable<Course> {
        return this.http.delete<Course>(`${this.url}/${id}`);
    }
}