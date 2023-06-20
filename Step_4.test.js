import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Controls from '../components/Controls';
import { checkWin, printMessage } from '../utils/checkWin';
import App from '../App';
import * as shuffleDeckModule from '../utils/shuffleDeck';

describe('checkWin', () => {
  const events = {
    bet: 'bet',
    userTurn: 'userTurn',
    dealerTurn: 'dealerTurn',
    resolve: 'resolve',
    userWon: 'userWon',
    dealerWon: 'dealerWon',
    draw: 'draw',
    userBlackjack: 'userBlackjack',
    gameOver: 'gameOver',
  };

  test('returns draw when both player and dealer have blackjack', () => {
    const result = checkWin(21, 2, 21, 2, events);
    expect(result).toBe(events.draw);
  });

  test('returns userBlackjack when user has blackjack', () => {
    const result = checkWin(21, 2, 18, 3, events);
    expect(result).toBe(events.userBlackjack);
  });

  test('returns dealerWon when dealer has blackjack', () => {
    const result = checkWin(17, 3, 21, 2, events);
    expect(result).toBe(events.dealerWon);
  });

  test('returns dealerWon when user busts', () => {
    const result = checkWin(22, 3, 18, 3, events);
    expect(result).toBe(events.dealerWon);
  });

  test('returns userWon when dealer busts', () => {
    const result = checkWin(19, 3, 22, 3, events);
    expect(result).toBe(events.userWon);
  });

  test('returns dealerWon when dealer score is higher', () => {
    const result = checkWin(18, 3, 19, 3, events);
    expect(result).toBe(events.dealerWon);
  });

  test('returns userWon when user score is higher', () => {
    const result = checkWin(19, 3, 18, 3, events);
    expect(result).toBe(events.userWon);
  });

  test('returns draw when scores are equal', () => {
    const result = checkWin(18, 3, 18, 3, events);
    expect(result).toBe(events.draw);
  });
});

describe('printMessage', () => {
  const messages = {
    userWon: "You Win!",
    dealerWon: "Dealer Wins!",
    draw: "Push! It's a Tie!",
    userBlackjack: "BLACKJACK! You Win!"
  }

  test('returns correct message for userBlackjack', () => {
    const result = printMessage('userBlackjack', messages);
    expect(result).toBe(messages.userBlackjack);
  });

  test('returns correct message for userWon', () => {
    const result = printMessage('userWon', messages);
    expect(result).toBe(messages.userWon);
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
      { suit: 'spades', value: '2' },
      { suit: 'hearts', value: '6' },
      { suit: 'clubs', value: 'K' },
      { suit: 'hearts', value: 'K' },
      { suit: 'hearts', value: '5' },
      { suit: 'clubs', value: '5' },
      { suit: 'spades', value: '5' },
      // Losing scenario
    ]);
  });

  it('allows the user to hit and draws a card', () => {
    setup();

    // Click the "Hit" button
    const hitButton = screen.getByText(/HIT/i);
    fireEvent.click(hitButton);

    // Assert that a card is drawn
    const playerHand = screen.getByTestId('player-hand');
    const cardElements = screen.getAllByTestId('card');
    expect(cardElements).toHaveLength(5);
    expect(playerHand).toContainElement(cardElements[4]);
  });

  it('allows the user to stand and triggers the dealer turn', () => {
    setup();

    // Click the "Stand" button
    const standButton = screen.getByText(/STAND/i);
    fireEvent.click(standButton);

    // Assert that the dealer turn has started
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

  // it('checks win conditions and displays the correct message', () => {
  //   render(<App />);
  //   const betButton = screen.getByText(/Place Bet/i);
  //   userEvent.click(betButton);

  //   // Assert that the game has started
  //   const gameStatusMessage = screen.getByText(/Place your bet to begin/i);
  //   expect(gameStatusMessage).toBeInTheDocument();

  //   // Simulate game actions (hit/stand) to reach win conditions

  //   // Example: User wins
  //   const userHand = screen.getByTestId('hand-user');
  //   const dealerHand = screen.getByTestId('hand-dealer');

  //   // Manually set user and dealer cards
  //   userHand.innerHTML = '<div class="card">A</div><div class="card">2</div>';
  //   dealerHand.innerHTML = '<div class="card">K</div><div class="card">2</div>';

  //   // Click the "Stand" button
  //   const standButton = screen.getByText(/STAND/i);
  //   userEvent.click(standButton);

  //   // Assert the win message
  //   const winMessage = screen.getByText(/You Win!/i);
  //   expect(winMessage).toBeInTheDocument();

  //   // Example: Dealer wins
  //   // Reset the game
  //   userEvent.click(betButton);

  //   // Manually set user and dealer cards
  //   userHand.innerHTML = '<div class="card">A</div><div class="card">2</div>';
  //   dealerHand.innerHTML = '<div class="card">K</div><div class="card">Q</div>';

  //   // Click the "Stand" button
  //   userEvent.click(standButton);

  //   // Assert the lose message
  //   const loseMessage = screen.getByText(/Dealer Wins!/i);
  //   expect(loseMessage).toBeInTheDocument();

  //   // Example: Draw
  //   // Reset the game
  //   userEvent.click(betButton);

  //   // Manually set user and dealer cards
  //   userHand.innerHTML = '<div class="card">A</div><div class="card">2</div>';
  //   dealerHand.innerHTML = '<div class="card">A</div><div class="card">2</div>';

  //   // Click the "Stand" button
  //   userEvent.click(standButton);

  //   // Assert the draw message
  //   const drawMessage = screen.getByText(/Push! It's a Tie!/i);
  //   expect(drawMessage).toBeInTheDocument();
  // });

  // Add more test cases for other game scenarios

});
