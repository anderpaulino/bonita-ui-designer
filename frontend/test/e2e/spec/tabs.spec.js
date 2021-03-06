var PageEditor = require('../pages/editor.page.js');

describe('tabs test', function() {

  var editor;

  beforeEach(function() {
    editor = PageEditor.get('empty');
    editor.addTabsContainer();
  });

  it('should not allow moving first tab left', function() {
    var firstTab = $$('tabs-container li a').first();
    expect(firstTab.element(by.css('.move-tab-left')).isPresent()).toBe(false);
    firstTab.click();
    expect(firstTab.element(by.css('.move-tab-left')).isPresent()).toBe(false);
  });

  it('should not allow moving last tab right', function() {
    var lastTab = $$('tabs-container li a').last();
    expect(lastTab.element(by.css('.move-tab-right')).isPresent()).toBe(false);
    lastTab.click();
    expect(lastTab.element(by.css('.move-tab-right')).isPresent()).toBe(false);
  });

  it('should allow moving a tab left', function() {
    var lastTab = $$('tabs-container li a').last();
    expect(lastTab.element(by.css('.move-tab-left')).isPresent()).toBe(false);
    lastTab.click();
    expect(lastTab.element(by.css('.move-tab-left')).isPresent()).toBe(true);

    lastTab.element(by.css('.move-tab-left')).click();

    expect($$('tabs-container li a').first().getText()).toBe('Tab 2');
  });

  it('should allow moving a tab right', function() {
    var firstTab = $$('tabs-container li a').first();
    expect(firstTab.element(by.css('.move-tab-right')).isPresent()).toBe(false);
    firstTab.click();
    expect(firstTab.element(by.css('.move-tab-right')).isPresent()).toBe(true);

    firstTab.element(by.css('.move-tab-right')).click();

    expect($$('tabs-container li a').last().getText()).toBe('Tab 1');
  });

  it('should allow removing a tab unless except the last one', function() {
    var firstTab = $$('tabs-container li a').first();
    firstTab.click();

    // Thanks to cancer chrome driver... cf {@link https://code.google.com/p/selenium/issues/detail?id=2766}
    browser.executeScript("$('#remove-tab').click();")
      .then(function() {
        expect($$('tabs-container li a').count()).toBe(1);

        browser.executeScript("$('tabs-container li a').eq(0).click()")
          .then(function() {
            expect($('#remove-tab').isPresent()).toBe(false);
          });
      });


  });

  it('should allow adding a tab before the current one', function() {
    var firstTab = $$('tabs-container li a').first();
    firstTab.click();

    $('#add-tab-before').click();
    expect($$('tabs-container li a').count()).toBe(3);

    expect($$('tabs-container li a').first().getText()).toBe('Tab 3');
  });

  it('should allow adding a tab after the current one', function() {
    var firstTab = $$('tabs-container li a').first();
    firstTab.click();

    $('#add-tab-after').click();
    expect($$('tabs-container li a').count()).toBe(3);

    expect($$('tabs-container li a').get(1).getText()).toBe('Tab 3');
  });

  it('should allow setting a tab title', function() {
    var firstTab = $$('tabs-container li a').first();
    firstTab.click();

    $('#tab-title-input').clear();
    $('#tab-title-input').sendKeys('Hello');
    expect($$('tabs-container li a').first().getText()).toBe('Hello');
  });

  it('should not disappear if I take the tabContainer and push it in itself nor its children', function() {

    editor.drag('#tabsContainer-0').andDropOn('#tabsContainer-0 .bo-dropzone-container',true);
    expect($('#tabsContainer-0').isPresent()).toBe(true);

    editor.addElement('tabsContainer').to('#tabsContainer-0 .bo-dropzone-container',true);

    editor.drag('#tabsContainer-0').andDropOn('#tabsContainer-1 .bo-dropzone-container',true);
    expect($('#tabsContainer-0').isPresent()).toBe(true);
    expect($('#tabsContainer-1').isPresent()).toBe(true);

    editor.drag('#tabsContainer-1').andDropOn('#tabsContainer-1 .bo-dropzone-container',true);
    expect($('#tabsContainer-0').isPresent()).toBe(true);
    expect($('#tabsContainer-1').isPresent()).toBe(true);

  });

  it('should not disappear if I take the parent tabContainer and push it in a container inside of itself', function() {

    editor.addElement('container').to('#tabsContainer-0 .bo-dropzone-container',true);

    editor.drag('#tabsContainer-0').andDropOn('#container-2 .bo-dropzone-container',true);
    expect($('#tabsContainer-0').isPresent()).toBe(true);
    expect($('#container-2').isPresent()).toBe(true);

    editor.addElement('tabsContainer').to('#container-2 .bo-dropzone-container',true);

    editor.drag('#tabsContainer-0').andDropOn('#tabsContainer-1 .bo-dropzone-container',true);
    expect($('#tabsContainer-0').isPresent()).toBe(true);
    expect($('#tabsContainer-1').isPresent()).toBe(true);
    expect($('#container-2').isPresent()).toBe(true);
  });
});
