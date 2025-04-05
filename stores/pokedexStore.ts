import { defineStore } from 'pinia';
import type { Pokedex, PokemonDetails } from '@/types/pokedexType';

export const usePokedexStore = defineStore('pokedex', () => {
  const pokemons = ref<Pokedex[]>([]);
  const pokemonDetails = ref<PokemonDetails>();

  const fetchPokemons = async (limit: number, offset: number) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      const fetchedPokemons = await Promise.all(
        data.results.map(async (pokemon: Pokedex) => {
          const id = pokemon.url?.split('/').filter(Boolean).pop();
          return {
            id: id,
            name: pokemon.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`, // Image URL
          };
        })
      );

      pokemons.value.push(...fetchedPokemons);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };

  const fetchPokemonById = async (id: number) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      pokemonDetails.value = {
        height: data.height,
        weight: data.weight,
        stats: data.stats.map((stat: any) => ({
            name: stat.stat.name.replace('-', ' '),
            value: stat.base_stat,
        })),
      };
    } catch (error) {
      console.error('Error fetching Pokémon by ID:', error);
    }
  };

  return {
    pokemons,
    pokemonDetails,
    fetchPokemons,
    fetchPokemonById
  };
});
