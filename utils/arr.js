export const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )

export const zip = (arrA, arrB) => arrA.reduce((acc, it) => acc.concat(arrB.map(ot => [it, ot])), [])
