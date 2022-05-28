import { browser, by, element } from "protractor";
import { CourseFormPage } from "./course-form.po"

describe('Course Form', () => {

    let page: CourseFormPage;

    beforeEach(() => {
        page = new CourseFormPage();
        browser.waitForAngularEnabled(false);
    })

    it('should add movie and redirect to courses page', async () => {
        await page.navigateToCreate();
        browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}new`), 10000);

        page.populateForm('test title', 'test description');
        const saveButton = page.getSaveButton();
        await saveButton.isPresent();
        browser.wait(browser.ExpectedConditions.elementToBeClickable(saveButton), 10000);
        await saveButton.click();

        await browser.wait(browser.ExpectedConditions.urlIs(browser.baseUrl), 10000);
        expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl);
    })
  
    it('should edit movie and redirect to courses page', async () => {
        await page.navigateToEdit(4);
        browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}edit/4`), 10000);

        await page.clearForm();
        await page.populateForm('edited title', 'edited description');
        const saveButton = page.getSaveButton();
        await saveButton.isPresent();
        browser.wait(browser.ExpectedConditions.elementToBeClickable(saveButton), 10000);
        await saveButton.click();

        await browser.wait(browser.ExpectedConditions.urlIs(browser.baseUrl), 10000);
        expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl);
    })

})