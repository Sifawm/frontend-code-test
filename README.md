Welcome to this code test! :)

The main objective of this technical excercise is for you to get a good grasp of what kind of problems we encounter on Genially. We wouldn't want you to find some nasty surprises if you decide to join us.

# Technology included

As you can see, the code test is a simple create-react-app, with some included libraries and some code bundled with it. Let's go through some of the lesser-known technologies.

## mobx-state-tree (MST for short)

This is the app state manager we use at our React apps. It's meant to be used with mobx, and unlike it, is very opinionated as how you should define your stores, models etc.

https://github.com/mobxjs/mobx-state-tree

## interact.js

Genially is a very interactivity-heavy application. Almost everything you use on the app can be moved around with your mouse, selected, scaled, rotated, etc. This library does most of the heavy lifting for us.

https://interactjs.io/

# Test requirements

The test is an extremely simplified version of the Genially editor. We provide you a working area, named `Canvas`, and elements that are displayed inside of it, named `Box`.

We've also added a rudimentary toolbar for some of the required functionality.

When finished, the app should let the user:

- Add and remove boxes.
- Select a box, which should visually indicate that is selected
- Drag the boxes around using interact.js and using React refs.
  - Keep in mind you should be able to drag a box even if it's not selected when the dragging starts.
- Changing a box's color.

# Extra credit

If you found the above too easy, or are feeling up for a bigger challenge, here are some extra tasks you could attempt:

- Display a counter indicating how many boxes are selected.
- Support selection, dragging and color changing for multiple boxes.
- Save the state of the app locally and restore it when it loads.
- Undo / Redo capabilities
  - **hint**: mobx-state-tree provides a middleware for this.

# Contact

If you have any questions about the test, you can contact any of us:

- Chema (chema@genial.ly)
- Rafa (rafa@genial.ly)
- Román (roman@genial.ly)

Good Luck!

# Development decissions

## Add

When a user adds a box to the canvas, the color used is the current selected color on Toolbar.

## Select

The user can select a box with:

- Left Click: Unselect all boxes and select this box
- CTRL + Left Click on an unselected box: Select this box and keep current selected boxes
- CTR + Left Click on a selected box: Unselect this box and keep the other boxes selected

## Saved state

To improve size, the undo history wouldn't be saved. When the user loads the app with a saved state, the history will be empty and start from here.
To improve performance, the save will be start after a 300ms without a new save event. Without this condition, when we have a big state to save, when we drag multiple elements, the action is not smooth.
The saved state dont save selected elements.
