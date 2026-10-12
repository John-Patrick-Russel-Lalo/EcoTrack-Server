const store = require('../store/binStore');
const driverStore = require('../store/driverStore');

function createMessageHandler(broadcast, connectionId) {
  return function handleMessage(ws, raw) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error('Invalid message payload:', err.message);
      return;
    }

    switch (data.type) {
      case 'trashbin': {
        const bin = store.add({
          latitude: data.latitude,
          longitude: data.longitude,
        });
        broadcast(bin);
        console.log(`New bin added with ID: ${bin.id}`);
        break;
      }

      case 'deletebin': {
        if (store.remove(data.id)) {
          broadcast({ type: 'deletebin', id: Number(data.id) });
          console.log(`Bin deleted with ID: ${data.id}`);
        }
        break;
      }

      case 'editbin': {
        const bin = store.moveByCoordinates(
          data.oldLatitude,
          data.oldLongitude,
          data.newLatitude,
          data.newLongitude,
        );
        if (bin) {
          broadcast({ type: 'editbin', ...bin });
          console.log(`Bin edited with ID: ${bin.id}`);
        }
        break;
      }

      case 'updatebinstatus': {
        const bin = store.updateStatus(data.id, data.status);
        if (!bin) {
          console.error(`Cannot update bin ${data.id} to status ${data.status}`);
          break;
        }
        broadcast({
          type: 'binstatus',
          id: bin.id,
          status: bin.status,
          latitude: bin.latitude,
          longitude: bin.longitude,
        });
        console.log(`Bin ${bin.id} status updated to: ${bin.status}`);
        break;
      }

      case 'location':
        console.log('User location:', data.latitude, data.longitude);
        break;

      case 'driverlocation': {
        const driver = driverStore.update(connectionId, data.latitude, data.longitude);
        broadcast(driver);
        break;
      }

      default:
        console.log(`Unknown message type: ${data.type}`);
    }
  };
}

module.exports = { createMessageHandler };
