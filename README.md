# Electron Sync

The library is provided to synchronize data between the main process and the renderer

Yeah, it is supports batching. All sync process exec in `nextTick`

## Structure

Code splited on 3 parts. for better performance you should import files from subdirectories.

### Main

Main containts methods for main process

```
import { syncMain, proxyMethods } from '@den59k/electron-sync/lib/main'

```

### Renderer

Renderer containts methods for renderer process

```
import { syncRenderer } from '@den59k/electron-sync/lib/renderer'

```

You can use it like this:

```
const data = syncRenderer('account', (obj: AccountData) => reactive(obj))
```

#### React + Mobx

If you are using React and mobx, you can set the action wrapper for all sync calls:

```
import { setActionWrapper } from '@den59k/electron-sync/lib/renderer'

setActionWrapper(action)
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