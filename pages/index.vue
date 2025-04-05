<template>
    <div class="min-h-screen bg p-8">
        <h1 class="text-size-title-xl font-bold text">Pokédex</h1>
        <p class="font-semibold text mb-4">Search for a Pokémon by name or id number</p>

        <!-- Search Input -->
        <div class="flex justify-start mb-6 w-full max-w-md">
            <div class="relative w-full">
                <input v-model="searchQuery" type="text" placeholder="Name or id number"
                    class="bg-card shadow-lg pr-10 pl-4 py-2 w-full rounded" />
                <SearchIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
        </div>

        <!-- Pokedex Card List -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="pokemon in filteredPokemons" :key="pokemon.id"
                class="bg-card shadow-lg rounded-xl p-4 flex flex-col items-center relative"
                @click="openDialog(pokemon)">

                <button @click.stop="toggleFavorite(pokemon.id)" class="absolute top-3 right-3 w-6 h-6">
                    <HeartIcon :class="isFavorited(pokemon.id) ? 'heart-fill' : 'heart-none'" />
                </button>

                <img :src="pokemon.image" :alt="pokemon.name" class="w-25 h-25" />
                <h3 class="text font-semibold text-lg capitalize">{{ pokemon.name }}</h3>
                <p class="text-secondary text-lg font-semibold">{{ pokemon.id < 1000 ? pokemon.id.padStart(4, '0') : pokemon.id }}</p>
            </div>

            <div class="grid place-items-center w-full">
                <button @click="loadMore"
                    class="bt-primary bt-primary-hover text text-lg py-2 rounded-lg font-semibold w-full">
                    Load More
                </button>
            </div>
        </div>

        <PokedexDetails :isVisible="isDialogVisible" :pokemon="selectedPokemon" :favorites="favorites"
            @update:visible="isDialogVisible = $event" @toggle-favorite="toggleFavorite" />
    </div>
</template>

<script setup>
import { usePokedexStore } from '@/stores/pokedexStore';
import HeartIcon from '@/assets/icons/heart-solid.svg';
import SearchIcon from '@/assets/icons/magnifying-glass-solid.svg';

const store = usePokedexStore();

const searchQuery = ref('');
const limit = ref(10);
const offset = ref(0);
const favorites = ref(new Set());
const isDialogVisible = ref(false);
const selectedPokemon = ref(null);

onMounted(() => {
    store.fetchPokemons(limit.value, offset.value);

    // Initialize favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites.value = new Set(JSON.parse(savedFavorites));
    }
});

const filteredPokemons = computed(() => {
    return store.pokemons.filter(pokemon => {
        const query = searchQuery.value.toLowerCase().trim();
        const pokemonId = pokemon.id < 1000 ? pokemon.id.padStart(4, '0') : pokemon.id;
        return (
            pokemon.name.toLowerCase().includes(query) ||
            pokemonId.includes(query)
        );
    });
});

// Function to load more Pokémon (called when clicking "Load More")
const loadMore = async () => {
    offset.value += limit.value;
    await store.fetchPokemons(limit.value, offset.value);
};

const toggleFavorite = (id) => {
    if (favorites.value.has(id)) {
        favorites.value.delete(id); // Remove if already favorited
    } else {
        favorites.value.add(id); // Add if not favorited
    }

    // Save the updated favorites list to localStorage
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites.value)));
};

const isFavorited = (id) => {
    return favorites.value.has(id);
};

const openDialog = (pokemon) => {
    selectedPokemon.value = pokemon;
    isDialogVisible.value = true;
};

</script>
