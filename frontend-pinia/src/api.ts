import axios from 'axios'

export type MagicalBeastDto = {
  id: number
  name: string
  description: string
  longDescription: string
  image: string
}

export type CreateBeastRequestDto = {
  name: string
  description: string
  longDescription: string
  image: string
}
axios.defaults.baseURL = 'http://localhost:8080/api'
const latency = 3000
export const getAll = (): Promise<MagicalBeastDto[]> =>
  sleep(latency)
    .then(() => axios.get<MagicalBeastDto[]>('/beasts'))
    .then((res) => res.data)
export const getById = (id: number): Promise<MagicalBeastDto> =>
  sleep(latency)
    .then(() => axios.get<MagicalBeastDto>('/beasts/' + id))
    .then((res) => res.data)
export const createBeast = (req: CreateBeastRequestDto): Promise<MagicalBeastDto> =>
  sleep(latency)
    .then(() => axios.post<MagicalBeastDto>('/beasts'))
    .then((res) => res.data)
export const deleteBeast = (id: number): Promise<void> =>
  sleep(latency)
    .then(() => axios.delete<void>('/beasts/' + id))
    .then((res) => res.data)

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, ms)
  })
