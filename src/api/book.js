import axios from 'axios'
import { setLocalForage } from '@/utils/localForage'
import { getCategoryName } from '@/utils/book'
// home2
export function home2() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/home2`
  })
}
// 书籍详情
export function detail(book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function flatList() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
  })
}

export function list() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function home() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function shelf() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

export function downloadMp3(url, cb, cb2) {
  axios.create({
    baseURL: url,
    method: 'get',
    responseType: 'blob',
    timeout: 30 * 1000,
    onDownloadProgress: progressEvent => {
      console.log(progressEvent)
    }
  }).get().then(response => {
    const blob = new Blob([response.data])
    if (cb) cb(blob)
  }).catch(err => {
    if (cb2) cb2(err)
  })
}

export function download(item, onSuccess, onFailed, onError, onProgress) {
  axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    responseType: 'blob',
    timeout: 180 * 1000,
    onDownloadProgress: progressEvent => {
      if (onProgress) onProgress(progressEvent)
    }
  }).get(`${getCategoryName(item.category)}/${item.fileName}.epub`)
    .then(res => {
      const blob = new Blob([res.data])
      setLocalForage(item.fileName, blob, () => {
        if (onSuccess) onSuccess(item)
      }, err => {
        if (onFailed) onFailed(err)
      })
    })
    .catch(err => {
      if (onError) onError(err)
    })
}

export function downloadWithoutCache(item, cb, cb2, cb3) {
  axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    responseType: 'blob',
    timeout: 30 * 1000,
    onDownloadProgress: progressEvent => {
      if (cb3) cb3(progressEvent)
    }
  }).get(`${getCategoryName(item.category)}/${item.fileName}.epub`)
    .then(res => {
      const blob = new Blob([res.data])
      if (cb) cb(blob)
    })
    .catch(err => {
      if (cb2) cb2(err)
    })
}
