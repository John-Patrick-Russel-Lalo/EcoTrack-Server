class DriverStore {
  constructor() {
    this.drivers = new Map();
    this.nextId = 1;
  }

  createId() {
    return this.nextId++;
  }

  update(id, latitude, longitude) {
    const driver = { type: 'driverlocation', id, latitude, longitude };
    this.drivers.set(id, driver);
    return driver;
  }

  remove(id) {
    return this.drivers.delete(id);
  }

  getAll() {
    return Array.from(this.drivers.values());
  }
}

module.exports = new DriverStore();
