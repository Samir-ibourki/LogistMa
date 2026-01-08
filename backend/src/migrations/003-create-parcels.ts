import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('parcels', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    trackingCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'assigned', 'picked_up', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    pickupAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickupLat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    pickupLng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryLat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    deliveryLng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    zoneId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'zones',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    driverId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'drivers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('parcels');
}
