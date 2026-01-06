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
  driverId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ParcelCreationAttributes extends Optional<ParcelAttributes, 'id'> {}

class Parcel extends Model<ParcelAttributes, ParcelCreationAttributes> implements ParcelAttributes {
  public id!: string;
  public trackingCode!: string;
  public status!: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  public pickupAddress!: string;
  public pickupLat!: number;
  public pickupLng!: number;
  public deliveryAddress!: string;
  public deliveryLat!: number;
  public deliveryLng!: number;
  public weight!: number;
  public zoneId!: string;
  public driverId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      allowNull: false,
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
