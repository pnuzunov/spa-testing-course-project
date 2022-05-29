import { browser, by, element } from "protractor";
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
        const pageTitle = page.getPageTitle();
        await pageTitle.isPresent();
        await browser.wait(browser.ExpectedConditions.visibilityOf(pageTitle), 10000);

        expect(await pageTitle.getText()).toEqual('Add new course'.toUpperCase());
    })

    it('should add movie and redirect to courses page', async () => {
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
        await saveButton.isPresent();
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
        const pageTitle = page.getPageTitle();
        await pageTitle.isPresent();

        expect(await pageTitle.getText()).toEqual('Edit course'.toUpperCase());
    })

    it('should edit movie and redirect to courses page', async () => {
        await page.navigateToEdit(4);
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}edit/4`), 10000);

        await page.clearForm();
        await page.populateForm('edited title', 'edited description');
        const saveButton = page.getSaveButton();
        await saveButton.isPresent();
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(saveButton), 10000);
        await saveButton.click();

        await browser.wait(browser.ExpectedConditions.urlIs(browser.baseUrl), 10000);
        expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl);

        const listPage = new CourseListPage();
        let item = listPage.getCourseTitle(4);
        await item.isPresent();
        await browser.wait(browser.ExpectedConditions.visibilityOf(item), 10000);

        expect(await item.getText()).toBe('edited title'.toUpperCase());
    })

    it('should go back to courses list when cancel button is clicked', async () => {
        await page.navigateToCreate();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}new`));

        const cancelButton = page.getCancelButton();
        await cancelButton.isPresent();
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(cancelButton), 10000);
        await cancelButton.click();

        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}`));
        expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl);
    })

    it('should not create movie on empty form', async () => {
        await page.navigateToCreate();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}new`), 10000);

        const saveButton = page.getSaveButton();
        await saveButton.isPresent();
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(saveButton), 10000);
        await saveButton.click();

        await browser.sleep(500);
        expect(await browser.getCurrentUrl()).toEqual(`${browser.baseUrl}new`);
    })
})