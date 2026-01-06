import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import Zone from './Zone.js';

interface DriverAttributes {
  id: string;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  capacity: number;
  status: 'available' | 'busy' | 'offline';
  zoneId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DriverCreationAttributes extends Optional<DriverAttributes, 'id'> {}

class Driver extends Model<DriverAttributes, DriverCreationAttributes> implements DriverAttributes {
  public id!: string;
  public name!: string;
  public phone!: string;
  public latitude!: number;
  public longitude!: number;
  public capacity!: number;
  public status!: 'available' | 'busy' | 'offline';
  public zoneId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Driver.init(
  {
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
  },
  {
    sequelize,
    tableName: 'drivers',
  }
);

export default Driver;
