angular.module('pb.common.services').factory('arrays', function() {

  'use strict';

  /**
   * Moves an item in an array to the left
   * > If the array is empty we add the element
   * @param  {Object} element
   * @param  {Array} array
   * @param {Boolean} right move to the right
   * @return {void}
   */
  function moveTo(element, array, right) {
    var index = array.indexOf(element);
    var newIndex = (0 !== index) ? index - 1 : 0;

    if(right) {
      newIndex = (-1 !== index) ? index + 1 : 1;
    }

    // We already have the item and it's the only one, do nothing
    if(!index && 1 === array.length) {
      return;
    }

    // Remove an item only if the length is > 1
    if(array.length > 1) {
      array.splice(index, 1);
    }

    array.splice(newIndex, 0, element);
  }

  /**
   * Moves an item to the left in and array.
   * It will also add it if the array is empty
   * @param  {Object} element Item to move
   * @param  {Array} array
   * @return {void}
   */
  function moveLeft(element, array) {
    moveTo(element, array, false);
  }

  /**
   * Moves an item in an array to the right
   * @param  {Object} element
   * @param  {Array} array
   * @return {void}
   */
  function moveRight(element, array) {
    moveTo(element, array, true);
  }

  /**
   * Moves an item in an Array to a custom position
   * @param  {Object} element
   * @param  {Number} position
   * @param  {Array} array
   * @return {void}
   */
  function moveAtPosition(element, position, array) {
    var index = array.indexOf(element);

    array.splice(index, 1);
    array.splice(position, 0, element);
  }

  function moveLeftPossible(element, array) {
    return array.indexOf(element) > 0;
  }

  function moveRightPossible(element, array) {
    return array.indexOf(element) < array.length - 1;
  }

  /**
   * Delete all the occurrences of one element in an array. If the array contains objects you have to pass as argument
   * a function which compare 2 elements.
   * @see arrays.spec.js
   * @param {Object} element to delete
   * @param {Array} array
   * @param {Function} equalityTester to test equality between 2 elements. Not necessary for primitives
   * @returns {Array}
   */
  function remove(element, array, equalityTester) {

    var length = array.length;
    if(length > 0) {
      for (var i = length - 1; i >= 0; i--) {
        if (equalityTester) {
          if (equalityTester(array[i], element)) {
            array.splice(i, 1);
          }
        }
        else if (array[i] === element) {
          array.splice(i, 1);
        }
      }
    }
    return array;
  }

  /**
   * Inserts the element in the current row at the position provided, or at the end if incorrect.
   * @param element - the element to insert
   * @param position - the index where to insert, will default to the end if incorrect
   * @param array
   */
  function insertAtPosition(element, position, array) {
    if (position >= 0) {
      array.splice(position, 0, element);
    } else {
      array.push(element);
    }
  }

  return {
    moveLeft: moveLeft,
    moveRight: moveRight,
    moveAtPosition: moveAtPosition,
    moveLeftPossible: moveLeftPossible,
    moveRightPossible: moveRightPossible,
    remove: remove,
    insertAtPosition: insertAtPosition
  };
});
