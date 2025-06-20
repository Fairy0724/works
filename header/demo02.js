function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
console.log('vue')
sleep(1000)
console.log('react')


