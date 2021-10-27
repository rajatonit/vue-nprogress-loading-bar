# vue-NProgress-plugin


Simple to use Vue Plugin for NProgress. This is a fork of vue bluma framework with a more modern approach.

This Plugin also works in conjunction with Vue.Axios and Vue.http on page load, and will wait until those calls are
completed and the page is loaded before ending the loading bar sequence.

For Axios to work. You will need to install the Vue.Axios plugin. And inject it as a Vue Plugin before importing this library.

## How to use

```js
import  router from './router'
...
...
...

import NProgress  from 'vue-nprogress-loading-bar'

const options = {
  latencyThreshold: 200, // Number of ms before progressbar starts showing
  router: true, // Show progressbar when navigating routes
  http: true // Show progressbar when doing Axios.http or Vue.http
};
Vue.use(NProgress, options,router)
```

In order to overwrite the configuration for certain requests, use showProgressBar parameter in request/route's meta.

Like this:

```js
Vue.Axios.get("/url", { showProgressBar: false });
Vue.http.get("/url", { showProgressBar: false });
```

```js
const router = new VueRouter({
  routes: [
    {
      path: "/foo",
      component: Foo,
      meta: {
        showProgressBar: false,
      },
    },
  ],
});
```
