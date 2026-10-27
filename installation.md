# Installation

### hi big mally here

guide on how to install this fork

# Requirements
- [Git](https://git-scm.com/install/windows)
- [Github.CLI](https://cli.github.com)
- [NodeJs](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- Any Discord desktop app verision (including ptb stabel or canary)

# Steps

## 1. Git, GitHub.CLI, Nodejs & pnpm installation

Get Git with winget in powershell:
```powershell
winget install -e --id Git.Git
```
Get GitHub.CLI with winget in powershell:
```powershell
winget install -e --id GitHub.cli
```

Get NodeJs with winget in powershell: 
```powershell
winget install -e --id OpenJS.NodeJS
```

Get pnpm in powershell: 
```powershell
irm https://get.pnpm.io/ps1 | iex
```

## 2. Build from source

### hi its echo here. if you're a noob, follow these instructions.
*(this creates a folder named "git_repos" in your default Documents folder, and clones the repo into it for it to live there)*

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
