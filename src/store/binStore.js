const VALID_STATUSES = ['empty', 'half', 'full'];

class BinStore {
  constructor() {
    this.bins = new Map();
    this.nextId = 1;
  }

  getAll() {
    return Array.from(this.bins.values());
  }

  get(id) {
    return this.bins.get(Number(id));
  }

  add({ latitude, longitude, status = 'empty' }) {
    const id = this.nextId++;
    const bin = { type: 'trashbin', id, latitude, longitude, status };
    this.bins.set(id, bin);
    return bin;
  }

  updateStatus(id, status) {
    const bin = this.get(id);
    if (!bin) return null;
    if (!VALID_STATUSES.includes(status)) return null;
    bin.status = status;
    return bin;
  }

  moveByCoordinates(oldLatitude, oldLongitude, newLatitude, newLongitude) {
    for (const bin of this.bins.values()) {
      if (bin.latitude === oldLatitude && bin.longitude === oldLongitude) {
        bin.latitude = newLatitude;
        bin.longitude = newLongitude;
        return bin;
      }
    }
    return null;
  }

  remove(id) {
    const numericId = Number(id);
    if (!this.bins.has(numericId)) return false;
    this.bins.delete(numericId);
    return true;
  }
}

module.exports = new BinStore();
module.exports.VALID_STATUSES = VALID_STATUSES;
