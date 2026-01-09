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
  declare id: string;
  declare name: string;
  declare centerLat: number;
  declare centerLng: number;
  declare radius: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
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
