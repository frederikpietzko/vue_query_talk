<script setup lang="ts">
import { isError } from '@/api'
import { computed } from 'vue'
import _ from 'lodash'

const props = defineProps<{ error: unknown }>()
const error = computed(() => {
  if (_.isNil(props.error) || typeof props.error === 'string') {
    return props.error
  } else if (isError(props.error)) {
    return props.error.response?.data.message
  } else return null
})
</script>
<template>
  <v-alert closable type="error" :text="error ?? ''" title="Something went wrong..." />
</template>
