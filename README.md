# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- [x] View the optimal layout for the app depending on their device's screen size
- [x] See hover states for all interactive elements on the page
- [x] Add new todos to the list
- [x] Mark todos as complete
- [x] Delete todos from the list
- [x] Filter by all/active/complete todos
- [x] Clear all completed todos
- [x] Toggle light and dark mode
- [x] **Bonus**: Drag and drop to reorder items on the list
- [ ] **Bonus**: Build this project as a full-stack application (**SOON** check here [Continued development](#continued-development))

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- HTML5
- CSS
- Vanilla JS
- Flexbox
- Mobile-first workflow

### What I learned

There's a particular part of my css that does a border color with gradients as you hover on an unticked checkbox, and I'm trying to work it exactly as the design provided by Frontend Mentor, it is a bit tricky as I'm not yet familiar with linear and radial gradients but I somehow achieved it. If you're reading this and not able to achieve it, Check the code snippet below &#128513; &#128513;

```css
.round-checkbox input[type="checkbox"]:not(:checked) + label:hover {
  border: 1px solid transparent;
  background-image: linear-gradient(var(--foreground), var(--foreground)), radial-gradient(circle at top left,hsl(192, 100%, 67%), hsl(280, 87%, 65%));
  background-origin: border-box;
  background-clip: content-box, border-box;
  display: inline-block;
}
```

### Continued development

I want to continue this as a fullstack application using NodeJS Express and MongoDB.

### Useful resources

- [SortableJS](https://sortablejs.github.io/Sortable/) - This library helped me to add drag and drop, so simple to use thanks to their documentation and sample implementations.

## Author

- Frontend Mentor - [@rfcho322](https://www.frontendmentor.io/profile/rfcho322)

