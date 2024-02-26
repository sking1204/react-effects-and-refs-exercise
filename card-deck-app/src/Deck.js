import React, { useEffect, useState } from "react"; 
import Card from "./Card";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";
/** Deck: uses deck of cards API to draw and shuffle. */

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(function loadDeckFromAPI() {
    async function fetchData() {
      const deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
      setDeck(deck.data);
    }
    fetchData();
  }, []);



  /** Draw card: change the state & effect will kick in. */
  async function draw() {
    try {
      const drawResult = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);

      if (drawResult.data.remaining === 0) throw new Error("Deck empty!");

      const card = drawResult.data.cards[0];

      setDrawn(drawnCard => [
        ...drawnCard,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);

      //Printing card to console       
      console.log("Drawn card:", card)
      console.log("Drawn cards:", drawn)
    } catch (err) {
      alert(err);
    }
  }

  /** Shuffle: change the state & effect will kick in. */
  async function startShuffling() {
    setIsShuffling(true);
    try {
      await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
      setDrawn([]);
    } catch (err) {
      alert(err);
    } finally {
      setIsShuffling(false);
    }
  }

  /** Return draw button (disabled if shuffling) */
  function renderDrawBtnIfOk() {
    if (!deck) return null;

    return (
      <button
        className="Deck-btn"
        onClick={draw}
        disabled={isShuffling}>
        DRAW
      </button>
    );
  }

  /** Return shuffle button (disabled if already is) */
  function renderShuffleBtnIfOk() {
    if (!deck) return null;
    return (
      <button
        className="Deck-btn"
        onClick={startShuffling}
        disabled={isShuffling}>
        SHUFFLE DECK
      </button>
    );
  }

  return (
    <main className="Deck">

      {renderDrawBtnIfOk()}
      {renderShuffleBtnIfOk()}

      <div className="Deck-card-container">{
        drawn.map(card => (
          <Card key={card.id} name={card.name} image={card.image} />
        ))}
      </div>

    </main>
  );
}

export default Deck;










