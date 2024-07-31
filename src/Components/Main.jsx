import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Card from "./Card";
import PokemonInfo from "./PokemonInfo";
import axios from "axios";

const Main = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [infoPokemon, setInfoPokemon] = useState();

  const getPokemon = useCallback(async (res) => {
    const promises = res.map(async (item) => {
      const result = await axios.get(item.url);
      return result.data;
    });
    const results = await Promise.all(promises);
    setPokemon(results.sort((a, b) => (a.id > b.id ? 1 : -1)));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(url);
      setNextUrl(response.data.next);
      setPrevUrl(response.data.previous);
      await getPokemon(response.data.results);
      setLoading(false);
    };

    fetchData();
  }, [url, getPokemon]);

  const handleNext = () => {
    setPokemon([]);
    setUrl(nextUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    setPokemon([]);
    setUrl(prevUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container">
      <div className="left-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card
            pokemon={pokemon}
            loading={loading}
            infoPokemon={(poke) => setInfoPokemon(poke)}
          />
        </motion.div>
        <div className="btn-group">
          {prevUrl && (
            <button onClick={handlePrevious}>
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!nextUrl}
          >
            Next
          </button>
        </div>
      </div>
      <div className="right-content">
        <motion.div
          key={infoPokemon?.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <PokemonInfo data={infoPokemon} />
        </motion.div>
      </div>
    </div>
  );
};

export default Main;
