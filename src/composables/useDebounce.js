import { ref } from 'vue'

export function useDebounce(fn, delay = 300) {
    let timer = null

    return (...args) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}