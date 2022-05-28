import { browser, by, element, ElementArrayFinder, ElementFinder } from "protractor";

export class CourseListPage {

    async navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl);
    }

    async getTitleText(): Promise<string> {
        return element(by.css('[data-test-selector=course-list-title]')).getText();
    }

    getCourseElements(): ElementArrayFinder {
        return element.all(by.tagName('app-course-list-item'));
    }

    getCourseTitle(id: number): ElementFinder {
        return element(by.id(`course-title-${id}`));
    }

    getAddButton(): ElementFinder {
        return element(by.css('[data-test-selector=add-button]'));
    }

    getEditButton(id: number): ElementFinder {
        return element(by.id(`btn-edit-${id}`));
    }

    getDeleteButton(id: number): ElementFinder {
        return element(by.id(`btn-delete-${id}`));
    }
    
}