/* global browser, by, element */

var Preview = require('./preview.page.js');
var SideBar = require('./data-panel.page');

(function () {
  'use strict';

  function PageEditor() {
  }

  PageEditor.get = function (pageId) {
    browser.get('#/en/pages/' + pageId || 'empty');

    // wait for angular to be ready;
    browser.waitForAngular();

    return new PageEditor();
  };

  module.exports = PageEditor;

  /**
   * Drag an item to a destination
   * @param  {String} element CSS selector
   * @return {Object}
   */
  function drag(element) {
    var simulateDragDrop = '$(\'%source%\').simulateDragDrop({ dropTarget: \'%dest%\'})';

    return {
      /**
       * Drop destination for a node
       * @param  {String} dropZone CSS selector
       * @param {Boolean} first Select the first item
       * @param {Boolean} last Select the last item
       * @return {void}
       */
      andDropOn: function (dropZone, first, last) {

        var suffix = '';

        if (first) {
          suffix = ':first';
        }
        if (last) {
          suffix = ':last';
        }

        var command = simulateDragDrop
          .replace('%source%', element)
          .replace('%dest%', dropZone + suffix);
        browser.executeScript(command);
      }
    };
  }

  var pageEditor = {

    // set selected widget/container width
    setWidth: function (width) {
      var input = element(by.id('width'));
      input.clear();
      input.sendKeys(width);
    },

    // add a widget by its id
    addElement: function (elementId) {
      var draggedElement = drag('#' + elementId);
      return {
        to: draggedElement.andDropOn
      };
    },

    drag: function (selector) {
      return drag(selector);
    },

    // add a widget by its id
    addWidget: function (widgetId) {
      this.addElement(widgetId).to('.widget-placeholder');
    },

    // remove selected widget
    removeWidget: function () {
      var selectedItem = element(by.css('.component-element--selected'));
      browser.actions().mouseMove(selectedItem).perform();
      element(by.css('.component-element--selected .fa.fa-times-circle')).click();
    },

    // add a containe
    addContainer: function () {
      this.addElement('container').to('.widget-placeholder', false, true);
    },

    // add a Tabs container
    addTabsContainer: function () {
      this.addElement('tabsContainer').to('.widget-placeholder', false, true);
    },

    // add a Tabs container
    addFormContainer: function () {
      this.addElement('formContainer').to('.widget-placeholder', false, true);
    },

    dataPanel: function () {
      return new SideBar();
    },

    property: function (propertyName) {
      return $('#widget-properties').element(by.id('property-' + propertyName));
    }
  };

  PageEditor.prototype = Object.create(pageEditor, {

    // Palette listing widgets
    palette: {
      get: function () {
        return element(by.id('palette'));
      }
    },

    // editor rows
    rows: {
      get: function () {
        return element.all(by.css('#editor > .widget-wrapper > [ng-repeat="row in container.rows"]'));
      }
    },

    properties: {
      get: function () {
        return $('#widget-properties');
      }
    },

    // editor components (i.e component wrap a widget)
    components: {
      get: function () {
        return element.all(by.tagName('component'));
      }
    },

    // get all containers
    containers: {
      get: function () {
        return element.all(by.tagName('container'));
      }
    },
    // get all containers
    tabsContainers: {
      get: function () {
        return element.all(by.tagName('tabs-container'));
      }
    },
    // get all formContainers
    formContainers: {
      get: function () {
        return element.all(by.tagName('form-container'));
      }
    },
    // get all containers
    containersInEditor: {
      get: function () {
        return element.all(by.css('container:not(#editor)'));
      }
    },

    // get the menu bar
    menu: {
      get: function () {
        return element(by.tagName('nav'));
      }
    }
  });
})();
