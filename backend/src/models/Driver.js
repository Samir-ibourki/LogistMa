import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Zone from './Zone.js';
class Driver extends Model {
}
Driver.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('available', 'busy', 'offline'),
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
}, {
    sequelize,
    tableName: 'drivers',
});
export default Driver;
