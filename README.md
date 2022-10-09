<p align="center">
<img src="https://memetodo.vercel.app/icon.png" alt="MemeTodo logo" width="200"/>
</p>

# MemeTodo

MemeTodo is a todo list application that rewards you with random memes pulled from your desired subreddit.

## Installation
MemeTodo is built with Electron.js, and can run on Windows, MacOS, and Linux. You can find prebuilt installers on this project's accompanying website:
https://memetodo.vercel.app/

If you would like to build the installers out yourself from [the source](https://github.com/KDJDEV/MemeTodo), you can do so by running:
```
npm run dist
```
Yes, it's as simple as that thanks to [electron-builder](https://github.com/electron-userland/electron-builder).
Note that you may not be able to build all installers from one OS. For example, you cannot build MacOS installers from a Windows machine.
## Usage
### Creating new tasks
New tasks(aka todos) can be created by clicking the "Add new tasks" button.
### Removing and completing tasks
Active tasks can be either completed or deleted. Completing a task rewards you with a meme, and can be accomplished by clicking the checkmark icon 
<img src="https://memetodo.vercel.app/check.png" alt="MemeTodo logo" width="13"/>
 on the right side of the task. Deleting a task removes it from the task list, and can be accomplished by clicking the trash button 
<img src="https://memetodo.vercel.app/trash.png" alt="MemeTodo logo" width="13"/>
.

### Job groups
A new group of tasks can be created by clicking the plus button next to your preexisting job tabs at the top of the application viewport. Entire groups can be removed by clicking "Remove job" with your desired group selected. You can select and switch between groups by clicking the tabs at the top of the viewport.

### Setting your subreddit
Meme Todo sources it's memes by grabbing random posts from subreddits. You can change this subreddit(which is by default [/memes](https://www.reddit.com/r/memes/)), by clicking the options gear
<img src="https://memetodo.vercel.app/gear.png" alt="MemeTodo logo" width="13"/>
 in the top right-ish part of the viewport, and then editing the "Subreddit" field.

Here are some recommended subreddits:
- [/cleanmemes](https://www.reddit.com/r/cleanmemes/)
- [/programmingmemes](https://www.reddit.com/r/programmingmemes/)
- [/spongebobmemes](https://www.reddit.com/r/spongebobmemes/)

It should be noted that subreddits do not need to be strictly meme-related. Some non-meme suggestions are:
- [/aww](https://www.reddit.com/r/aww/)
- [/motivationalquotes](https://www.reddit.com/r/motivationalquotes/)

Choose whatever motivates you most!

## Motivations
The idea behind this project is that by providing a sort of positive feedback through memes on task completion, users will be more motivated to complete their own personal tasks.

## License
[MIT](https://github.com/KDJDEV/MemeTodo/blob/main/LICENSE)
