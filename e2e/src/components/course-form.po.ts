import { browser, by, element, ElementFinder } from "protractor";

export class CourseFormPage {

    async navigateToCreate(): Promise<unknown> {
        return browser.get(`${browser.baseUrl}new`);
    }

    async navigateToEdit(id: number): Promise<unknown> {
        return browser.get(`${browser.baseUrl}edit/${id}`);
    }

    getSaveButton(): ElementFinder {
        return element(by.css('[data-test-selector=save-button]'));
    }

    getCancelButton(): ElementFinder {
        return element(by.css('[data-test-selector=cancel-button]'));
    }

    async clearForm(): Promise<void> {
        await element(by.name('title')).clear();
        await element(by.name('description')).clear();
    }

    async populateForm(title: string, description: string): Promise<void> {
        await element(by.name('title')).sendKeys(title);
        await element(by.name('description')).sendKeys(description);
    }
}