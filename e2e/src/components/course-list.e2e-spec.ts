import { browser } from "protractor";
import { CourseListPage } from "./course-list.po"

describe('Course List', () => {
    let page: CourseListPage;

    beforeEach( () => {
        page = new CourseListPage();
        browser.waitForAngularEnabled(false);
    })

    it('should be on base url when page is loaded', async () => {
        await page.navigateTo();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}`), 10000);
        expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl);
    })

    it('should load courses after page is loaded', async () => {
        await page.navigateTo();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}`), 10000);
        await browser.sleep(500);
        const items = page.getCourseElements();
        browser.sleep(500);
        expect(items['length']).not.toBe(0);
    })

    it('should go to add course page when add button is clicked', async () => {
        await page.navigateTo();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}`), 10000);
        const button = page.getAddButton();
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(button), 10000);
        await button.click();

        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}new`), 10000);
        expect(await browser.getCurrentUrl()).toEqual(`${browser.baseUrl}new`);
    })

    it('should go to edit course page when edit button is clicked', async () => {
        await page.navigateTo();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}`), 10000);
        const editButton = page.getEditButton(4);
        await browser.wait(browser.ExpectedConditions.elementToBeClickable(editButton), 10000);
        await editButton.click();

        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}edit/4`), 10000);
        expect(await browser.getCurrentUrl()).toEqual(`${browser.baseUrl}edit/4`);
    })

    it('should delete course and update course list', async () => {
        await page.navigateTo();
        await browser.wait(browser.ExpectedConditions.urlIs(`${browser.baseUrl}`), 10000);
        await browser.sleep(500);

        let items = await page.getCourseElements();
        const length = items.length;
        expect(length).not.toBe(0);

        const delButton = page.getDeleteButton(4);
        browser.wait(browser.ExpectedConditions.elementToBeClickable(delButton), 10000);
        await delButton.click();

        await browser.sleep(500);
        items = await page.getCourseElements();

        expect(items.length).toBe(length - 1);
    })
})