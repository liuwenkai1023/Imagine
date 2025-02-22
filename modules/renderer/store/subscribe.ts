import { ipcRenderer } from 'electron'
import { Store } from 'redux'
import { shallowCompare } from '../../common/utils'
import { IpcChannel, IBackendState, IState } from '../../common/types'

export default function subscribe(store: Store<IState>) {
  let backendState: IBackendState

  /**
   * When `IBackendState` changed, sync to backend
   */
  return store.subscribe(() => {
    const state = store.getState()
    const nextBackendState: IBackendState = {
      taskCount: state.tasks.length,
      aloneMode: !!state.globals.activeId,
    }

    if (!shallowCompare(backendState, nextBackendState)) {
      ipcRenderer.send(IpcChannel.SYNC, nextBackendState)
    }

    backendState = nextBackendState
  })
}
