import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Parcel from './Parcel.js';
import Driver from './Driver.js';
class Delivery extends Model {
}
Delivery.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    parcelId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Parcel,
            key: 'id',
        },
    },
    driverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Driver,
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('assigned', 'picked_up', 'delivered', 'failed'),
        allowNull: false,
    },
    estimatedRoute: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    receiptGenerated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'deliveries',
});
export default Delivery;
