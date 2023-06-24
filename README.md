## Specifications

Start by importing the required files for this step: 

```bash
bash update_step_4.sh
```
You should have 3 new files in their respective directories.

### Controls

In `App.js`, import the Controls component. The Controls component will contain our game controls. On their turn, the player can choose to "hit" (draw another card), "stand" (end their turn and stop without taking a card). 

Add it to the App component's render method, and pass it some props! We should have:

- Event handler props for hit and stand
- The gameStatus to let the Controls component know when to render the buttons

Next, let's implement the event handler functions for hit and stand!

#### Inline event handlers

 In JSX, you can define an event handler inline. For instance, if you had a component like so:
 
 ```javascript
export default function Button() {
  function handleClick() {
    alert('Look at this photograph!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```
You could instead define it like so:
 
 ```javascript
<button onClick={function handleClick() {
  alert('Look at this photograph!');
}}>
```

or more concisely, with a arrow function:

```javascript
<button onClick={() => {
  alert('Look at this photograph!');
}}>
```

All of these styles are equivalent. Inline event handlers are convenient for short functions.

#### onHit

Now let's consider what should be called if a player decides to hit. Add the event handler prop into the Controls component. You can use the inline event handler here!

#### onStand

When the player decides to stand, they end their turn, and allow the dealer to resolve his hand by revealing the hidden card, and drawing cards until he achieves a total of 17 or higher. Create a event handler function that does the following:

- Sets the gameStatus to the dealer's turn
- Reveal dealer's hidden card
- Increase the count of the dealer's cards
- Update the dealer cards

Remember to pass the prop to the Controls component!

------------


Next, let's add a `useEffect` so that on his turn:

- If his score is below 17, he'll need to draw another card
- If not, set the gameStatus to `events.resolve`

We'll also need a `useEffect` to prevent the player to draw more cards if they get blackjack (1 Ace with any card of value 10) or they bust (go over 21 points) and move directly to the dealer's turn. Specify the correct dependencies for your useEffect hooks.

#### [Conditional Rendering](https://react.dev/learn/conditional-rendering)

Your components will often need to display different things depending on different conditions. In React, you can conditionally render JSX using JavaScript syntax like if statements, &&, and ? : operators. 

**Logical && operator:**

```javascript
function Sing({ audienceCount }) {
  return (
    <div>
      {audienceCount > 0 && <div>🎵 We're no strangers to love
You know the rules and so do I (do I) 🎵</div>}
    </div>
  );
}
```
The lyrics will only be rendered if `audienceCount` is more than 0. If not, nothing will be rendered.

**Ternary (? :) operator:**

```javascript
function RickAstley({ isGonna }) {
  return (
    <div>
      <h1>Give you up {isGonna ? '✅' : '❌'}</h1>
    </div>
  );
}

```
In the above example, the line "Give you up" will be followed by a checkmark '✅' if `isGonna` is true and a cross '❌' if `isGonna` is false.


#### Rendering the buttons conditionally

Let's implement this in our `Controls.js` component. After assigning the props, conditionally render the hit and stand buttons, so that they will only be rendered if `gameStatus` is `events.playerTurn`!

### Determine the winner

In `checkWin.js`, we'll use `checkWin` to return us the correct event based on the player and dealer hands, and `printMessage` to give us the correct message to display to the player based on the event.

#### checkWin

In Blackjack, the result of a game is determined as follows:

- A player total of 21 on the first two cards is a "blackjack", and the player wins immediately unless the dealer also has one, in which case the hand ties. 
- A blackjack beats any hand that is not a blackjack, even one with a value of 21.
- If the player exceeds 21 points, they bust, and they immediately lose, even if the dealer also busts.
-  If the dealer busts, the player wins if he's not busted. 
- If the dealer does not bust, the hand with the score closest to 21 wins, and it's a tie if both hands are the same score.

We'll pass in the `events` constant as a parameter to `checkWin`, so implement the logic needed to return us the correct event.

#### printMessage

We'll then pass the returned event and the `messages` constant to `printMessage`. Modify the function to return the correct message to display to the player based on the event.

Remember to import these functions into `App.js` when you're done!

#### Using useEffect to resolve the game

Finally, use `useEffect` to set `gameStatus` to the correct event with `checkWin` and set `message` with `printMessage` when `gameStatus` changes to `events.resolve`.

------------

As usual, run `npm test`when you're done and submit your solution once you pass all the tests!
