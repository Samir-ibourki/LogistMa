import { DataTypes } from 'sequelize';
export async function up(queryInterface) {
    await queryInterface.createTable('drivers', {
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
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        status: {
            type: DataTypes.ENUM('available', 'busy', 'offline'),
            allowNull: false,
            defaultValue: 'offline',
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
    await queryInterface.dropTable('drivers');
}
