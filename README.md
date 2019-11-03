# Seelk hacking game

## Running instructions

To bootstrap the project and its dependencies, run :

```
yarn
```

To **start** the **backend** on port 3000, run :

```
yarn server
```

To **start** the **frontend** on port 1234, run :

```
yarn start
```

To **build** the **frontend**, run :

```
yarn build-prod
```

✅ Required Features ✅ :

- [x] Front-end for the user to create / ~~edit~~ / delete alerts on currency price  
      Examples: - Alert me when BTC falls under 5000$
    - Alert me when ETH is above 7000$
- [x] Should be able to check every minute for the condition and send an email when it is met
- [x] Send Alerts by email

⭐️ Bonus features ⭐️

- [x] 💪 The better the UI, the happier the user 😃
- [x] 💪 Display the current price of the chosen cryptocurrency when creating an alert
- [x] 💪💪State management (~~redux~~ MobX) 😋
- [x] 💪💪Display UI changes on alerts when condition is met _(in mails only)_
- [x] 💪💪💪 Percentage change: Be able to create an alert when the cryptocurrency increases by X% in a given timeframe
