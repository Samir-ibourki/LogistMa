import { DataTypes } from 'sequelize';
export async function up(queryInterface) {
    await queryInterface.createTable('deliveries', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        parcelId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'parcels',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        driverId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'drivers',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        status: {
            type: DataTypes.ENUM('assigned', 'picked_up', 'delivered', 'failed'),
            allowNull: false,
            defaultValue: 'assigned',
        },
        estimatedRoute: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        receiptGenerated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
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
export async function down(queryInterface) {
    await queryInterface.dropTable('deliveries');
}
