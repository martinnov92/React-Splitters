# Splitters for React

Splitters for React has been written in TypeScript.

<b> !!! This is still work in progress !!! </b>

There are two options how the splitter can work.
You can either select to resize splitters as you are holding and dragging the handlebar, or you can
postponed the resize.

Splitters can be nested, but you have to specify what positon are they going to be and their sizes.

Vertical splitter
```js
primaryPaneMinWidth={number}
primaryPaneMaxWidth="string" (% or px)
primaryPaneWidth="string" (% or px)

```

Horizontal splitter
```js
primaryPaneMinHeight={number}
primaryPaneMaxHeight="string" (% or px)
primaryPaneHeight="string" (% or px)
```