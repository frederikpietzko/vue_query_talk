<script setup lang="ts">
import { computed, ref } from 'vue'
import BeastCard from '@/components/BeastCard.vue'
import _ from 'lodash'
import NewBeastDialog from '@/components/NewBeastDialog.vue'
import ErrorCard from '@/components/ErrorCard.vue'
import { getAll } from '@/api'
import { useQuery } from '@tanstack/vue-query'

const { isLoading, isError, error, data, status } = useQuery({
  queryKey: ['beastlist'],
  queryFn: getAll,
  refetchInterval: 5000,
  initialData: [],
  refetchOnWindowFocus: 'always'
})

const search = ref('')

const beasts = computed(() =>
  _.chunk(
    data.value.filter((beast) => beast.name.toLowerCase().includes(search.value.toLowerCase())),
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
    <ErrorCard :error="error" v-if="isError" />
    <v-row class="justify-center" v-if="isLoading">
      <v-progress-circular indeterminate />
    </v-row>
    <v-row v-for="arr in beasts" v-if="status === 'success'">
      <v-col class="v-col-4" v-for="beast in arr">
        <BeastCard :beast="beast" />
      </v-col>
    </v-row>
  </v-container>
</template>
