# Installation

guide on how to install this fork

# Requirements
- [Nodejs](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- Any Discord verision (including ptb stabel or canary)

# Steps

## Nodejs & pnpm installation
Either get nodejs using winget from typing this in your terminal: 
```powershell
winget install -e --id OpenJS.NodeJS
```
Or navigate to https://nodejs.org/ to get node.

Then open a powershell window and type this to install pnpm: 
```powershell
irm https://get.pnpm.io/ps1 | iex
```

## Build from source

Click Code > Download ZIP, then extract to a folder. In that folder open an powershell window then type:

```powershell
pnpm install
```

After that install these userplugins into Discord: 
```powershell
pnpm build
```
Then i think thats it


### hi echo here.
-# no mally thats not it

After that please run: 
```powershell
pnpm inject
```
