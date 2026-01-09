import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import Zone from './Zone.js';
import Driver from './Driver.js';

interface ParcelAttributes {
  id: string;
  trackingCode: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  weight: number;
  zoneId: string;
  driverId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ParcelCreationAttributes extends Optional<ParcelAttributes, 'id'> {}

class Parcel extends Model<ParcelAttributes, ParcelCreationAttributes> implements ParcelAttributes {
  declare id: string;
  declare trackingCode: string;
  declare status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  declare pickupAddress: string;
  declare pickupLat: number;
  declare pickupLng: number;
  declare deliveryAddress: string;
  declare deliveryLat: number;
  declare deliveryLng: number;
  declare weight: number;
  declare zoneId: string;
  declare driverId: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Parcel.init(
  {
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
  },
  {
    sequelize,
    tableName: 'parcels',
  }
);

export default Parcel;
