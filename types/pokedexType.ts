export type Pokedex = {
    id: number;
    name: string;
    url: string;
    image: string;
}
export type PokemonDetails = {
    height: number;
    weight: number;
    stats: {
        name: string;
        value: number;
    }[];
};