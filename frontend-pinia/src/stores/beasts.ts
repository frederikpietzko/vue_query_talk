import { defineStore } from 'pinia'
import type { MagicalBeastDto } from '@/api'
import { createBeast, deleteBeast, getAll } from '@/api'
import type { AxiosError } from 'axios'
import _ from 'lodash'

type Error = {
  message: string
}

export const useBeastsStore = defineStore('beasts', {
  state: () => ({
    beasts: [] as MagicalBeastDto[],
    error: null as Error | null,
    loading: false
  }),
  actions: {
    async getAllBeasts() {
      this.loading = true
      try {
        this.beasts = await getAll()
      } catch (e) {
        this.error = (e as AxiosError).response?.data as Error
      } finally {
        this.loading = false
      }
    },
    async deleteBeast(id: number) {
      const prev = this.beasts
      this.beasts = this.beasts.filter((beast) => beast.id !== id)
      try {
        await deleteBeast(id)
      } catch (e) {
        this.error = (e as AxiosError).response?.data as Error
        this.beasts = prev
      }
    },
    async createBeast(name: string, description: string, longDescription: string, image: string) {
      const prev = this.beasts
      const optimisticBeast: MagicalBeastDto = {
        id: (_.max(prev.map((b) => b.id)) ?? 0) + 1,
        name,
        description,
        longDescription,
        image
      }
      this.beasts.push(optimisticBeast)
      try {
        const beast = await createBeast({ name, description, image, longDescription })
        prev.push(beast)
        this.beasts = prev
      } catch (e) {
        this.error = (e as AxiosError).response?.data as Error
        this.beasts = prev
      }
    }
  }
})
