import sequelize from "../config/database.js";
import Zone from "./Zone.js";
import Driver from "./Driver.js";
import Parcel from "./Parcel.js";
import Delivery from "./Delivery.js";


// Zone <-> Driver
Zone.hasMany(Driver, { foreignKey: "zoneId" });
Driver.belongsTo(Zone, { foreignKey: "zoneId" });

// Zone <-> Parcel
Zone.hasMany(Parcel, { foreignKey: "zoneId" });
Parcel.belongsTo(Zone, { foreignKey: "zoneId" });

// Driver <-> Parcel
Driver.hasMany(Parcel, { foreignKey: "driverId" });
Parcel.belongsTo(Driver, { foreignKey: "driverId" });

// Driver <-> Delivery
Driver.hasMany(Delivery, { foreignKey: "driverId" });
Delivery.belongsTo(Driver, { foreignKey: "driverId" });

// Parcel <-> Delivery
Parcel.hasMany(Delivery, { foreignKey: "parcelId" });
Delivery.belongsTo(Parcel, { foreignKey: "parcelId" });

export { sequelize, Zone, Driver, Parcel, Delivery };
