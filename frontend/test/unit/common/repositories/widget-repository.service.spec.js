describe('widgetRepo', function() {
  var widgetRepo, $httpBackend, widgets;

  // just a label and an input.
  var widgetsJson = [
    {
      id: 'label',
      name: 'Label'
    },
    {
      id: 'input',
      name: 'Input',
      properties: ['property']
    }
  ];

  beforeEach(module('pb.common.repositories'));
  beforeEach(inject(function(_$httpBackend_, _widgetRepo_) {
    widgetRepo = _widgetRepo_;
    $httpBackend = _$httpBackend_;
  }));

  it('should save a widget', function() {
    var widget = {
      id: 'awesome-custom-widget',
      name: 'Awesome Widget',
      template: '<div>Hello {{ properties.value }}</div>',
      properties: [
        { name: 'value', label: 'Value', type: 'text'}
      ]
    };
    $httpBackend.expectPUT('rest/widgets/awesome-custom-widget', widget).respond(200);

    widgetRepo.save(widget);

    $httpBackend.flush();
  });

  it('should get all widgets', function() {
    var widgets = [{ id: 'label', name: 'Label'}, { id: 'input', name: 'Input'}];
    $httpBackend.expectGET('rest/widgets').respond(widgets);

    widgetRepo.all().then(function(response) {
      expect(response.data).toEqual(widgets);
    });

    $httpBackend.flush();
  });

  it('should get widget by ID', function() {
    var widget;
    $httpBackend.expectGET('rest/widgets/label').respond({ id: 'label', name: 'Label'});

    widgetRepo.getById('label').then(function(response) {
      widget = response.data;
    });

    $httpBackend.flush();
    expect(widget.name).toBe('Label');
  });

  it('should create a widget with default template and controller', function() {
    var widget = {
      name: 'newWidgetName',
      template: '<div ng-click="ctrl.sayClicked()">Enter your template here, using {{ properties.value }}</div>',
      controller: 'function($scope) {\n    this.sayClicked = function() {\n        $scope.properties.value = \'clicked\';\n    };\n}',
      custom: true,
      properties: [
        {
          label: 'Value',
          name: 'value',
          type: 'text',
          defaultValue: 'This is the initial value'
        }
      ]
    };
    $httpBackend.expectPOST('rest/widgets', widget).respond(200);

    widgetRepo.create(widget);

    $httpBackend.flush();
  });

  it('should delete a widget', function() {
    $httpBackend.expectDELETE('rest/widgets/awesome-custom-widget').respond(200);

    widgetRepo.delete('awesome-custom-widget');

    $httpBackend.flush();
  });

  it('should get all custom widgets', function() {
    $httpBackend.expectGET('rest/widgets?view=light').respond([
      {id: 'label', custom: false},
      {id: 'custom', custom: true}
    ]);

    var customs = [];
    widgetRepo.customs()
      .then(function(widgets){
        customs = widgets;
      });

    $httpBackend.flush();
    expect(customs.length).toBe(1);
  });

  it('should add a property to a widget', function() {
    var property = { name: 'value', label: 'Value', type: 'text'};
    $httpBackend.expectPOST('rest/widgets/awesome-custom-widget/properties', property).respond(200);

    widgetRepo.addProperty('awesome-custom-widget', property);

    $httpBackend.flush();
  });

  it('should update a property of a widget', function() {
    var property = { name: 'value', label: 'Value', type: 'text'};
    $httpBackend.expectPUT('rest/widgets/awesome-custom-widget/properties/toBeUpdated', property).respond(200);

    widgetRepo.updateProperty('awesome-custom-widget', 'toBeUpdated', property);

    $httpBackend.flush();
  });

  it('should delete a property of a widget', function() {
    var property = { name: 'value', label: 'Value', type: 'text'};
    $httpBackend.expectDELETE('rest/widgets/awesome-custom-widget/properties/toBeDeleted').respond(200);

    widgetRepo.deleteProperty('awesome-custom-widget', 'toBeDeleted');

    $httpBackend.flush();
  });

  it('should compute widget export url', function() {
    var widget = {id: 'widgetId'};

    var url = widgetRepo.exportUrl(widget);

    expect(url).toBe('export/widget/widgetId');
  });

});
