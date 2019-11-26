angular.module('app.maps', [])
.factory('$script', ['$q', '$rootScope', function ($q, $rootScope) {
    "use strict";
    function loadScript(path, callback) {
        var el = document.createElement("script");
        el.onload = el.onreadystatechange = function () {
            if (el.readyState && el.readyState !== "complete" &&
                el.readyState !== "loaded") {
                return;
            }
            el.onload = el.onreadystatechange = null;
            if(angular.isFunction(callback)) {
                callback();
            }
        };
        el.async = true;
        el.src = path;
        document.getElementsByTagName('body')[0].appendChild(el);
    }
    var loadHistory = [],
        pendingPromises = {};
    return function(url) {
        var deferred = $q.defer();
        if(loadHistory.indexOf(url) !== -1) {
            deferred.resolve();
        }
        else if(pendingPromises[url]) {
            return pendingPromises[url];
        } else {
            loadScript(url, function() {
                delete pendingPromises[url];
                loadHistory.push(url);
                $rootScope.$apply(function() {
                    deferred.resolve();
                });
            });
            pendingPromises[url] = deferred.promise;
        }
        return deferred.promise;
    };
}])
.factory('ymapsLoader', ['$window', '$timeout', '$script', 'ymapsConfig', function($window, $timeout, $script, ymapsConfig) {
    "use strict";
    var scriptPromise;
    return {
        ready: function(callback) {
            if(!scriptPromise) {
                scriptPromise = $script(ymapsConfig.apiUrl).then(function() {
                    return $window.ymaps;
                });
            }
            scriptPromise.then(function(ymaps) {
                ymaps.ready(function() {
                    $timeout(function() {callback(ymaps);});
                });
            });
        }
    };
}])
.constant('ymapsConfig', {
    apiUrl: 'https://api-maps.yandex.ru/2.1/?load=package.standard,package.clusters&mode=release&lang=ru-RU&ns=ymaps',
    mapBehaviors: ['default'],
    markerOptions: {
        preset: 'islands#darkgreenIcon'
    },
    clusterOptions: {
      preset: 'islands#darkGreenClusterIcons'
    },
    fitMarkers: true,
    fitMarkersZoomMargin: 40,
    clusterize: false
})
.value('debounce', function (func, wait) {
    "use strict";
    var timeout = null;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
})
.controller('YmapController', ['$scope', '$element', 'ymapsLoader', 'ymapsConfig', 'debounce', function ($scope, $element, ymapsLoader, config, debounce) {
    "use strict";
    function initAutoFit(map, collection, ymaps) {
        collection.events.add('boundschange', debounce(function () {
            if(collection.getLength() > 0) {
                var maxZoomBefore = map.options.get('maxZoom');
                map.options.set('maxZoom', $scope.zoom);
                map.setBounds(collection.getBounds(), {
                    checkZoomRange: true,
                    zoomMargin: config.fitMarkersZoomMargin
                }).then(function () {
                  map.options.set('maxZoom', maxZoomBefore);
                  map.setZoom(map.getZoom());
                });
            }
        }, 100));
    }
    var self = this;
    ymapsLoader.ready(function(ymaps) {
        self.addMarker = function(coordinates, properties, options) {
            var placeMark = new ymaps.Placemark(coordinates, properties, options);
            $scope.markers.add(placeMark);

            return placeMark;
        };

        self.setCenter = function(coordinates, zoom) {
            self.map.setCenter(coordinates, zoom);
        };

        self.removeMarker = function (marker) {
            $scope.markers.remove(marker);
        };
        self.map = new ymaps.Map($element[0], {
            center   : $scope.center || [0, 0],
            zoom     : $scope.zoom || 0,
            behaviors: config.mapBehaviors
        });
        var collection = new ymaps.GeoObjectCollection({}, config.markerOptions);
        if(config.clusterize) {
          $scope.markers = new ymaps.Clusterer(config.clusterOptions);
          collection.add($scope.markers);
        } else {
          $scope.markers = collection;
        }
        self.map.geoObjects.add(collection);
        if(config.fitMarkers) {
            initAutoFit(self.map, collection, ymaps);
        }
        var updatingBounds, moving;
       $scope.$watch('center', function(newVal) {
            if(updatingBounds) {
                return;
            }
            moving = true;
            self.map.panTo(newVal).always(function() {
                moving = false;
            });
        }, true);
        $scope.$watch('zoom', function(zoom) {
            if(updatingBounds) {
               return;
            }
            self.map.setZoom(zoom, {checkZoomRange: true});
        });
        self.map.events.add('boundschange', function(event) {
            if(moving) {
                return;
            }
            updatingBounds = true;
            $scope.$apply(function() {
                $scope.center = event.get('newCenter');
                $scope.zoom = event.get('newZoom');
            });
            updatingBounds = false;
        });

    });
}])
.directive('yandexMap', ['ymapsLoader', function (ymapsLoader) {
    "use strict";
    return {
        restrict: 'EA',
        terminal: true,
        transclude: true,
        scope: {
            center: '=',
            zoom: '='
        },
        link: function($scope, element, attrs, ctrl, transcludeFn) {
            ymapsLoader.ready(function() {
                transcludeFn(function( copy ) {
                    element.append(copy);
                });
            });
        },
        controller: 'YmapController'
    };
}])
.directive('ymapMarker', function () {
    "use strict";
    return {
        restrict: "EA",
        require : '^yandexMap',
        scope   : {
            address: '@',
            index: '=',
            properties: '=',
            options: '='
        },
        link: function ($scope, elm, attr, mapCtrl) {
            var marker;
            function pickMarker() {
                var coordinates;
                var zoom = 17;
                ymaps.geocode($scope.address).then(function(result) {
                    coordinates = [
                        result.geoObjects.get(0).geometry.getCoordinates()[0],
                        result.geoObjects.get(0).geometry.getCoordinates()[1]
                    ];
                    mapCtrl.setCenter(coordinates, zoom);
                    if (marker) {
                        mapCtrl.removeMarker(marker);
                    }
                    marker = mapCtrl.addMarker(coordinates, angular.extend({iconContent: $scope.index}, $scope.properties), $scope.options);
                });
            }

            $scope.$watch("index", function (newVal) {
                if (marker) {
                    marker.properties.set('iconContent', newVal);
                }
            });
            $scope.$watch("address", function (newVal) {
                if (newVal) {
                    pickMarker();
                }
            }, true);
            $scope.$on('$destroy', function () {
                if (marker) {
                    mapCtrl.removeMarker(marker);
                }
            });
        }
    };
});