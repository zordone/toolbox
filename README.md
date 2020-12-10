# Toolbox

Collection of my small development tools bundled in an Electron app.

My tools are probably not that useful for others, but the project might be a good starting point to build your own toolbox.

## Tools

There are only a few tools at the moment. I will add new tools incrementally.

## Platform

Usually, when I make small tools for myself, it's not worth the time to polish them, or create reusable components.

But since I plan to add a lot of tools to this toolbox, I've spent a lot of time creating kind of a platform for them. This makes it easy to add new tools, make their UIs consistent, generalise often needed functionalities, etc. It also contains base components for classes of tools, like generators, analyzers, playgrounds.

## Main scripts

- `npm start` - Start development in browser.
- `npm run dev` - Start development in electron.
- `npm run make` - Build MacOS app.
