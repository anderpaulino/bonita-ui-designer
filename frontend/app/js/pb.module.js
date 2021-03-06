(function() {

  'use strict';

  angular.module('pb.filters', []);
  angular.module('pb.controllers', ['pb.filters']);
  angular.module('pb.services', ['pb.filters']);
  angular.module('pb.factories', ['pb.filters']);
  angular.module('pb.directives', ['pb.filters']);
  angular.module('org.bonitasoft.pagebuilder.widgets', []);

  angular.module('pb', [
    'app.route',
    'pb.preview',
    'pb.home',
    'pb.custom-widget',
    'pb.common.repositories',
    'pb.common.services',
    'pb.controllers',
    'pb.factories',
    'pb.services',
    'pb.directives',
    'pb.filters',
    'ngSanitize',
    'ui.router',
    'RecursionHelper',
    'ui.bootstrap',
    'ui.ace',
    'org.bonitasoft.pagebuilder.widgets',
    'org.bonitasoft.dragAndDrop',
    'gettext',
    'ngUpload',
    'angularMoment'
  ]);
})();
