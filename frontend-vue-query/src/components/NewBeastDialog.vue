<script setup lang="ts">
import { computed, ref } from 'vue'
import { createBeast, type CreateBeastRequestDto, createBeastRequestSchema } from '@/api'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import ErrorCard from '@/components/ErrorCard.vue'

const open = ref(false)
const formModel = ref<CreateBeastRequestDto>({
  name: '',
  description: '',
  image: '',
  longDescription: ''
})

const queryClient = useQueryClient()
const {
  mutate: addBeast,
  isError,
  error
} = useMutation(createBeast, {
  onSuccess() {
    queryClient.invalidateQueries(['beastlist'])
  }
})

const handleSubmit = () => {
  const result = createBeastRequestSchema.safeParse(formModel.value)
  if (result.success) {
    addBeast(result.data)
  }
}

const valid = computed(() => createBeastRequestSchema.safeParse(formModel.value).success)
</script>
<template>
  <v-btn color="primary" variant="elevated" height="4em" @click="open = true">
    Add new Beast
  </v-btn>
  <v-dialog width="60%" v-model="open">
    <v-form
      @submit.prevent="
        handleSubmit()
        open = false
      "
    >
      <v-card>
        <v-card-title class="text-center text-lg-h4 text-purple-lighten-4">
          Add New Beast
        </v-card-title>
        <v-card-text>
          <ErrorCard :error="error" v-if="isError" />
          <v-text-field
            variant="solo"
            v-model="formModel.name"
            single-line
            label="Name"
            name="name"
          />
          <v-textarea
            variant="solo"
            v-model="formModel.description"
            label="Description"
            name="description"
          />
          <v-textarea
            variant="solo"
            v-model="formModel.longDescription"
            label="Long Description"
            name="longDescription"
          />
          <v-text-field
            variant="solo"
            v-model="formModel.image"
            single-line
            label="Image"
            name="image"
          />
          <v-img :src="formModel.image" width="300" v-if="formModel.image" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="secondary" @click="open = false"> Cancel</v-btn>
          <v-btn color="primary" type="submit" :disabled="!valid"> Add new Beast</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
