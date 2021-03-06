describe('formContainer', function() {
  var $compile, $rootScope, $document, element;

  beforeEach(module('pb.directives', 'pb.services', 'pb.common.services', 'pb.factories', 'RecursionHelper', 'pb.common.repositories'));
  beforeEach(module('ui.router'));
  beforeEach(module('pb.templates'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _$document_ ) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;

    // given an element containing the directive
    var template = '<form-container id="{{ id }}" form-container="formContainer" editor="editor"></form-container>';
    // when compiling with tabs container containing 2 tabs
    var row = [];
    var parentContainerRow = {
      row: row
    };

    $rootScope.formContainer = {
      type: 'formContainer',
      container: {
        rows: [ ]
      }
    };

    row.push($rootScope.container);
    $rootScope.id = 'formContainer-1';
    $rootScope.editor = {
      isCurrentComponent: function () {
        return false;
      },
      isCurrentRow: function () {
        return false;
      }
    };

    element = $compile(template)($rootScope);
    $rootScope.$digest();
  }));

  it('should display the formContainer', function() {
    // then we should have
    expect(element.find('form').length).toBe(1);
    expect(element.find('form').attr('name')).toBe('form-' + $rootScope.id);
    expect(element.find('container').length).toBe(1);
  });

});
