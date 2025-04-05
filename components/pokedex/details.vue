<template>
    <div v-if="isVisible" class="fixed inset-0 backdrop-brightness-50 flex justify-center items-center">
      <div class="bg-white rounded-lg max-w-3xl w-full relative flex">
        <!-- Close Button -->
        <button
          @click="closeDialog"
          class="absolute top-[-20px] right-[-20px] text-xl bt-primary bt-primary-hover rounded-full w-15 h-15 flex items-center justify-center"
        >
        <CloseIcon class="w-10 h-10" />
        </button>
  
        <!-- Left Section: Pokemon Image -->
        <div class="flex flex-col items-center w-1/2 relative p-6">
          <!-- Heart Button -->
          <button @click="toggleFavorite(pokemon?.id)" class="absolute top-4 right-4 w-10 h-10 z-10">
            <HeartIcon :class="isFavorited(pokemon?.id) ? 'heart-fill' : 'heart-none'" />
          </button>
          
          <img :src="pokemon?.image" :alt="pokemon?.name" class="p-6 w-80 h-70 mb-8" />
          <p class="text text-size-title-xl font-semibold capitalize">{{ pokemon?.name }}</p>
          <p class="text-secondary text-size-title-xl font-semibold">{{ pokemon?.id < 1000 ? pokemon?.id.padStart(4,'0') : pokemon?.id }}</p>
        </div>
  
        <!-- Right Section: Stats -->
        <div class="rounded-lg w-2/3 bg-stats p-4">
          <h3 class="text-size-title-xl font-semibold">Stats</h3>

          <div v-if="isLoading" class="space-y-2">
          <div class="h-6 bg-gray-300 animate-pulse w-2/3 rounded"></div>
          <div class="h-6 bg-gray-300 animate-pulse w-1/2 rounded"></div>
          <div class="h-6 bg-gray-300 animate-pulse w-3/4 rounded"></div>
          </div>

          <table v-else class="w-full">
            <tbody>
              <tr class="bg-white">
                <td class="py-1 text-size-table font-semibold px-2 border-6 border-slate-100 text-left">Height</td>
                <td class="py-1 text-size-table font-semibold px-2 border-6 border-slate-100 text-right">{{ pokemonStat?.height }}</td>
              </tr>
              <tr class="bg-slate-50">
                <td class="py-1 text-size-table font-semibold px-2 border-6 border-slate-100 text-left">Weight</td>
                <td class="py-1 text-size-table font-semibold px-2 border-6 border-slate-100 text-right">{{ pokemonStat?.weight }}</td>
              </tr>
              <tr v-for="stat in pokemonStat?.stats" :key="stat.name" class="bg-white even:bg-slate-50">
                <td class="py-1 text-size-table font-semibold px-2 border-6 border-slate-100 text-left capitalize">{{ stat.name === 'hp' ? 'HP' : stat.name }}</td>
                <td class="py-1 text-size-table font-semibold px-2 border-6 border-slate-100 text-right">{{ stat.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import HeartIcon from '@/assets/icons/heart-solid.svg';
import CloseIcon from '@/assets/icons/xmark-solid.svg';
import { usePokedexStore } from '@/stores/pokedexStore';
  
const props = defineProps({
  isVisible: Boolean,
  pokemon: Object,
  favorites: Set
});

const store = usePokedexStore();
const isLoading = ref(true);

watch(
  () => props.pokemon?.id,
  async (newId) => {
    if (newId) {
        isLoading.value = true;
      await store.fetchPokemonById(newId);
        isLoading.value = false;
    }
  },
  { immediate: true }
);

const pokemonStat = computed(() => store.pokemonDetails);
  
const emit = defineEmits(['update:visible', 'toggle-favorite']);
  
const closeDialog = () => {
  emit('update:visible', false);
};
  
const isFavorited = (id: number) => {
  return props.favorites?.has(id);
};
  
const toggleFavorite = (id: number) => {
  emit('toggle-favorite', id);
};
</script>
  