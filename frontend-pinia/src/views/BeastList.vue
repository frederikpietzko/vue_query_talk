<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useBeastsStore } from '@/stores/beasts'
import BeastCard from '@/components/BeastCard.vue'
import _ from 'lodash'
import NewBeastDialog from '@/components/NewBeastDialog.vue'
import ErrorCard from '@/components/ErrorCard.vue'

const store = useBeastsStore()
const search = ref('')
onMounted(() => store.getAllBeasts())

const intervalId = ref<number>()
onMounted(() => {
  intervalId.value = setInterval(() => store.getAllBeasts(), 5000)
  window.addEventListener('focus', store.getAllBeasts)
})

onUnmounted(() => {
  clearInterval(intervalId.value!)
  window.removeEventListener('focus', store.getAllBeasts)
})

const beasts = computed(() =>
  _.chunk(
    store.beasts.filter((beast) => beast.name.toLowerCase().includes(search.value.toLowerCase())),
    3
  )
)
</script>
<template>
  <v-container>
    <v-row class="mx-0">
      <v-text-field
        label="Search..."
        single-line
        autofocus
        class="mr-5"
        variant="solo"
        v-model="search"
        append-inner-icon="mdi-magnify"
      />
      <NewBeastDialog />
    </v-row>
    <ErrorCard :error="store.error?.message" v-if="store.error?.message" />
    <v-row class="justify-center" v-if="store.loading && store.beasts.length === 0 && !store.error">
      <v-progress-circular indeterminate />
    </v-row>
    <template v-if="!store.error">
      <v-row v-for="arr in beasts">
        <v-col class="v-col-4" v-for="beast in arr">
          <BeastCard :beast="beast" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
