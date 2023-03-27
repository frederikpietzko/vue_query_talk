<script setup lang="ts">
import {useBeastsStore} from "@/stores/beasts";
import {computed, ref} from "vue";

const open = ref(false)
const name = ref("")
const description = ref("")
const longDescription = ref("")
const image = ref("")
const store = useBeastsStore()

const handleSubmit = () => {
  store.createBeast(name.value, description.value, longDescription.value, image.value)
}

const valid = computed(() => name && description && longDescription && image)

</script>
<template>

  <v-btn color="primary" variant="elevated" height="4em" @click="open = true">
    Add new Beast
  </v-btn>
  <v-dialog width="60%" v-model="open">
    <v-form @submit.prevent="handleSubmit(); open = false">
      <v-card>
        <v-card-title class="text-center text-lg-h4 text-purple-lighten-4">
          Add New Beast
        </v-card-title>
        <v-card-text>
          <v-text-field variant="solo" v-model="name" single-line label="Name" name="name"/>
          <v-textarea variant="solo" v-model="description" label="Description" name="description"/>
          <v-textarea variant="solo" v-model="longDescription" label="Long Description" name="longDescription"/>
          <v-text-field variant="solo" v-model="image" single-line label="Image" name="image"/>
          <v-img :src="image" width="300" v-if="image"/>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="secondary" @click="open = false">
            Cancel
          </v-btn>
          <v-btn color="primary" type="submit" :disabled="!valid">
            Add new Beast
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>