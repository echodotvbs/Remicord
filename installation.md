# Installation

### hi big mally here

guide on how to install this fork

# Requirements
- [Nodejs](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- Any Discord verision (including ptb stabel or canary)

# Steps

## 1. Nodejs & pnpm installation
Get NodeJs with winget in powershell: 
```powershell
winget install -e --id OpenJS.NodeJS
```
Or navigate to https://nodejs.org/ to get node.

Same powershell windows, install pnpm: 
```powershell
irm https://get.pnpm.io/ps1 | iex
```

## 2. Build from source

### hi its echo here. if you're a noob, follow these instructions.

In powershell, run one after the other to create your clone of the repository:
```powershell
New-Item -ItemType Directory -Path "$HOME\Documents\git_repos"
```
```powershell
cd ~/Documents/git_repos
```
```powershell
git clone https://github.com/echodotvbs/Remicord/
```

Next, navigate to the cloned folder (within the same terminal):
```powershell
cd Remicord
```
If the first one doesnt work;
```powershell
cd %USERPROFILE%\Documents\git_repos\Remicord
```
### hi it big mally again

After that install these userplugins into Discord:
```powershell
pnpm install
```
```powershell
pnpm build
```
Then i think thats it


### echo again.
#### no big mally thats not it

After that please run: 
```powershell
pnpm inject
```
and follow the onscreen instructions.

THATS it i think. (if you cant follow these instructions, just give up)
