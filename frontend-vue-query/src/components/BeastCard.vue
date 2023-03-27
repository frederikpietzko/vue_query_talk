<script setup lang="ts">
import type { MagicalBeastDto } from '@/api'
import { useBeastsStore } from '@/stores/beasts'

const props = defineProps<{
  beast: MagicalBeastDto
}>()

const store = useBeastsStore()
const handleDelete = () => {
  const sure = confirm(
    'Are you sure you want to delete the ' + props.beast.name + ' from this list?'
  )
  if (sure) {
    store.deleteBeast(props.beast.id)
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
