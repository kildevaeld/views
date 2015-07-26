
module events {
  export interface EventHandler {
    (...args: any[])
  }

  interface Events {
    name: string
    once: boolean
    handler: EventHandler
    ctx: any
  }

  export interface IEventEmitter {
    listenId: string
    on (event: string, fn:EventHandler, ctx?:any): any
    once(event: string, fn:EventHandler, ctx?:any): any
    off (event: string, fn?:EventHandler, ctx?:any): any
    trigger (event: string, ...args:any[]): any

  }

  var idCounter = 0
  function getID (): string {
    return "" + (++idCounter)
  }

  export class EventEmitter implements IEventEmitter {
    listenId: string
    private _events: { [key: string]: Events[] } = {}
    private _listeningTo: { [key: string]: any } = {}

    on (event: string, fn:EventHandler, ctx?:any, once:boolean = false): any {
      let events = this._events[event]||(this._events[event]=[])
      events.push({
        name: event,
        once: once,
        handler: fn,
        ctx: ctx||this
      })
      return this
    }

    once (event: string, fn:EventHandler): any {
      return this.on(event, fn, true)
    }

    off (eventName?: string, fn?:EventHandler): any {
      if (eventName == null) {
        this._events = {}
      } else if (this._events[eventName]){
        let events = this._events[eventName]
        if (fn == null) {
          this._events[eventName] = []
        } else {
          for (let i=0;i<events.length;i++) {
            let event = events[i]
            if (events[i].handler == fn) {
              this._events[eventName].splice(i,1)
            }
          }
        }

      }

    }

    trigger (eventName: string, ...args:any[]): any {
      let events = (this._events[eventName]||[]).concat(this._events["all"]||[])

      for (let i=0;i<events.length;i++) {
        let event = events[i]

        event.handler.apply(event.ctx, args)

        if (event.once === true) {
          let index = this._events[event.name].indexOf(event)
          this._events[event.name].splice(index,1)
        }
      }

      return this


    }

    listenTo (obj: IEventEmitter, event: string, fn:EventHandler, ctx?:any, once:boolean = false): any {
        let listeningTo = this._listeningTo|| (this._listeningTo = {});
        let id = obj.listenId || (obj.listenId = getID())
        listeningTo[id] = obj;
        let meth = once ? 'once' : 'on';

        obj[meth](event, fn, this);

        return this;
    }

    listenToOnce (obj: IEventEmitter, event: string, fn:EventHandler, ctx?:any): any {
      return this.listenTo(obj, event, fn, ctx, true)
    }

    stopListening (obj?: IEventEmitter, event?:string, callback?:EventHandler) {
        let listeningTo = this._listeningTo;

        var remove = !event && !callback;
        //if (obj) (listeningTo = {})[obj.listenId] = obj;

        for (var id in listeningTo) {
          obj = listeningTo[id];
          obj.off(event, callback, this);

          //if (remove || !Object.keys(obj._listeners).length) delete this._listeningTo[id];
        }
        return this;
    }
  }

}
