import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import Parcel from './Parcel.js';
import Driver from './Driver.js';

interface DeliveryAttributes {
  id: string;
  parcelId: string;
  driverId: string;
  status: 'assigned' | 'picked_up' | 'delivered' | 'failed';
  estimatedRoute: string;
  receiptGenerated: boolean;
  startedAt: Date;
  completedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DeliveryCreationAttributes extends Optional<DeliveryAttributes, 'id'> {}

class Delivery extends Model<DeliveryAttributes, DeliveryCreationAttributes> implements DeliveryAttributes {
  declare id: string;
  declare parcelId: string;
  declare driverId: string;
  declare status: 'assigned' | 'picked_up' | 'delivered' | 'failed';
  declare estimatedRoute: string;
  declare receiptGenerated: boolean;
  declare startedAt: Date;
  declare completedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Delivery.init(
  {
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
  },
  {
    sequelize,
    tableName: 'deliveries',
  }
);

export default Delivery;
