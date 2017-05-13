# Percy
Hi. I'm a personal bot to send you notifications for rare spawns from LondonPogoMap. My basic features:
- I run in a browser instance of LondonPogoMap, so you'll need to keep a computer on.
- I send notifications to your phone via an app called Pushbullet, which you'll need to install.
- I filter based on distance from a fixed point ("radius"), IV and CP.
- You can set multiple rules for each Pokemon and your location, but only while at your computer.

### Setting up
1. Install Pushbullet on your phone from your app store and register an account. On the website https://www.pushbullet.com/, connect up your phone and, under *Settings*, generate an *Access Token* and note it down.
2. Make a copy of my code at [PercyPushbullet.js](https://github.com/Pyorot/Percy/blob/master/PercyPushbullet.js). Replace the *0* at `access_token` with your Pushbullet *Access Token*.
3. Set your home latitute and longitude by replacing the *0* at `home_lat` and `home_lng`, and set your filters (see __Setting the Filters__). See also __Perfect Mode__.
4. Open LondonPogoMap, set the in-map IV filter to 100% (this just hides almost all icons on the map, speeding it up), then click *Select All* on the in-map filter menu (strictly speaking, you need to select the mons that you want to be alerted for). Now, open up the browser's console (press F12 and click the relevant tab), paste your copy of my code there, and hit Enter. Within a few seconds, I should tell your phone I'm working :).

### Setting the Filters
Imitate the examples already in my code! This is the syntax:
```
set[147] = [
	{r: 0.5},
	{r: 2, iv: -3}
]
```
`147` is the Dex number of Dratini. You can specify filters for as many Pokemon as you like by copying and pasting this example block onto new lines with different numbers. Within the big set of square brackets is a list of units enclosed by `{`...`}`, which are separated from each other by `,` (so, leave a comma after each unit except the last one). Each unit may have the text `r: #`, `iv: #`, and `cp: #`, all of which are optional and separated by commas as before.

These are interpreted like this: a Pokemon is posted if it satisfies **any** of the `{`...`}` units. A unit is satisfied if **all** parts of it are satisfied, where missing `r`, `iv`, and `cp` are interpreted as any radius/IV/CP rsp. (including unknown). Of course, IV/CP filters will only work for Pokemon that the map tests for IV/CP.

The format for IV is *deficit from perfect IV* – i.e. 0 = 45/45 = 100%, -1 = 44/45 = 98%, -45 = 0/45 = 0%. Radius is always measured in km.

#### Examples:  
`{r: 2, iv: -3, cp: 100}` – 93%+ with CP 100+ within 2km of home.  
`{iv: 0, cp: 500}` – 100% with CP 500+ anywhere in London.  
`{}` – any of that species in London. Note that if you miss out the unit (curly braces), then this won't be scanned!

### Perfect Mode
There's a feature to alert you of any 100% Pokemon detected by the map near you. Set a radius at `perfect_r` and away you go.

### Debugging
If something goes wrong or just for fun, you can use the functions in my code. I'm very modular :). Type the following into the console after starting me. Alternatively, you can mod my functions individually by pasting them into the console.  
`Pokemons` – all Pokemon in the map's memory are stored here.  
`Pokemons[5]` – the Pokemon at position #5 in `Pokemons`.  
`notifyPB("I want some pizza","Pls")` – I'll send your phone a message via Pushbullet.  
`tell(Pokemons[5])` – I'll print a notification about Pokemon #5, as if I detected it.  
`poll()` – I'll silently check the map for new spawns and mark them as read.  
`loop()` – I'll check the map for new spawns and send them to you.  
`clearInterval(timer)` – Stops my checking loop. To restart, paste `var timer = setInterval(loop, 30 * 1000);`.

### Anything Else?
Pushbullet has a limit of 500 messages per month. If you exceed, make a new account!
