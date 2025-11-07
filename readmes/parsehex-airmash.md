# [parsehex/airmash](https://parsehex.github.io/airmash/)

AIRMASH is a web game originally created by the developer named **Five Sigma**. Play the game by flying one of 5 aircraft around a 2D map of planet Earth and destroy enemy aircraft. Keyboard controls are WASD/Arrows + Shift/Control and Space.

I'm not well-known but I've been playing AIRMASH for about 7 years, using various but mostly meaningless [names](./names.md). From early on I loved how hackable the game was and how surprisingly active the modding scene was for a web game.

This project aims to provide links and information about the game Airmash as well as point to some of my so-called improvements that you can use to change how you play Airmash.

To be clear: **I did not create Airmash**, I'm simply enthusiastic about it and wish to build upon the awesome set of projects that the game is made of nowadays.

## [airmash-extensions](https://github.com/parsehex/airmash-extensions)

This is a collection of userscripts and Starmash extensions, some of which are forked from work by [fabiospampinato](https://github.com/fabiospampinato) and [Detect](https://github.com/Detect).

- [**Respawn Hotkey**](https://github.com/parsehex/airmash-extensions#respawn-hotkey) - Press **Shift** and one of the **numbers 1 thru 5** to respawn into a different aircraft.
- [**Laser Pointer**](https://github.com/parsehex/airmash-extensions#laser-pointer) (original by [fabiospampinato](https://github.com/fabiospampinato)) - Press **P** to toggle a straight line extending from the front of your aircraft.

## [airbattle-hosting](https://github.com/parsehex/airbattle-hosting)

This is a mono-repository which combines the [**frontend**](https://github.com/airmash-refugees/airmash-frontend) by [airmash-refugees](https://github.com/airmash-refugees), [wight](https://github.com/wight-airmash)'s [**ab-server**](https://github.com/wight-airmash/ab-server) and [Spatie](https://github.com/spatiebot)'s [**ab-bot**](https://github.com/spatiebot/ab-bot) into a single place where they all work together

- The project uses my own forks of the above projects: [ab-bot](https://github.com/parsehex/ab-bot) / [ab-frontend](https://github.com/parsehex/ab-frontend) / [ab-server](https://github.com/parsehex/ab-server)
- Use it to host your own Airmash server on your PC or use it as **single player with bots**
- (Experimental) An Electron wrapper is available which offers some UI controls like changing the game mode and number of bots.
  - You must [setup](https://github.com/parsehex/airbattle-hosting#setup) the project to run this. Since this whole thing is [unlicened](https://github.com/parsehex/airbattle-hosting#license), I will not be offering pre-built copies of this application.

### Why airbattle?

The server and the bots were already prefixed `ab-`, short for Airbattle, which sounds much less official than using the name Airmash. I think this is good because the project is **not official** despite the purpose of the project being to make it easier to _run Airmash_.

Considering that, using the name airbattle sounded like a good idea as as not to sound like I'm taking over the game -- which I don't even know how I'd do anyway.

## Airmash Links

If you'd like to learn more about the unique game Airmash, I can offer these links:

- [AIRMASH - the game that refused to die](https://www.janwillemboer.nl/blog/posts/2019-11-airmash-history/)
  - Blog post by Spatie about Airmash
- [Airmash Links Directory](https://lazersharkoverlord.github.io/airmash-directory/)
  - Learn about and find links for alternative clients for the game, which allows you to play with a different style or by adding features that the [vanilla client](https://airmash.rocks/) doesn't have.
- [r/airmash](https://www.reddit.com/r/airmash/)
  - Recommend reading through old posts
