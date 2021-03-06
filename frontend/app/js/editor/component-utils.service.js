angular.module('pb.services')
  .service('componentUtils', function (resolutions) {

    'use strict';

    /**
     * Return the rows of a tab element
     * @param  {Object} element a tab object
     * @return {array}          the rows inside the tab
     */
    function getTabRows(tab) {
      return tab.container && tab.container.rows || [];
    }

    /**
     * Concat item with a given array
     * use for flatten an array using reduce
     * @param  {Array} result array to  concat with
     * @param  {Object} item  item to concat
     * @return {Array}        array with result and item merged
     */
    function flattenReducer(result, item){
      return result.concat(item);
    }


    /**
     * Check if a component is a container
     * @param  {Object}  component
     * @return {Boolean}           true if component is a container
     */
    function isContainer(component) {
      return (/container/i).test(component.type);

    }

    /**
     * return an flat array of the visible components in a container
     * @param  {Object} container
     * @return {Array}            a flat array of child components
     */
    function getVisibleComponents(container) {
      // get the rows of the container
      var rows = container.rows ||  ( container.$$openedTab && container.$$openedTab.container.rows);

      return rows
        .reduce(flattenReducer, [])
        .reduce(function(components, item) {
          components = components.concat(item);
          if (isContainer(item)) {
            return components.concat( getVisibleComponents(item) );
          }
          return components;
        }, []);
    }
    /**
     * Check if an id belongs to a container
     * @param  {String}  id  the widget identifier to check
     * @param  {Object}  container the tabContainer|container|widget to check
     * @return {Boolean}
     */
    function isChildOf(id, container) {
      if (container.$$id === id) {
        return true;
      }
      // We normalize container and tabs container into an array of rows
      // For tabs, we merge rows of each tabs container
      var rows = container.rows || (container.tabs || [])
        .map(getTabRows)
        .reduce(flattenReducer, []);

      if (rows.length === 0) {
        return false;
      }
      // we reduce rows into an array of widget and iterate over it
      // using some to stop when we found the widget
      return rows
        .reduce(flattenReducer, [])
        .some(function(widget) {
          return isChildOf(id, widget);
        });
    }

    /**
     * Check if we can move this container into another one
     * @param  {Object}  data Component to move
     * @param  {Object}  item Current component
     * @return {Boolean}
     */
    function isMovable(data, item) {
      var isTheChild = service.isChildOf(item.$$id, data);

      if(!isTheChild || 'component' === data.type) {
        return !(item.$$id === data.$$id || item === data);
      }

      return false;
    }

    /**
     * Returns the CSS column width that must be used by a component in the editor to reflect its width and the currently
     * selected resolution.
     */
    function columnWidth(component) {
      var property,
          resolutionsArr = resolutions.all(),
          index = resolutionsArr.indexOf(resolutions.selected());

      for (var i = index; i >= 0; i--) {
        property = resolutionsArr[i].key;
        if (component.dimension[property]) {
          return component.dimension[property];
        }
      }

      return 12;
    }

    function columnClass(component) {
      return 'col-xs-' + columnWidth(component);
    }


    /**
     * distribute the column size for each component in a row
     * only if row is full
     * @param  {Object} row a container row containing components
     */
    function distributeComponentSize(row) {
      var index = resolutions.all().indexOf(resolutions.getDefaultResolution());
      var dimensions = resolutions.all().slice(index).map(function(item){
        return item.key;
      });
      var colSize =  Math.floor(12 / row.length);
      var lastColSize = 12 % row.length;

      dimensions.forEach(function(dimension) {
        var rowSize = row.slice(0, -1).reduce(function(colsize, component) {
          return colsize + component.dimension[dimension];
        }, 0);
        var lastComponent = row[row.length - 1];
        if (rowSize < 12) {
          // last component will fill remaining space
          lastComponent.dimension[dimension] = 12 - rowSize;
          return;
        }
        else {
          //we iterate over the component to resize  them
          row.forEach(function(component) {
            component.dimension[dimension] = colSize;
          });

          // We stop if all column size are equal and there rest is 0
          if (lastColSize === 0) {
            return;
          }

          // we distribute the rest of number-of-components / 12 to
          // columns starting from the end
          row.slice( -lastColSize ).forEach(function(component) {
            component.dimension[dimension] +=  1;
          });

        }
      });
    }


    function getWidth(component) {
      if(!component) {
        return 1;
      }

      return component.dimension[resolutions.selected().key];
    }

    function setWidth(component, width) {
      component.dimension[resolutions.selected().key] = width;
    }


    var service = {
      isChildOf: isChildOf,
      isMovable: isMovable,
      getVisibleComponents: getVisibleComponents,
      isContainer: isContainer,
      column: {
        width: columnWidth,
        className: columnClass,
        computeSizeItemInRow: distributeComponentSize
      },
      width: {
        get: getWidth,
        set: setWidth
      }
    };

    return service;
  });
