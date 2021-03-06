describe('custom widget editor', function() {

  beforeEach(function() {
    browser.get('#/en/widget/customAwesomeWidget');
  });

  var clearAndFillAceEditor = function(elementId, text) {
    browser.actions().doubleClick($('#' + elementId + ' .ace_content')).perform();
    var area = $('#' + elementId + ' textarea');
    area.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, protractor.Key.ALT, protractor.Key.SHIFT,  'd'));
    area.sendKeys(text);
  };

  function getPropertyNamesInList() {
    return element.all(by.css('.property-name')).map(function(elm) {
      return elm.getText();
    });
  }

  it('should display custom widget properties', function() {
    var properties = getPropertyNamesInList();

    expect(properties).toEqual(['qualifier', 'verb']);
  });

  it('should allow to add a property', function() {
    $('#create').click();

    $('#name').sendKeys('newProperty');
    $('#label').sendKeys('new property');
    $('#default').sendKeys('Default value');

    $('button[type="submit"]').click();

    var properties = getPropertyNamesInList();
    expect(properties).toContain('newProperty');
  });

  it('should allow to update a property', function() {
    var editButton = element.all(by.repeater('property in widget.properties')).first().element(by.css('i.fa-pencil'));
    editButton.click();

    var oldParamName = $('#name').getAttribute('value');
    $('#name').clear();
    $('#name').sendKeys('updatedProperty');
    $('#label').clear();
    $('#label').sendKeys('updated property');
    $('#default').clear().sendKeys('Default value');

    $('button[type="submit"]').click();

    var properties = getPropertyNamesInList();
    expect(properties).not.toContain(oldParamName);
    expect(properties).toContain('updatedProperty');
  });

  it('should allow to delete a property', function() {
    var firstParam = element.all(by.repeater('property in widget.properties')).first();
    var firstParamName = firstParam.element(by.css('.property-name')).getText();

    firstParam.element(by.css('i.fa-trash')).click();

    var properties = getPropertyNamesInList();
    expect(properties).not.toContain(firstParamName);
  });

  it('should allow to edit a widget template and controller', function() {
    // change template
    clearAndFillAceEditor('template', '<div ng-click="sayHello()">My {{ properties.qualifier }} widget just {{ properties.verb }}!</div>');

    // change controller
    clearAndFillAceEditor('controller', '$scope.sayHello = function(){ $scope.property.verb = \'saying hello\' };');

    // save it
    $('#save').click();

    // should go back to root when saved
    expect(browser.getCurrentUrl()).toMatch(/.*#\//);
  });
});
