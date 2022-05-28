import { browser, by, element, ElementFinder, promise } from 'protractor';

export class AppPage {
  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  async getTitleText(): Promise<string> {
    return element(by.css('.title-area .title')).getText();
  }

}
