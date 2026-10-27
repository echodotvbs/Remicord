# Installation

### hi folks its echo

guide on how to install this fork

# Requirements
- [Git](https://git-scm.com/install/windows)
- [GitHub.CLI](https://cli.github.com)
- [NodeJs](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [Discord](https://discord.com/download#) Any desktop app thats updated to the latest version (including ptb stabel or canary)

### if you dont know what youre doing, follow these instructions.

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
cd ~/Documents/git_repos/Remicord
```


After that- install, build and inject the repo:
*check for pnpm updates first:* 
```powershell
pnpm self-update
```

If already on the latest, or updated successfully, continue with:
```powershell
pnpm install
```
```powershell
pnpm build
```
```powershell
pnpm inject
```
and follow the onscreen instructions.

Thats it i think. (if you cant follow these instructions, just give up)
