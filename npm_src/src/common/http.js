import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.interceptors.push((request, next) => {
  if (request.method === 'POST') {
    request.body[window.SITE_CONFIG.csrfName] = window.SITE_CONFIG.csrfToken
  }
  next()
})

Vue.http.options.emulateJSON = true

export async function http (url, opts = {}) {
  const defaultOpts = {
    params: {},
    headers: {},
    body: {},
    method: 'GET'
  }

  opts = {
    ...defaultOpts,
    ...opts
  }

  var res
  let data
  try {
    data = await Vue.http({
      ...opts,
      url
    })
  } catch (err) {
    throw new Error('网络错误')
  }

  if (data.body.code === 200) {
    return data.body
  } else {
    throw new Error(data.body.message)
  }
}

export function get (url, params) {
  return http(url, {
    params,
    method: 'GET'
  })
}

export function post (url, body) {
  return http(url, {
    body,
    method: 'POST'
  })
}
