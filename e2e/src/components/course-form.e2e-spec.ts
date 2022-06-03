import { browser } from "protractor";
import { CourseFormPage } from "./course-form.po"
import { CourseListPage } from "./course-list.po";

describe('Course Form', () => {

    let page: CourseFormPage;

    beforeEach(() => {
        page = new CourseFormPage();
        browser.waitForAngularEnabled(false);
    })

    it('should have proper title when page is in create mode', async () => {
        await page.navigateToCreate();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}new`));
        expect(await browser.getCurrentUrl()).toBe(`${browser.baseUrl}new`);

        const pageTitle = page.getPageTitle();
        await browser.wait(browser.ExpectedConditions.visibilityOf(pageTitle), 10000);

        expect(await pageTitle.getText()).toEqual('Add new course'.toUpperCase());
    })

    it('should add course and redirect to courses page', async () => {
        const listPage = new CourseListPage();
        await listPage.navigateTo();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}`), 10000);
        await browser.sleep(500);

        let items = await listPage.getCourseElements();
        const length = items.length;

        await page.navigateToCreate();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}new`), 10000);

        await page.populateForm('test title', 'test description');
        const saveButton = page.getSaveButton();
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(saveButton), 10000);
        await saveButton.click();

        await browser.wait(browser.ExpectedConditions.urlIs(browser.baseUrl), 10000);
        expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl);
        await browser.sleep(500);

        items = await listPage.getCourseElements();
        expect(items.length).toBe(length + 1);
    })

    it('should have proper title when page is in edit mode', async () => {
        await page.navigateToEdit(4);
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}edit/4`));
        expect(await browser.getCurrentUrl()).toBe(`${browser.baseUrl}edit/4`);

        const pageTitle = page.getPageTitle();
        await browser.wait(browser.ExpectedConditions.visibilityOf(pageTitle));

        expect(await pageTitle.getText()).toEqual('Edit course'.toUpperCase());
    })

    it('should edit course and redirect to courses page', async () => {
        await page.navigateToEdit(4);
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}edit/4`), 10000);

        await page.clearForm();
        await page.populateForm('edited title', 'edited description');
        const saveButton = page.getSaveButton();
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(saveButton), 10000);
        await saveButton.click();

        await browser.wait(browser.ExpectedConditions.urlIs(browser.baseUrl), 10000);
        expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl);

        const listPage = new CourseListPage();
        const courseTitle = listPage.getCourseTitle(4);
        await browser.wait(browser.ExpectedConditions.visibilityOf(courseTitle), 10000);

        expect(await courseTitle.getText()).toBe('edited title'.toUpperCase());
    })

    it('should go back to courses list when cancel button is clicked', async () => {
        await page.navigateToCreate();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}new`));

        const cancelButton = page.getCancelButton();
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(cancelButton), 10000);
        await cancelButton.click();

        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}`));
        expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl);
    })

    it('should not create course on empty form', async () => {
        await page.navigateToCreate();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}new`), 10000);

        const saveButton = page.getSaveButton();
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(saveButton), 10000);
        await saveButton.click();

        const errorMessage = page.getErrorMessage();
        await browser.wait(browser.ExpectedConditions.presenceOf(errorMessage), 10000);
        expect(await errorMessage.getText()).not.toBe('');
        expect(await browser.getCurrentUrl()).toEqual(`${browser.baseUrl}new`);
    })

    it('should not edit course on invalid form', async () => {
        await page.navigateToEdit(4);
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}edit/4`), 10000);

        await page.clearForm();
        await page.populateForm('12', '34');

        const saveButton = page.getSaveButton();
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(saveButton), 10000);
        await saveButton.click();

        const errorMessage = page.getErrorMessage();
        await browser.wait(browser.ExpectedConditions.presenceOf(errorMessage), 10000);
        expect(await errorMessage.getText()).not.toBe('');
        expect(await browser.getCurrentUrl()).toEqual(`${browser.baseUrl}edit/4`);
    })
})