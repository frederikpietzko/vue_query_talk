<script setup lang="ts">
import type { MagicalBeastDto } from '@/api'
import * as api from '@/api'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import ErrorCard from '@/components/ErrorCard.vue'

const props = defineProps<{
  beast: MagicalBeastDto
}>()

const queryClient = useQueryClient()
const {
  mutate: deleteBeast,
  error,
  isError
} = useMutation(() => api.deleteBeast(props.beast.id), {
  onMutate() {
    const beasts = queryClient.getQueryData(['beastlist']) as MagicalBeastDto[]
    queryClient.setQueryData(
      ['beastlist'],
      beasts.filter((b) => b.id !== props.beast.id)
    )
    return beasts
  },
  onError(_err, _vars, ctx) {
    queryClient.setQueryData(['beastlist'], ctx)
  },
  onSuccess() {
    queryClient.invalidateQueries(['beastlist'])
    queryClient.invalidateQueries(['beast', props.beast.id])
  }
})
const handleDelete = () => {
  const sure = confirm(
    'Are you sure you want to delete the ' + props.beast.name + ' from this list?'
  )
  if (sure) {
    deleteBeast()
  }
}
</script>
<template>
  <v-card class="spaced" height="100%">
    <v-img :src="props.beast.image" cover />
    <v-card-title class="text-xl-h4">
      {{ props.beast.name }}
    </v-card-title>
    <v-card-text>
      {{ props.beast.description }}
      <ErrorCard :error="error" v-if="isError" />
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn color="secondary" @click="handleDelete()"> Delete</v-btn>
      <v-btn color="primary">
        <router-link :to="`/beast/${beast.id}`" class="ui-button">View</router-link>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style scoped>
.spaced {
  margin: 1em 0 1em 0;
}
</style>
