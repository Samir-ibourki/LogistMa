import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Zone from './Zone.js';
import Driver from './Driver.js';
class Parcel extends Model {
}
Parcel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    trackingCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'assigned', 'picked_up', 'delivered', 'cancelled'),
        allowNull: false,
    },
    pickupAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pickupLat: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    pickupLng: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deliveryLat: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    deliveryLng: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    weight: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    zoneId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Zone,
            key: 'id',
        },
    },
    driverId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Driver,
            key: 'id',
        },
    },
}, {
    sequelize,
    tableName: 'parcels',
});
export default Parcel;
