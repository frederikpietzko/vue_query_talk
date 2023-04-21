<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getById, MagicalBeastDto } from '@/api'
import { AxiosError } from 'axios'
import ErrorCard from '@/components/ErrorCard.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ beastId: number }>()
const beast = ref<MagicalBeastDto>()
const error = ref<string>()
const loading = ref<boolean>(false)

onMounted(() => {
  loading.value = true
  getById(props.beastId)
    .then((b) => (beast.value = b))
    .catch((e) => (error.value = (e as AxiosError).response?.data as string))
    .finally(() => (loading.value = false))
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
    <v-row class="justify-center" v-if="loading">
      <v-progress-circular indeterminate />
    </v-row>
    <ErrorCard :error="error" v-if="error" />
    <v-row v-if="!loading && !error">
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
