import NProgress from 'nprogress'
import 'nprogress/nprogress.css';
NProgress.configure({ easing: 'ease', speed: 500 });

export  default {
    install (Vue, options, router){
        let requestsTotal = 0;
        let requestsCompleted = 0;
        const {latencyThreshold, router: applyOnRouter, http: applyOnHttp} = options;

        const setComplete = ()=>{
            requestsTotal = 0
            requestsCompleted = 0
            NProgress.done()
        }

        const initProgress = ()=>{
            if (0 === requestsTotal) {
                setTimeout(() => NProgress.start(), latencyThreshold)
            }
            requestsTotal++
            NProgress.set(requestsCompleted / requestsTotal)
        }

        const increase = ()=>{
            setTimeout(() => {
                ++requestsCompleted
                if (requestsCompleted >= requestsTotal) {
                    setComplete()
                } else {
                    NProgress.set((requestsCompleted / requestsTotal) - 0.1)
                }
            }, latencyThreshold + 50)
        }


        Vue.mixin({

            beforeCreate: function () {
                // eslint-disable-next-line no-console
                let confirmed = true
                if (applyOnHttp) {
                    const http = Vue.http
                    const axios = Vue.axios

                    if (http) {
                        http.interceptors.push((request, next) => {
                            const showProgressBar = 'showProgressBar' in request ? request.showProgressBar : applyOnHttp
                            if (showProgressBar) initProgress()

                            next(response => {
                                if (!showProgressBar) return response
                                increase()
                            })
                        })
                    } else if (axios) {
                        axios.interceptors.request.use((request) => {
                            if (!('showProgressBar' in request)) request.showProgressBar = applyOnHttp
                            if (request.showProgressBar) initProgress()
                            return request
                        }, (error) => {
                            return Promise.reject(error)
                        })

                        axios.interceptors.response.use((response) => {
                            if (response.config.showProgressBar) increase()
                            return response
                        }, (error) => {
                            if (error.config && error.config.showProgressBar) increase()
                            return Promise.reject(error)
                        })
                    }
                }

                if (applyOnRouter) {
                    router.beforeEach((route, from, next) => {
                        const showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter
                        if (showProgressBar && confirmed) {
                            initProgress()
                            confirmed = false
                        }
                        next()
                    })
                    router.afterEach(route => {
                        const showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter
                        if (showProgressBar) {
                            increase()
                            confirmed = true
                        }
                    })
                }


            }
        })
    }
}