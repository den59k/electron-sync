# Electron Sync

The library is provided to synchronize data between the main process and the renderer

Yeah, it is supports batching. All sync process exec in `nextTick`

## Structure

Code splited on 3 parts. For better performance you should import files from subdirectories.

### Main

Main containts methods for main process

```
import { syncMain, proxyMethods } from '@den59k/electron-sync/lib/main'

```

#### You can use it like this:

For data:
```
import { syncMain } from "@den59k/electron-sync/lib/main"

class CounterData {
  value = 1
}

const counterData = syncMain(new CounterData(), [ "counter" ])
export { counterData, CounterData }
```

For methods:
```
import { proxyMethods } from '@den59k/electron-sync/lib/main'
import { counterData } from '../data/counter'

class CounterService {
  
  constructor() {
    proxyMethods(this, "counter")
  }

  increment() {
    counterData.value++
  }

}

export const counterService = new CounterService()
```

### Renderer

Renderer containts methods for renderer process

```
import { syncRenderer } from '@den59k/electron-sync/lib/renderer'

```

#### You can use it like this:

```
const data = syncRenderer('counter', (obj: CounterData) => reactive(obj))
```

#### React + Mobx

If you are using React and Mobx, you can set the action wrapper for all sync calls:

```
import { action } from 'mobx'
import { setActionWrapper } from '@den59k/electron-sync/lib/renderer'

setActionWrapper(action)
```

### Preload 

And finally, scripts for preload

```
import { bridge, proxy } from '@den59k/electron-sync/lib/preload'
```

#### Example of use:
```
const electronBridge = {
  ...bridge,
  counter: counter: proxy<typeof counterService>("counter", [ "increment" ], [], []))
}

contextBridge.exposeInMainWorld('electron', electronBridge)
```