# capmac commands

Every command accepts `--mac <name>` (which paired Mac) and `--verbose`; the ones that talk to the Mac also take `--route auto|lan|internet` (how to reach it this time). Options can also be set per project in `capmac.json`, next to `capacitor.config.*` (or an Electron app's `package.json`):

```json
{ "host": "studio", "ios": { "target": "iPhone 17 Pro", "team": "ABCDE12345", "scheme": "App" }, "web": { "build": "npm run build", "dev": "npm run dev" } }
```

An Electron app's commands go in `"electron": { "build": "npm run build", "start": "npm start", "dev": "npm run dev" }`, with `"dir"` for a Capacitor project's Electron platform folder (`electron` by default).

## Running

| Command | What it does |
|---|---|
| `capmac run` | Web build, sync, `npm install` and `cap sync` on the Mac when needed, xcodebuild, install, launch, then stream the app's console until stopped. |
| `capmac run --no-logs` | Same, but returns as soon as the app is running (it keeps running). |
| `capmac run --for <seconds>` | Same, streams the console for that long once the app runs, then stops the app and exits 0. |
| `capmac dev` | Live reload: starts the dev server (`dev`/`start` script, or `--url` for a running one), tunnels it to the Mac and rebuilds on native changes. Runs until stopped. |
| `capmac build` | Builds on the Mac without launching. |
| `capmac build --ipa --export <development\|ad-hoc\|app-store\|enterprise>` | Archives and exports a signed .ipa to `build/ios/` (`-o` to change). Needs signing set up by the user. |
| `capmac build --upload` | Uploads to App Store Connect / TestFlight. Ask the user first. |

Options shared by `run`, `dev` and `build`:

| Option | Meaning |
|---|---|
| `-a, --app <ios\|electron\|mac\|windows>` | Which of the project's apps (see `capmac apps`); `mac` and `windows` are a Flutter or React Native app's; default: the one picked with `capmac apps use` or in CapMac Studio. |
| `-t, --target <name\|udid>` | Simulator or device (see `capmac targets`); `mac` for the Mac's desktop, `pc` for this PC (a Flutter or React Native app's Windows app). |
| `--mode <debug\|profile\|release>`, `--flavor <name>`, `--main <file>`, `--dart-define K=V` | A Flutter app's build options. |
| `-e, --electron` | The Electron app, on the Mac's desktop (needed only in a Capacitor project that has iOS too). |
| `-d, --device` | A connected iPhone/iPad instead of a simulator. |
| `-c, --configuration <name>` / `--release` | Xcode configuration (Debug by default). |
| `--scheme <name>` | Xcode scheme (App by default). |
| `--team <id>` | Apple Developer Team ID, for devices. |
| `--clean` | Clean build. |
| `--full` | Reinstall node_modules on the Mac and run a full `cap sync`. |
| `--no-web-build` | Use the web folder as it is (`run` and `build`). |
| `--all-warnings` | Also show warnings from Pods and Swift packages. |
| `--xcodebuild-arg <arg>` | Extra xcodebuild argument (repeatable). |
| `--api-key <file.p8> --api-issuer <id>` | App Store Connect API key, so device builds can sign over SSH. |
| `--os-logs`, `--bridge` | Also show NSLog/os_log, or Capacitor bridge calls, in the console. |

## Looking at the app

| Command | What it does |
|---|---|
| `capmac screenshot [file] [-t <simulator>]` | Saves a PNG of a running simulator and prints its path (a temp file unless you give one). |
| `capmac screenshot --device [file]` | The same for the iPhone plugged into the Mac with a cable, at its full size. The first time, someone has to click Allow on the Mac. |
| `capmac screenshot --electron [file]` | The same for the running Electron app's window. |
| `capmac dialog [answer] [--cancel] [--check] [--json]` | The running Electron app's open dialogs, or an answer to the oldest: a button's number or label, or a path on the Mac. |
| `capmac logs [-t <simulator>]` | Streams the app's system log. Runs until stopped. |
| `capmac screen [--electron] [--device]` | The simulator, the Electron app's window, or a plugged-in iPhone's screen (view only), in a browser (for people, not agents). |
| `capmac targets [--json] [--electron]` | Simulators and devices on the Mac, with their state; `--electron` adds the Mac's desktop. |

## The Mac and the project

| Command | What it does |
|---|---|
| `capmac doctor [--fix] [-y]` | Checks this PC, the connection and the Mac; `--fix` repairs what it can (may ask for the Mac password). |
| `capmac info [--files]` | What CapMac detected and which files it syncs. No Mac needed. |
| `capmac apps [--json]` | The apps in this folder (and in the folders inside it) and the one CapMac uses; `capmac apps use <app>` changes it. No Mac needed. |
| `capmac backend [mac\|wsl] [--json]` | Where the project's iOS app builds: a paired Mac, or this PC with no Mac (WSL). With a name, picks it for `run`, `dev`, `build`, `doctor` and CapMac Studio (ask first). |
| `capmac wsl setup\|doctor\|targets\|build\|run\|dev` | Building on this PC: setup (Apple sign-in, so the user runs it), its checks, iPhones plugged into this PC, and the same build, run and live reload. |
| `capmac sync [--full]` | Syncs files and runs `cap sync` on the Mac. |
| `capmac exec [--no-sync] [--cwd project\|root\|ios] -- <command>` | Runs a command in the project on the Mac and prints its output. |
| `capmac pull <paths…> [-y]` | Copies files from the Mac's copy back to this PC. |
| `capmac open` | Opens the project in Xcode on the Mac's screen. |
| `capmac clean [--all]` | Deletes build products on the Mac; `--all` removes the whole copy (ask first). |
| `capmac macs`, `capmac use <name>` | Lists paired Macs, picks the default. |
| `capmac pair`, `capmac unpair <name>`, `capmac keychain` | Need the user: passwords and trust decisions. |
| `capmac takeover [on\|off]` | Whether `npx cap run ios` and `ionic capacitor run ios` go through CapMac. |
| `capmac cap <capacitor arguments>` | Runs `cap run ios`, `cap open ios` or `cap build ios` with Capacitor's own options. |

## Remote access (the Mac over the internet)

| Command | What it does |
|---|---|
| `capmac remote [status] [--test] [--json]` | Whether remote access is on, its settings, the service on the Mac, and how CapMac connects; `--test` also connects over the internet. |
| `capmac remote test [--json]` | Connects over the internet now and says how: peer to peer, or through the relay. |
| `capmac remote pcs [--json]` | The PCs that can reach the Mac over the internet. |
| `capmac remote on`, `off`, `set`, `server`, `revoke` | Change remote access. Ask the user first. |
