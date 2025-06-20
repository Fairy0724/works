function useCounter() {
  const counter = ref(0)
  const add = () => {
    counter.value++
  }
  const sub = () => {
    counter.value--
  }
  return {
    counter,
    add,
    sub
  }
}