# Splitters for React
<b>This is still work in progress </b>
<i>v. 1.0.0 alfa</i>

Splitters for React has been written in TypeScript.

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

Another options for splitter are:

* `postPoned`: Boolean

    * this specifies how the resize will work
    * default is false 

* `className`: string 
* `primaryPaneClassName`: string
* `secondaryPaneClassName`: string
* `dispatchResize`: Boolean
    
    * This dispatch resize event, it is meant for other components which resize on window resize
    * Default is false

* `maximizedPrimaryPane`: Boolean
* `minimalizedPrimaryPane`: Boolean