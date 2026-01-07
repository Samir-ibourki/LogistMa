import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface ZoneAttributes {
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  radius: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ZoneCreationAttributes extends Optional<ZoneAttributes, 'id'> {}

class Zone extends Model<ZoneAttributes, ZoneCreationAttributes> implements ZoneAttributes {
  public id!: string;
  public name!: string;
  public centerLat!: number;
  public centerLng!: number;
  public radius!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Zone.init(
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
    centerLat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    centerLng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    radius: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'zones',
  }
);

export default Zone;
