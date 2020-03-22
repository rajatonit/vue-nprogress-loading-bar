# vue-NProgress-plugin
Simple to use Vue Plugin for NProgress


## How to use

```js
const options = {
  latencyThreshold: 200, // Number of ms before progressbar starts showing
  router: true, // Show progressbar when navigating routes
  http: false // Show progressbar when doing Axios.http or Vue.http
};
Vue.use(NProgress, options)
```

In order to overwrite the configuration for certain requests, use showProgressBar parameter in request/route's meta.

Like this:

```js
Vue.Axios.get('/url', { showProgressBar: false })
Vue.http.get('/url', { showProgressBar: false })
```
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      meta: {
        showProgressBar: false
      }
    }
  ]
})
```