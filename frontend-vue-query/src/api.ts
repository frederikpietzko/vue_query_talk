import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import _ from 'lodash'

export type Error = AxiosError<{
  message: string
}>

export const isError = (error: unknown): error is Error => {
  return _.has(error, 'response.data.message')
}

export type MagicalBeastDto = {
  id: number
  name: string
  description: string
  longDescription: string
  image: string
}

export const createBeastRequestSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(15),
  longDescription: z.string().min(45),
  image: z.string().url()
})

export type CreateBeastRequestDto = z.infer<typeof createBeastRequestSchema>
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
    .then(() => axios.post<MagicalBeastDto>('/beasts', req))
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
