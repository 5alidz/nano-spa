const listeners = new Map()

export const send = (event, payload) => {
  if(listeners.has(event)){
    listeners.get(event)(payload)
  }
}

export const on = (event, callback) => {
  listeners.set(event, callback)
}
