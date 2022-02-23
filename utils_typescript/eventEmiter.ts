/**
 * EventEmitter
 *
 * @desc An event emitter
 */

 interface Listener {
	cb: (...args: any[]) => void
	count: number
	name: string
}

class EventEmitter {
	listeners: Map<string, Listener[]> = new Map()

	on (param1: Listener['name'] | Listener, param2?: Listener['cb'], param3?: Listener['count']) {

		// Store reference to listener or create a listener from the params passed
		const listenerObj = (Object.prototype.toString.call(param1) === '[object Object]' ? param1 : { name: param1, cb: param2, count: param3 || Infinity}) as Listener

		// Register `listener.name` (if it hasn't been already) and then add the new listener to its list
		this.listeners.set(listenerObj.name, [...(this.listeners.get(listenerObj.name) || []), listenerObj])

		// Return an object with a reference to `off` with `listenerObj` populated, and the listener itself
		return {
			listener: listenerObj,
			off: () => this.off(listenerObj)
		}
	}

	off (listener: Listener) {

		// Exit if `listener.name` isn't registered
		if (!this.listeners.has(listener.name)) return

		// Store reference to listeners registered to `listener.name`
		let listenerRef = this.listeners.get(listener.name)!

		// Create a copy of `listener.name`'s registered listeners, with `listener` removed
		let filteredListeners = listenerRef.filter(eventListener => listener !== eventListener)

		// If there is at least one listener still registered, update the list with filtered copy from above
		if (filteredListeners.length) this.listeners.set(listener.name, filteredListeners)

		// Otherwise de-register `listener.name`
		else this.listeners.delete(listener.name)
	}

	emit (name: any, ...args: any) {

		// Exit if `name` isn't registered
		if (!this.listeners.has(name)) return

		// Loop over all listeners registered to `name`
		return this.listeners.get(name)!.map(listener => {

			// Call `callback` and pass through all arguments
			const val = listener.cb(...args)

			// Decrement `count`
			listener.count -= 1

			// If the count is `0`, then call `off`
			if (listener.count === 0) this.off(listener)

			// Return the result of `cb`
			return val
		})
	}
}

export const eventEmitter = new EventEmitter()



// como usar

// importar o eventEmitter import {eventEmitter} from 'caminho_para_eventEmitter'


// emitir evento 
// eventEmitter.emit('evento', 'parametro1', 'parametro2')

// registrar evento
//eventEmitter.on('evento', (parametro1, parametro2) => {})

// remover evento
// eventEmitter.off('evento')


//motivacao, meu chefe pediu pra chamar uma dterminada acao apenas quando clicar em um determinado botao q por um acaso estava absolutamente em outro componente
//com essa implementacao agora e possivel executar acoes de qualquer lugar da aplicacao
