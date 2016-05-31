# Recipe Box

## Initial Version

This initial version is mostly ZURB Foundation hacked together with some jQuery and Handlebars templates.  

## Roadmap

Lots of things on my list of wants to do right now.  We will see how this actually goes, though.

1. Working prototype that works well enough I want to use it for myself
2. Rewrite in React
3. Enhancements
4. React native (mostly for the learning experience)

## JavaScript RB.* Naming Conventions

Since this first version is using jQuery it's a bit of a trick to make it properly maintainable.  While it's not really _meant_ to be maintainable (that's what I already know it's going to be rewritten) the initial release is going to be enough code that some structure and convention is necessary to make this work.  It feels like I might as well just take the dive to React (or at least use Backbone that I'm already familiar with) but sticking to jQuery to separate my concerns is important.  I want to focus on getting usable version as quickly as possible and learning React, Redux, Nodejs (to make it universal rendered) and even Relay/Falcor to make it really performant is simply too much of a rabbit hole.  So here we have some conventions which are as much for me as they are for anyone since I'm assuming nobody else is ever going to see this particular version.

### Resource Modules

Each resource in the plural form (recipes, boxes, sections) has their own object that organizes the code tied to the RB global namespace.  So `RB.boxes` is the object dedicated to the functionality of the boxes resource, etc.

- `init`: event handlers, anything to run on page load
- `new`: preparing the "create new" form and any data retrievals that need to happen (if there is anything for this, might be that the particular resource can skip this and just use other functionality such as the `drawer` utility to accomplish what is needed)
- `create`: processing the "create new" form, sending it off to the API and handling the result
- `load`: retrieving the data (maybe should be used as a pair with a yet-to-be-implemented `show`)
- `edit`: same as the `new` function but for preparing existing resources to be updated
- `update`: same as the `create` function but for updating existing resources
- `remove`: processing the removal request

