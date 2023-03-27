<script setup lang="ts">
const props = defineProps<{ error: string | null | undefined }>()
</script>
<template>
  <v-row class="justify-center">
    <v-card>
      <v-card-text>
        {{ props.error }}
      </v-card-text>
    </v-card>
  </v-row>
</template>
