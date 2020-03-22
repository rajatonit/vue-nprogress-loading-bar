'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var NProgress = _interopDefault(require('nprogress'));
require('nprogress/nprogress.css');

NProgress.configure({
  easing: 'ease',
  speed: 500
});
var index = {
  install: function install(Vue, options, router) {
    var requestsTotal = 0;
    var requestsCompleted = 0;
    var latencyThreshold = options.latencyThreshold,
        applyOnRouter = options.router,
        applyOnHttp = options.http;

    var setComplete = function setComplete() {
      requestsTotal = 0;
      requestsCompleted = 0;
      NProgress.done();
    };

    var initProgress = function initProgress() {
      if (0 === requestsTotal) {
        setTimeout(function () {
          return NProgress.start();
        }, latencyThreshold);
      }

      requestsTotal++;
      NProgress.set(requestsCompleted / requestsTotal);
    };

    var increase = function increase() {
      setTimeout(function () {
        ++requestsCompleted;

        if (requestsCompleted >= requestsTotal) {
          setComplete();
        } else {
          NProgress.set(requestsCompleted / requestsTotal - 0.1);
        }
      }, latencyThreshold + 50);
    };

    Vue.mixin({
      beforeCreate: function beforeCreate() {
        // eslint-disable-next-line no-console
        var confirmed = true;

        if (applyOnHttp) {
          var http = Vue.http;
          var axios = Vue.axios;

          if (http) {
            http.interceptors.push(function (request, next) {
              var showProgressBar = 'showProgressBar' in request ? request.showProgressBar : applyOnHttp;
              if (showProgressBar) initProgress();
              next(function (response) {
                if (!showProgressBar) return response;
                increase();
              });
            });
          } else if (axios) {
            axios.interceptors.request.use(function (request) {
              if (!('showProgressBar' in request)) request.showProgressBar = applyOnHttp;
              if (request.showProgressBar) initProgress();
              return request;
            }, function (error) {
              return Promise.reject(error);
            });
            axios.interceptors.response.use(function (response) {
              if (response.config.showProgressBar) increase();
              return response;
            }, function (error) {
              if (error.config && error.config.showProgressBar) increase();
              return Promise.reject(error);
            });
          }
        }

        if (applyOnRouter) {
          router.beforeEach(function (route, from, next) {
            var showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter;

            if (showProgressBar && confirmed) {
              initProgress();
              confirmed = false;
            }

            next();
          });
          router.afterEach(function (route) {
            var showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter;

            if (showProgressBar) {
              increase();
              confirmed = true;
            }
          });
        }
      }
    });
  }
};

module.exports = index;
