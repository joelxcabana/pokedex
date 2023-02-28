import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapter/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ){

  }

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert: {name:string,no:number}[] = [];
    
    data.results.forEach(({name,url})=>{
      const segment = url.split('/')
      const no:number = +segment[segment.length - 2];

      //const pokemon = await this.pokemonModel.create({name,no})
      pokemonToInsert.push({name,no});
    })

    //await Promise.all(insertPromisesArray);
    await this.pokemonModel.insertMany(pokemonToInsert)
    return 'seed executed.'
  }
}
