<script setup lang="ts">
import { getById } from '@/api'
import ErrorCard from '@/components/ErrorCard.vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'

const props = defineProps<{ beastId: number }>()
const {
  isLoading,
  isError,
  status,
  data: beast,
  error
} = useQuery({
  queryKey: ['beast', props.beastId],
  queryFn: () => getById(props.beastId)
})
const router = useRouter()
</script>
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn color="primary" @click="router.back()">Back</v-btn>
      </v-col>
    </v-row>
    <v-row class="justify-center" v-if="isLoading">
      <v-progress-circular indeterminate />
    </v-row>
    <ErrorCard :error="error" v-if="isError" />
    <v-row v-if="status === 'success'">
      <v-col>
        <v-card>
          <v-card-title>
            {{ beast?.name }}
          </v-card-title>
          <v-card-text>
            {{ beast?.description }}
          </v-card-text>
          <v-card-text>
            {{ beast?.longDescription }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-img :src="beast?.image ?? ''" width="500" />
      </v-col>
    </v-row>
  </v-container>
</template>
