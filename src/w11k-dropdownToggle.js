'use strict';

angular.module('w11k.dropdownToggle', []);

angular.module('w11k.dropdownToggle').directive('w11kDropdownToggle', ['$document', function ($document) {

  var currentOpenDropdownCtrl;

  var preventCloseMenu = function (domEvent) {
    domEvent.stopPropagation();
  };

  return {
    restrict: 'A',
    controller: ['$scope', '$element', function ($scope, $element) {

      var ctrl = this;
      ctrl.isOpen = false;
      var removeLocationChangeSuccessListener;

      function executeCallback(callback, domEvent) {
        var result = {
          isPrevented: false
        };

        var event = {
          prevent: function () {
            result.isPrevented = true;
          }
        };

        if (angular.isFunction(callback)) {
          if (angular.isDefined(domEvent)) {
            $scope.$apply(function () {
              callback(event);
            });
          }
          else {
            callback(event);
          }
        }

        return result;
      }

      ctrl.shared = {};

      ctrl.open = function (domEvent) {
        var allDropdownsClosed = true;
        if (currentOpenDropdownCtrl) {
          allDropdownsClosed = currentOpenDropdownCtrl.close();
        }

        if (domEvent) {
          domEvent.preventDefault();
          domEvent.stopPropagation();
        }

        if (ctrl.isOpen === false && allDropdownsClosed) {
          // call callback
          var callbackResult = executeCallback(ctrl.shared.onOpen, domEvent);

          if (callbackResult.isPrevented === false) {
            // open dropdown
            $element.parent().addClass('open');


            // add close handler
            // don't close the dropdown on click inside
            $element.parent().bind('click', preventCloseMenu);
            // close dropdown on click outside
            $document.bind('click', domClose);

            removeLocationChangeSuccessListener = $scope.$on('$locationChangeSuccess', function () {
              ctrl.close();
            });

            ctrl.isOpen = true;
            currentOpenDropdownCtrl = ctrl;
          }
        }

        return ctrl.isOpen;
      };

      ctrl.toggle = function () {
        if (ctrl.isOpen) {
          ctrl.close();
        }
        else {
          ctrl.open();
        }
      };

      var domClose = function () {
        // do not prevent default, click outside on a link should work immediately
        // domEvent.preventDefault();
        // domEvent.stopPropagation();

        $scope.$apply(function () {
          ctrl.close();
        });
      };

      ctrl.close = function (domEvent) {
        if (ctrl.isOpen) {
          // call callback
          var callbackResult = executeCallback(ctrl.shared.onClose, domEvent);

          if (callbackResult.isPrevented === false) {
            // close dropdown
            $element.parent().removeClass('open');

            // remove close handlers
            $element.parent().bind('click', preventCloseMenu);
            $document.unbind('click', ctrl.close);
            removeLocationChangeSuccessListener();
            removeLocationChangeSuccessListener = null;

            ctrl.isOpen = false;
            currentOpenDropdownCtrl = null;
          }
        }

        return !ctrl.isOpen;
      };
    }],
    link: function (scope, element, attrs, ctrl) {

      var domToggle = function (domEvent) {
        domEvent.preventDefault();
        domEvent.stopPropagation();

        scope.$apply(function () {
          ctrl.toggle();
        });
      };

      element.bind('click', domToggle);

      function shareCtrlFunctions(shared) {
        shared.open = ctrl.open;
        shared.close = ctrl.close;
        shared.toggle = ctrl.toggle;
        shared.isOpen = function () { return ctrl.isOpen; };
      }

      var removeAttrObserver = attrs.$observe('w11kDropdownToggle', function (attrValue) {
        if (angular.isDefined(attrValue) && attrValue !== '') {
          var shared = scope.$eval(attrValue);

          if (angular.isObject(shared)) {
            ctrl.shared = shared;
            shareCtrlFunctions(shared);

            removeAttrObserver();
            removeAttrObserver = null;
          }
        }
      });
    }
  };
}]);
