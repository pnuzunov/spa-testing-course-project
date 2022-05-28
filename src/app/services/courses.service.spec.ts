import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { flush, inject, TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";

describe('Courses Service', () => {

    let coursesService: CoursesService;
    let httpMock: HttpTestingController;

    const courses = [
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

    beforeEach(() => {
        TestBed.configureTestingModule({
          imports:[ HttpClientTestingModule ],
          declarations: [ ],
          providers: [ CoursesService ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpMock = TestBed.inject(HttpTestingController);
      });

      afterEach(() => {
          httpMock.verify();
      })

      it('should return result on getCourses$() call',() => {
        coursesService.getCourses$().subscribe((response) => {
            expect(response).toEqual(courses);
            expect(response).toHaveSize(courses.length);
        });

        const httpRequest = httpMock.expectOne('http://localhost:3000/courses');
        expect(httpRequest.request.method).toBe('GET');
        httpRequest.flush(courses);

      })

      it('should return result on getCourse$() call',() => {
        const courseToGet = {...courses[0]};

        coursesService.getCourse$(courseToGet.id).subscribe((response) => {
            expect(response.id).toEqual(courseToGet.id);
            expect(response.title).toEqual(courseToGet.title);
            expect(response.description).toEqual(courseToGet.description);
        });

        const httpRequest = httpMock.expectOne(`http://localhost:3000/courses/${courseToGet.id}`);
        expect(httpRequest.request.method).toBe('GET');
        httpRequest.flush(courseToGet);

      })

      it('should send DELETE method on deleteCourse$() call',() => {
        const courseToDelete = {...courses[0]};

        coursesService.deleteCourse$(courseToDelete.id).subscribe(() => {
        });

        const httpRequest = httpMock.expectOne(`http://localhost:3000/courses/${courseToDelete.id}`);
        expect(httpRequest.request.method).toBe('DELETE');
        httpRequest.flush(courseToDelete);

      })

      it('should send POST method on undefined id of saveCourse$() call', () => {
        const courseToPost = {
            title: courses[0].title,
            description: courses[0].description
        }

        coursesService.saveCourse$(courseToPost).subscribe((response) => {
            expect(response.title).toEqual(courseToPost.title);
            expect(response.description).toEqual(courseToPost.description);
        });

        const httpRequest = httpMock.expectOne(`http://localhost:3000/courses`);
        expect(httpRequest.request.method).toBe('POST');
        httpRequest.flush(courseToPost);
      })

      it('should send PUT method on defined id of saveCourse$() call', () => {
        const courseToPut = {...courses[0]};

        coursesService.saveCourse$(courseToPut).subscribe((response) => {
            expect(response.title).toEqual(courseToPut.title);
            expect(response.description).toEqual(courseToPut.description);
        });

        const httpRequest = httpMock.expectOne(`http://localhost:3000/courses/${courseToPut.id}`);
        expect(httpRequest.request.method).toBe('PUT');
        httpRequest.flush(courseToPut);
      })

})