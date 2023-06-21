import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { checkWin, printMessage } from '../utils/checkWin';
import App from '../App';
import * as shuffleDeckModule from '../utils/shuffleDeck';

describe('checkWin', () => {
  const events = {
    bet: 'bet',
    playerTurn: 'playerTurn',
    dealerTurn: 'dealerTurn',
    resolve: 'resolve',
    playerWon: 'playerWon',
    dealerWon: 'dealerWon',
    draw: 'draw',
    playerBlackjack: 'playerBlackjack',
    gameOver: 'gameOver',
  };

  test('returns draw when both player and dealer have blackjack', () => {
    const result = checkWin(21, 2, 21, 2, events);
    expect(result).toBe(events.draw);
  });

  test('returns playerBlackjack when player has blackjack', () => {
    const result = checkWin(21, 2, 18, 3, events);
    expect(result).toBe(events.playerBlackjack);
  });

  test('returns dealerWon when dealer has blackjack', () => {
    const result = checkWin(17, 3, 21, 2, events);
    expect(result).toBe(events.dealerWon);
  });

  test('returns dealerWon when player busts', () => {
    const result = checkWin(22, 3, 18, 3, events);
    expect(result).toBe(events.dealerWon);
  });

  test('returns playerWon when dealer busts', () => {
    const result = checkWin(19, 3, 22, 3, events);
    expect(result).toBe(events.playerWon);
  });

  test('returns dealerWon when dealer score is higher', () => {
    const result = checkWin(18, 3, 19, 3, events);
    expect(result).toBe(events.dealerWon);
  });

  test('returns playerWon when player score is higher', () => {
    const result = checkWin(19, 3, 18, 3, events);
    expect(result).toBe(events.playerWon);
  });

  test('returns draw when scores are equal', () => {
    const result = checkWin(18, 3, 18, 3, events);
    expect(result).toBe(events.draw);
  });
});

describe('printMessage', () => {
  const messages = {
    playerWon: "You Win!",
    dealerWon: "Dealer Wins!",
    draw: "Push! It's a Tie!",
    playerBlackjack: "BLACKJACK! You Win!"
  }

  test('returns correct message for playerBlackjack', () => {
    const result = printMessage('playerBlackjack', messages);
    expect(result).toBe(messages.playerBlackjack);
  });

  test('returns correct message for playerWon', () => {
    const result = printMessage('playerWon', messages);
    expect(result).toBe(messages.playerWon);
  });

  test('returns correct message for dealerWon', () => {
    const result = printMessage('dealerWon', messages);
    expect(result).toBe(messages.dealerWon);
  });

  test('returns correct message for draw', () => {
    const result = printMessage('draw', messages);
    expect(result).toBe(messages.draw);
  });
});

jest.mock('../utils/shuffleDeck');

describe('App component', () => {
  const setup = () => {
    render(<App />);

    const inputElement = screen.getByLabelText('Place your bet:');
    const buttonElement = screen.getByRole('button', {name: /Bet/i});

    fireEvent.change(inputElement, { target: { value: '30' } });
    fireEvent.click(buttonElement);
  }

  beforeEach(() => {
    shuffleDeckModule.default.mockReturnValue([
      { suit: 'hearts', value: '5' },
      { suit: 'clubs', value: '5' },
      { suit: 'spades', value: '5' },
      { suit: 'hearts', value: 'K' },
      { suit: 'clubs', value: 'K' },
      { suit: 'hearts', value: '6' },
      { suit: 'spades', value: '2' },
    ]);
  });

  afterEach(() => {
    shuffleDeckModule.default.mockClear();
  });

  it('allows the player to hit and draws a card', () => {
    setup();

    const hitButton = screen.getByText(/HIT/i);
    fireEvent.click(hitButton);

    const playerHand = screen.getByTestId('player-hand');
    const cardElements = screen.getAllByTestId('card');
    expect(cardElements).toHaveLength(5);
    expect(playerHand).toContainElement(cardElements[4]);
  });

  it('allows the player to stand and triggers the dealer turn', () => {
    setup();

    const standButton = screen.getByText(/STAND/i);
    fireEvent.click(standButton);

    const hitButton = screen.queryByText(/HIT/i);
    expect(hitButton).toBeNull();
    expect(standButton).not.toBeInTheDocument();
  });

  it('reveals the dealer\'s hole card when it\'s the dealer turn', () => {
    setup();

    const standButton = screen.getByText(/STAND/i);
    fireEvent.click(standButton);

    const dealerHand = screen.getByTestId('dealer-hand');
    const revealedCard = screen.getAllByTestId('card')[0];
    expect(dealerHand).toContainElement(revealedCard);
    expect(revealedCard).not.toHaveClass('card hiddenCard');
  });

  it('prevents the player from drawing more cards if he busts', () => {
    setup();

    const hitButton = screen.getByText(/HIT/i);
    fireEvent.click(hitButton);
    fireEvent.click(hitButton);

    const standButton = screen.queryByText(/STAND/i);
    expect(hitButton).not.toBeInTheDocument();
    expect(standButton).toBeNull();
  });

  it('ensures that dealer will draw to 16 and stand on 17', () => {
    setup();

    const standButton = screen.getByText(/STAND/i);
    fireEvent.click(standButton);

    const dealerHand = screen.getByTestId('dealer-hand');
    const cardElements = screen.getAllByTestId('card');
    expect(cardElements).toHaveLength(5);
    expect(dealerHand).toContainElement(cardElements[2]);
  });

  it('checks win conditions and displays the correct message', () => {
    setup();

    const hitButton = screen.getByText(/HIT/i);
    fireEvent.click(hitButton);
    const standButton = screen.getByText(/STAND/i);
    fireEvent.click(standButton);

    const loseMessage = screen.getByText(/Dealer Wins!/i);
    expect(loseMessage).toBeInTheDocument();
  });
});
