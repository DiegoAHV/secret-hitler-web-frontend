import io from 'socket.io-client';
import { actions as notifActions } from 'redux-notifications';

const { notifSend } = notifActions;

const socket = url => store => {
  const socket = io(url);

  socket.on('data', data => {
    const {type, payload} = data;
    store.dispatch({
      type: type + '_received',
      payload,
    });
  });

  socket.on('message', message => {
    const {type, text} = message;
    console.log(`server ${type}: ${text}`);
    notifSend({
      message: text,
      kind: 'info',
      dismissAfter: 3000,
    })(store.dispatch);
  });

  return next => action => {
    if(!action.socket) return next(action);

    socket.emit('data', action.socket);

    next({
      ...action,
      type: action.type + '_sent'
    });
  }
}

export default socket;
