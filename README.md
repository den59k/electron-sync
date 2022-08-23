# Electron Sync

The library is provided to synchronize data between the main process and the renderer

## Structure

Code splited on 3 parts:

### Main

Main containts methods for main process

```
import { syncMain, proxyMethods } from '@den59k/electron-sync/lib/main'

```

### Renderer

Renderer containts methods for renderer process

```
import { syncRenderer } from '@den59k/electron-sync/lib/main'

```

### Preload 

And finally, scripts for preload

```
import { bridge, proxy } from '@den59k/electron-sync/lib/preload'
```

Example of use:
```
const electronBridge = {
  ...bridge,
  messages: proxy<typeof messageService>("messages", [ "send", "edit", "delete" ], [ "sendAsync" ], [ "getMessagesCount" ])
}

contextBridge.exposeInMainWorld('electron', electronBridge)
```